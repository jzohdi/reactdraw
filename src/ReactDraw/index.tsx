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
  onResizeContext,
  Point,
  ReactChild,
  ReactDrawContext,
  ReactDrawProps,
  RectBounds,
  SelectMode,
} from "../types";
import { Children } from "react";
import {
  dragDivs,
  getCenterPoint,
  getRelativePoint,
  getTouchCoords,
  isRectBounding,
  makeid,
  makeNewBoundingDiv,
  rotateDiv,
} from "../utils";
import { resizeNW, resizeSE, resizeNE, resizeSW } from "../utils/resizeObject";

function requireLength1(arr: any[]): void {
  if (arr.length > 1) {
    throw new Error(
      "should not be able to preform this action on more than object"
    );
  }
}

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
    return {
      viewContainer,
      objectsMap: renderedElementsMap.current,
      lastEvent: latestEvent.current,
      prevMousePosition: previousMousePos,
      drawingTools: topBarTools,
      customState: customState.current[currentDrawingTool.id],
    };
  };

  const getViewContainer = () => {
    const viewContainer = drawingAreaRef.current;
    if (!viewContainer) {
      throw new Error("no view container while resizing");
    }
    return viewContainer;
  };

  //   const isUsingSelectTool = (): boolean => {
  //     return CURSOR_ID === currentDrawingTool.id;
  //   };

  //   const isPerformingSelectAction = (): boolean => {
  //     return (
  //       previousMousePos.current !== null && currentSelectMode.current !== null
  //     );
  //   };

  /**
   * If the select mode is to resize one of the corners, this function
   * will handle resizing of the wrapper div and then call the
   * update function of the tool that created that drawing element.
   */
  const handleResize = (
    mode: SelectMode,
    data: DrawingData,
    ctx: onResizeContext
  ) => {
    // so that relative change is used
    const pointDiff: Point = getPointDiff(ctx.newPoint, ctx.previousPoint);
    const toolUsed = getToolById(topBarTools, data.toolId);
    if (toolUsed.doResize) {
      toolUsed.doResize(data, ctx);
    } else if (mode === "resize-ne") {
      resizeNE(data, pointDiff);
    } else if (mode === "resize-nw") {
      resizeNW(data, pointDiff);
    } else if (mode === "resize-se") {
      resizeSE(data, pointDiff);
    } else if (mode === "resize-sw") {
      resizeSW(data, pointDiff);
    } else {
      throw new Error("resize mode not recognized");
    }
    toolUsed.onResize(data, ctx);
  };

  /**
   * if the drawing mode is rotate, this function will
   * handle rotating the wrapper div and return true
   * else returns false.
   */
  const didHandleRotate = (
    mode: SelectMode,
    data: DrawingData,
    newPoint: Point
  ): boolean => {
    if (mode === "rotate") {
      const referenceCenter = getCenterPoint(data.container.bounds);
      rotateDiv(data, newPoint, referenceCenter);
      return true;
    }
    return false;
  };

  const alertAfterUpdate = (data: DrawingData) => {
    const { tool, ctx } = getToolAndContext(data.toolId);
    if (!tool || !ctx || !tool.onAfterUpdate) {
      return;
    }
    tool.onAfterUpdate(data, ctx);
  };

  //   const handleSelectToolOperation = (newPoint: Point) => {
  //     const prevPoint = previousMousePos.current;
  //     if (!prevPoint) {
  //       return;
  //     }
  //     const { objects } = getSelectedDrawingObjects();
  //     const mode = currentSelectMode.current;
  //     if (mode === null) {
  //       return;
  //     }
  //     if (mode === "drag") {
  //       dragDivs(objects, prevPoint, newPoint);
  //       if (objects.length === 1) {
  //         alertAfterUpdate(objects[0]);
  //       }
  //       return;
  //     }
  //     requireLength1(objects);
  //     const item = objects[0];
  //     if (didHandleRotate(mode, item, newPoint)) {
  //       return alertAfterUpdate(item);
  //     }
  //     handleResize(mode, item, {
  //       viewContainer: getViewContainer(),
  //       previousPoint: prevPoint,
  //       newPoint,
  //       mode,
  //     });
  //     alertAfterUpdate(item);
  //   };

  /**
   * @param eventTarget The target of the mouse or touch event
   * @param relativePoint a point [x, y] relative to the drawing area box
   * @returns
   */
  function starDraw(
    eventTarget: EventTarget | null,
    relativePoint: Point,
    didPressShift: boolean
  ) {
    const container = getViewContainer();
    // const target = eventTarget as HTMLDivElement | HTMLButtonElement;
    // console.log({ target });
    // if (didStartSelectAction(target, relativePoint)) {
    //   return;
    // }
    // if (!(isUsingSelectTool() && didPressShift)) {
    //   unselectEverythingAndReturnPrevious(getReactDrawContext());
    // }
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

  /**
   * Checks if the event target is an object that should
   * start a selection action (clicking on the select frame,
   * click on one of the expand corner buttons, rotate button)
   */
  //   const didStartSelectAction = (
  //     target: HTMLDivElement | HTMLButtonElement,
  //     relativePoint: Point
  //   ): boolean => {
  //     if (!target) {
  //       throw new Error("Did start select action recieved null as target");
  //     }
  //     if (target.id.includes(SELECT_FRAME_PRE)) {
  //       //   console.log("starting selection action move");
  //       previousMousePos.current = relativePoint;
  //       currentSelectMode.current = "drag";
  //       return true;
  //     } else if (target.id.includes(ROTATE_BUTTON_PRE)) {
  //       //   console.log("starting selection action rotate ");
  //       previousMousePos.current = relativePoint;
  //       currentSelectMode.current = "rotate";
  //       return true;
  //     } else if (target.id.includes(CORNER_BUTTON_PRE)) {
  //       //   console.log("starting selection action corner ");
  //       previousMousePos.current = relativePoint;
  //       currentSelectMode.current = getCornerMode(target.id);
  //       return true;
  //     }
  //     return false;
  //   };

  //   function moveObject(relativePoint: Point) {
  //     if (isPerformingSelectAction()) {
  //       handleSelectToolOperation(relativePoint);
  //       previousMousePos.current = relativePoint;
  //     }
  //   }

  useEffect(() => {
    const container = drawingAreaRef.current;
    if (!container) {
      return;
    }

    // function handleMouseMoveObject(e: MouseEvent) {
    //   //   e.preventDefault();
    //   latestEvent.current = e;
    //   const point: Point = [e.clientX, e.clientY];
    //   const relativePoint = getRelativePoint(point, container);
    //   moveObject(relativePoint);
    // }
    // function handleTouchMoveObject(e: TouchEvent) {
    //   //   e.preventDefault();
    //   latestEvent.current = e;
    //   const startPoint = getTouchCoords(e);
    //   const relativePoint = getRelativePoint(startPoint, container);
    //   moveObject(relativePoint);
    // }
    // function handleStopMoveObject() {
    //   currentSelectMode.current = null;
    //   previousMousePos.current = null;
    // }
    function startDrawMouse(e: MouseEvent) {
      latestEvent.current = e;
      const startPoint: Point = [e.clientX, e.clientY];
      const relativePoint = getRelativePoint(startPoint, container);
      starDraw(e.target, relativePoint, e.shiftKey);
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
      starDraw(e.target, relativePoint, e.shiftKey);
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
    // window.addEventListener("mousemove", handleMouseMoveObject);
    // window.addEventListener("mouseup", handleStopMoveObject);
    // window.addEventListener("touchmove", handleTouchMoveObject, {
    //   passive: false,
    // });
    // window.addEventListener("touchend", handleStopMoveObject);
    // window.addEventListener("touchcancel", handleStopMoveObject);
    return () => {
      container.removeEventListener("mousedown", startDrawMouse);
      container.removeEventListener("mouseup", endDrawMouse);
      container.removeEventListener("mousemove", drawMouse);
      container.removeEventListener("touchstart", startDrawTouch);
      container.removeEventListener("touchmove", drawTouch);
      container.removeEventListener("touchcancel", endDrawTouch);
      container.removeEventListener("touchend", endDrawTouch);
      container.removeEventListener("mouseleave", endDrawMouse);
      //   window.removeEventListener("mousemove", handleMouseMoveObject);
      //   window.removeEventListener("mouseup", handleStopMoveObject);
      //   window.removeEventListener("touchmove", handleTouchMoveObject);
      //   window.removeEventListener("touchend", handleStopMoveObject);
      //   window.removeEventListener("touchcancel", handleStopMoveObject);
      //TODO: call on delete for each object
    };
  }, [currentDrawingTool]);

  const getToolAndContext = (toolId: string) => {
    const tool = getToolById(topBarTools, toolId);
    if (!tool) {
      return { tool: null, ctx: null };
    }
    const viewContainer = drawingAreaRef.current;
    if (!viewContainer) {
      return { tool, ctx: null };
    }
    const ctx = getReactDrawContext();
    return { tool, ctx };
  };

  const handleSelectTopTool = (toolId: string) => {
    if (currentDrawingTool.id !== toolId) {
      const selectedTool = getToolById(topBarTools, toolId);
      if (!!selectedTool) {
        const currentTool = currentDrawingTool;
        if (currentTool.onUnPickTool) {
          currentTool.onUnPickTool(getReactDrawContext());
        }
        if (selectedTool.onPickTool) {
          selectedTool.onPickTool(getReactDrawContext());
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

function getPointDiff(pointA: Point, pointB: Point): Point {
  return [pointA[0] - pointB[0], pointA[1] - pointB[1]];
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
