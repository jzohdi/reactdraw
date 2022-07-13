import React, { useEffect, useMemo, useRef, useState } from "react";
import Container from "./Container";
import { TopToolBar } from "./TopToolBar";
import {
  CapturedEvent,
  CustomState,
  DrawingData,
  DrawingDataMap,
  DrawingTools,
  LayoutOption,
  Point,
  ReactChild,
  ReactDrawContext,
  ReactDrawProps,
} from "../types";
import { Children } from "react";
import {
  getRelativePoint,
  getTouchCoords,
  makeid,
  makeNewBoundingDiv,
} from "../utils";
import { changeCtxForTool } from "../utils/utils";

export default function ReactDraw({
  children,
  topBarTools,
  hideTopBar,
  ...props
}: ReactDrawProps): JSX.Element {
  const drawingAreaRef = useRef<HTMLDivElement>(null);
  const [currentDrawingTool, setCurrentDrawingTool] = useState(topBarTools[0]);
  const { layout } = validateProps(children, props.layout);
  const renderedElementsMap = useRef<DrawingDataMap>({});
  const currDrawObj = useRef<DrawingData | null>(null);
  const [currentLineWidth, setCurrentLineWidth] = useState(4);
  const drawingAreaId = useRef<string>(`drawing-area-container-${makeid(6)}`);
  const previousMousePos = useRef<Point | null>(null);
  const latestEvent = useRef<CapturedEvent>(null);
  const customState = useRef<CustomState>(setupCustomStateSpace(topBarTools));

  const getReactDrawContext = (): ReactDrawContext => {
    const viewContainer = getViewContainer();
    const fullState = customState.current;
    return {
      viewContainer,
      objectsMap: renderedElementsMap.current,
      lastEvent: latestEvent.current,
      prevMousePosition: previousMousePos,
      drawingTools: topBarTools,
      customState: fullState[currentDrawingTool.id],
      fullState,
    };
  };

  function alertToolOfKeydown(e: KeyboardEvent) {
    if (currentDrawingTool.onKeyPress) {
      currentDrawingTool.onKeyPress(e, getReactDrawContext());
    }
  }

  const getViewContainer = () => {
    const viewContainer = drawingAreaRef.current;
    if (!viewContainer) {
      throw new Error("no view container while resizing");
    }
    return viewContainer;
  };

  /**
   * @param eventTarget The target of the mouse or touch event
   * @param relativePoint a point [x, y] relative to the drawing area box
   * @returns
   */
  function starDraw(relativePoint: Point) {
    const container = getViewContainer();
    const newDrawingData = makeNewBoundingDiv(
      relativePoint,
      currentLineWidth,
      currentDrawingTool.id
    );
    currDrawObj.current = newDrawingData;
    container.append(newDrawingData.container.div);
    currentDrawingTool.onDrawStart(newDrawingData, container);
  }

  function drawing(relativePoint: Point) {
    // need to do this first because currentDrawing data is null during
    // select mode.
    const currentDrawingData = currDrawObj.current;
    if (!currentDrawingData) {
      return;
    }
    const ctx = getReactDrawContext();
    currentDrawingData.coords.push(relativePoint);
    currentDrawingTool.onDrawing(currentDrawingData, ctx);
  }

  function endDraw(relativePoint: Point) {
    const currentDrawingData = currDrawObj.current;
    // currentSelectMode.current = null;
    previousMousePos.current = null;
    currDrawObj.current = null;
    if (!currentDrawingData) {
      return;
    }
    currentDrawingData.coords.push(relativePoint);
    renderedElementsMap.current[currentDrawingData.container.id] =
      currentDrawingData;
    currentDrawingTool.onDrawEnd(currentDrawingData, getReactDrawContext());
  }

  useEffect(() => {
    const container = drawingAreaRef.current;
    if (!container) {
      return;
    }
    function startDrawMouse(e: MouseEvent) {
      latestEvent.current = e;
      const startPoint: Point = [e.clientX, e.clientY];
      const relativePoint = getRelativePoint(startPoint, container);
      starDraw(relativePoint);
    }

    function drawMouse(e: MouseEvent) {
      latestEvent.current = e;
      const point: Point = [e.clientX, e.clientY];
      const relativePoint = getRelativePoint(point, container);
      drawing(relativePoint);
    }

    function endDrawMouse(e: MouseEvent) {
      latestEvent.current = e;
      const point: Point = [e.clientX, e.clientY];
      const relativePoint = getRelativePoint(point, container);
      endDraw(relativePoint);
    }

    function startDrawTouch(e: TouchEvent) {
      latestEvent.current = e;
      e.preventDefault();
      const startPoint = getTouchCoords(e);
      const relativePoint = getRelativePoint(startPoint, container);
      starDraw(relativePoint);
    }

    function drawTouch(e: TouchEvent) {
      latestEvent.current = e;
      e.preventDefault();
      const point = getTouchCoords(e);
      const relativePoint = getRelativePoint(point, container);
      drawing(relativePoint);
    }
    function endDrawTouch(e: TouchEvent) {
      latestEvent.current = e;
      e.preventDefault();
      const startPoint = getTouchCoords(e);
      const relativePoint = getRelativePoint(startPoint, container);
      endDraw(relativePoint);
    }

    container.addEventListener("mousedown", startDrawMouse);
    container.addEventListener("mouseup", endDrawMouse);
    container.addEventListener("mousemove", drawMouse);
    container.addEventListener("touchstart", startDrawTouch, {
      passive: false,
    });
    container.addEventListener("touchmove", drawTouch, { passive: false });
    container.addEventListener("touchcancel", endDrawTouch);
    container.addEventListener("touchend", endDrawTouch);
    container.addEventListener("mouseleave", endDrawMouse);
    window.addEventListener("keydown", alertToolOfKeydown);
    return () => {
      container.removeEventListener("mousedown", startDrawMouse);
      container.removeEventListener("mouseup", endDrawMouse);
      container.removeEventListener("mousemove", drawMouse);
      container.removeEventListener("touchstart", startDrawTouch);
      container.removeEventListener("touchmove", drawTouch);
      container.removeEventListener("touchcancel", endDrawTouch);
      container.removeEventListener("touchend", endDrawTouch);
      container.removeEventListener("mouseleave", endDrawMouse);
      window.removeEventListener("keydown", alertToolOfKeydown);
      //TODO: call on delete for each object
    };
  }, [currentDrawingTool]);

  const handleSelectTopTool = (toolId: string) => {
    if (currentDrawingTool.id !== toolId) {
      const selectedTool = getToolById(topBarTools, toolId);
      if (!!selectedTool) {
        const currentTool = currentDrawingTool;
        const currentCtx = getReactDrawContext();
        if (currentTool.onUnPickTool) {
          currentTool.onUnPickTool(currentCtx);
        }
        if (selectedTool.onPickTool) {
          selectedTool.onPickTool(
            changeCtxForTool(currentCtx, selectedTool.id)
          );
        }
        setCurrentDrawingTool(selectedTool);
      }
    }
  };

  return (
    <Container layout={layout}>
      {!hideTopBar && (
        <TopToolBar
          tools={topBarTools}
          onSelectTool={handleSelectTopTool}
          currentTool={currentDrawingTool.id}
        />
      )}
      <div
        id={drawingAreaId.current}
        style={{
          position: "relative",
          width: "100%",
          flex: 1,
          boxSizing: "border-box",
        }}
        ref={drawingAreaRef}
      >
        {children}
      </div>
      <div></div>
      <style>{`
		#${drawingAreaId.current} {
			cursor: ${currentDrawingTool.cursor || "defautl"};
		}
	  `}</style>
    </Container>
  );
}

function validateProps(children: ReactChild, layout?: LayoutOption) {
  const numChildren = Children.count(children);
  if (numChildren > 1) {
    throw new Error("ReactDraw expects either 0 or 1 children, detected more.");
  }
  if (layout === undefined) {
    layout = "default";
  }
  return { numChildren, layout };
}

function getToolById(tools: DrawingTools[], id: string): DrawingTools {
  const tool = tools.find((t) => t.id === id);
  if (!tool) {
    throw new Error("could not find the used tool");
  }
  return tool;
}
function setupCustomStateSpace(tools: DrawingTools[]): CustomState {
  const state: CustomState = {};
  return tools.reduce((prev, curr) => {
    prev[curr.id] = {};
    if (curr.setupCustomState) {
      prev[curr.id] = curr.setupCustomState(prev[curr.id]);
    }
    return prev;
  }, state);
}
