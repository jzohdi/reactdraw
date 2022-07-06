import React, { useEffect, useMemo, useRef, useState } from "react";
import Container from "./Container";
import { TopToolBar } from "./TopToolBar";
import {
  DrawingData,
  DrawingTools,
  LayoutOption,
  Point,
  ReactChild,
  ReactDrawProps,
  RectBounds,
} from "../types";
import { Children } from "react";
import {
  addPointToBounds,
  distance,
  dragDivs,
  getRelativePoint,
  getTouchCoords,
  isRectBounding,
  makeBoundingRect,
  makeid,
  makeNewBoundingDiv,
} from "../utils";
import SelectTool from "../SelectTool";
import { CURSOR_ID, SELECT_TOOL_DRAG_MIN_DISTANCE } from "../constants";
import {
  selectElement,
  selectManyElements,
  unselectAll,
  unselectElement,
} from "./utils";

type ElementsMap = {
  [id: string]: DrawingData;
};

type SelectMode =
  | "drag"
  | "rotate"
  | "resizeTL"
  | "resizeTR"
  | "resizeBR"
  | "resizeBL";

export default function ReactDraw({
  children,
  topBarTools,
  ...props
}: ReactDrawProps): JSX.Element {
  topBarTools = [SelectTool].concat(topBarTools);
  const drawingAreaRef = useRef<HTMLDivElement>(null);
  const [currentDrawingTool, setCurrentDrawingTool] = useState(topBarTools[0]);
  const { layout } = validateProps(children, props.layout);
  const renderedElementsMap = useRef<ElementsMap>({});
  const currDrawObj = useRef<DrawingData | null>(null);
  const [currentLineWidth, setCurrentLineWidth] = useState(4);
  const drawingAreaId = useRef<string>(`drawing-area-container-${makeid(6)}`);
  const currentlySelectedElements = useRef<string[]>([]);
  const previousMousePos = useRef<Point | null>(null);
  const currentSelectMode = useRef<SelectMode | null>(null);

  const handleSelectToolOperation = (newPoint: Point) => {
    const prevPoint = previousMousePos.current;
    if (!prevPoint) {
      return;
    }
    if (currentSelectMode.current === "drag") {
      dragDivs(
        currentlySelectedElements.current.map(
          (id) => renderedElementsMap.current[id]
        ),
        prevPoint,
        newPoint
      );
    }
  };

  const unselectEverything = () => {
    unselectAll(
      currentlySelectedElements.current.map(
        (id) => renderedElementsMap.current[id]
      )
    );
    currentSelectMode.current = null;
    previousMousePos.current = null;
    currentlySelectedElements.current = [];
  };

  useEffect(() => {
    const container = drawingAreaRef.current;
    if (!container) {
      return;
    }

    function handleMove(e: MouseEvent) {
      if (
        previousMousePos.current !== null &&
        currentSelectMode.current !== null
      ) {
        const point: Point = [e.clientX, e.clientY];
        const relativePoint = getRelativePoint(point, container);
        handleSelectToolOperation(relativePoint);
        previousMousePos.current = relativePoint;
      }
    }
    function handleStopMove() {
      if (
        previousMousePos.current !== null &&
        currentSelectMode.current !== null
      ) {
        currentSelectMode.current = null;
        previousMousePos.current = null;
      }
    }
    function startDrawMouse(e: MouseEvent) {
      if (!container) {
        return;
      }
      const startPoint: Point = [e.clientX, e.clientY];
      const relativePoint = getRelativePoint(startPoint, container);
      const target = e.target as HTMLDivElement | HTMLButtonElement;
      //   console.log("got here");
      if (target.id.includes("select-frame")) {
        previousMousePos.current = relativePoint;
        currentSelectMode.current = "drag";
        return;
      } else {
        unselectEverything();
      }
      const newDrawingData = makeNewBoundingDiv(
        relativePoint,
        currentLineWidth
      );
      currDrawObj.current = newDrawingData;
      container?.append(newDrawingData.container.div);
      currentDrawingTool.onDrawStart(newDrawingData, container);
    }

    function drawMouse(e: MouseEvent) {
      const currentDrawingData = currDrawObj.current;
      if (!currentDrawingData || !container) {
        return;
      }
      const point: Point = [e.clientX, e.clientY];
      const relativePoint = getRelativePoint(point, container);
      if (currentSelectMode.current !== null) {
        return;
      }
      currentDrawingData.coords.push(relativePoint);
      currentDrawingTool.onDrawing(currentDrawingData, container);
      if (CURSOR_ID === currentDrawingTool.id) {
        handleTrySelectObjects(currentDrawingData, renderedElementsMap.current);
      }
    }

    function endDrawMouse(e: MouseEvent) {
      const currentDrawingData = currDrawObj.current;
      if (!currentDrawingData || !container) {
        return;
      }
      const point: Point = [e.clientX, e.clientY];
      const relativePoint = getRelativePoint(point, container);
      currentSelectMode.current = null;
      previousMousePos.current = null;
      currDrawObj.current = null;
      currentDrawingTool.onDrawEnd(currentDrawingData, container);
      if (CURSOR_ID !== currentDrawingTool.id) {
        renderedElementsMap.current[currentDrawingData.container.id] =
          currentDrawingData;
      } else {
        // if the distance from mouse down to mouse up is small, then see if user tried to select something.
        const firstPoint = currentDrawingData.coords[0];
        if (
          distance(relativePoint, firstPoint) < SELECT_TOOL_DRAG_MIN_DISTANCE
        ) {
          const bounds = addPointToBounds(
            makeBoundingRect(firstPoint),
            relativePoint
          );
          handleTryClickObject(renderedElementsMap.current, bounds);
        }
      }
    }

    function startDrawTouch(e: TouchEvent) {
      const startPoint = getTouchCoords(e);
      const relativePoint = getRelativePoint(startPoint, container);
    }

    function endDrawTouch() {}

    function drawTouch(e: TouchEvent) {
      const point = getTouchCoords(e);
      const relativePoint = getRelativePoint(point, container);
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
    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseup", handleStopMove);
    return () => {
      container.removeEventListener("mousedown", startDrawMouse);
      container.removeEventListener("mouseup", endDrawMouse);
      container.removeEventListener("mousemove", drawMouse);
      container.removeEventListener("touchstart", startDrawTouch);
      container.removeEventListener("touchmove", drawTouch);
      container.removeEventListener("touchcancel", endDrawTouch);
      container.removeEventListener("touchend", endDrawTouch);
      container.removeEventListener("mouseleave", endDrawMouse);
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseup", handleStopMove);
    };
  }, [currentDrawingTool]);

  // TODO: only select after checking all,
  // if more than one selected changed the type
  const handleTrySelectObjects = (
    currData: DrawingData,
    renderedMap: ElementsMap
  ) => {
    let elementIdsToSelect = [];
    for (const elementId in renderedMap) {
      const eleData = renderedMap[elementId];
      unselectElement(eleData);
      if (isRectBounding(currData.container.bounds, eleData.container.bounds)) {
        elementIdsToSelect.push(elementId);
      }
    }
    if (elementIdsToSelect.length === 1) {
      selectElement(renderedMap[elementIdsToSelect[0]]);
    } else if (elementIdsToSelect.length > 1) {
      selectManyElements(elementIdsToSelect.map((id) => renderedMap[id]));
    }
    currentlySelectedElements.current = elementIdsToSelect;
  };

  const handleTryClickObject = (
    renderedMap: ElementsMap,
    bounds: RectBounds
  ) => {
    let itemToSelect = null;
    for (const eleId in renderedMap) {
      const eleData = renderedMap[eleId];
      unselectElement(eleData);
      if (isRectBounding(eleData.container.bounds, bounds)) {
        const eleIsOnTop =
          itemToSelect?.style.zIndex ?? 0 < eleData.style.zIndex;
        if (eleIsOnTop) {
          itemToSelect = eleData;
        }
      }
    }
    if (itemToSelect !== null) {
      selectElement(itemToSelect);
      currentlySelectedElements.current = [itemToSelect.container.id];
    }
  };

  const handleSelectTopTool = (toolId: string) => {
    if (currentDrawingTool.id !== toolId) {
      const selectedTool = topBarTools.find(
        (tool: DrawingTools) => tool.id === toolId
      );
      if (!!selectedTool) {
        setCurrentDrawingTool(selectedTool);
      }
    }
    if (toolId !== CURSOR_ID) {
      unselectEverything();
    }
  };

  return (
    <Container layout={layout}>
      <TopToolBar
        tools={topBarTools}
        onSelectTool={handleSelectTopTool}
        currentTool={currentDrawingTool.id}
      />
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
