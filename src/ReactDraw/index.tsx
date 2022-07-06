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
    const { objects } = getSelectedDrawingObjects();
    if (currentSelectMode.current === "drag") {
      dragDivs(objects, prevPoint, newPoint);
    }
  };

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
    const container = drawingAreaRef.current;
    if (!container) {
      return;
    }
    const target = eventTarget as HTMLDivElement | HTMLButtonElement;
    if (didStartSelectAction(target, relativePoint)) {
      return;
    }
    if (!(isUsingSelectTool() && didPressShift)) {
      unselectEverythingAndReturnPrevious();
    }
    const newDrawingData = makeNewBoundingDiv(relativePoint, currentLineWidth);
    currDrawObj.current = newDrawingData;
    container?.append(newDrawingData.container.div);
    currentDrawingTool.onDrawStart(newDrawingData, container);
  }

  function drawing(relativePoint: Point) {
    // need to do this first because currentDrawing data is null during
    // select mode.
    if (isPerformingSelectAction()) {
      return;
    }
    const container = drawingAreaRef.current;
    const currentDrawingData = currDrawObj.current;
    if (!currentDrawingData || !container) {
      return;
    }
    currentDrawingData.coords.push(relativePoint);
    currentDrawingTool.onDrawing(currentDrawingData, container);
    if (CURSOR_ID === currentDrawingTool.id) {
      handleTrySelectObjects(currentDrawingData, renderedElementsMap.current);
    }
  }

  function endDraw(relativePoint: Point, didPressShift: boolean) {
    const currentDrawingData = currDrawObj.current;
    const container = drawingAreaRef.current;
    if (!currentDrawingData || !container) {
      return;
    }
    currentSelectMode.current = null;
    previousMousePos.current = null;
    currDrawObj.current = null;
    currentDrawingTool.onDrawEnd(currentDrawingData, container);
    if (!isUsingSelectTool()) {
      renderedElementsMap.current[currentDrawingData.container.id] =
        currentDrawingData;
      return;
    }
    tryClickObject(currentDrawingData, relativePoint, didPressShift);
  }

  /**
   * If the user is using the select tool, the draw end function couldve
   * been intended to click on an object. We can check for this by
   * checking if the [x,y] position of the click on mouseup/touchend (lastPoint),
   * is within a min distnace from the initial [x, y] start.
   * @param drawingData
   * @param lastPoint
   */
  const tryClickObject = (
    drawingData: DrawingData,
    lastPoint: Point,
    didPressShift: boolean
  ) => {
    // if the distance from mouse down to mouse up is small, then see if user tried to select something.
    const firstPoint = drawingData.coords[0];
    if (distance(lastPoint, firstPoint) < SELECT_TOOL_DRAG_MIN_DISTANCE) {
      const bounds = addPointToBounds(makeBoundingRect(firstPoint), lastPoint);
      handleTryClickObject(renderedElementsMap.current, bounds, didPressShift);
    }
  };

  const isUsingSelectTool = (): boolean => {
    return CURSOR_ID === currentDrawingTool.id;
  };

  const isPerformingSelectAction = (): boolean => {
    return (
      previousMousePos.current !== null && currentSelectMode.current !== null
    );
  };

  /**
   * Checks if the event target is an object that should
   * start a selection action (clicking on the select-frame,
   * click on one of the expand corner buttons, rotate button)
   */
  const didStartSelectAction = (
    target: HTMLDivElement | HTMLButtonElement,
    relativePoint: Point
  ): boolean => {
    if (!target) {
      throw new Error("Did start select action recieved null as target");
    }
    if (target.id.includes("select-frame")) {
      previousMousePos.current = relativePoint;
      currentSelectMode.current = "drag";
      return true;
    }
    return false;
  };

  function moveObject(relativePoint: Point) {
    if (isPerformingSelectAction()) {
      handleSelectToolOperation(relativePoint);
      previousMousePos.current = relativePoint;
    }
  }

  useEffect(() => {
    const container = drawingAreaRef.current;
    if (!container) {
      return;
    }

    function handleMouseMoveObject(e: MouseEvent) {
      const point: Point = [e.clientX, e.clientY];
      const relativePoint = getRelativePoint(point, container);
      moveObject(relativePoint);
    }
    function handleTouchMoveObject(e: TouchEvent) {
      const startPoint = getTouchCoords(e);
      const relativePoint = getRelativePoint(startPoint, container);
      moveObject(relativePoint);
    }
    function handleStopMoveObject() {
      currentSelectMode.current = null;
      previousMousePos.current = null;
    }
    function startDrawMouse(e: MouseEvent) {
      const startPoint: Point = [e.clientX, e.clientY];
      const relativePoint = getRelativePoint(startPoint, container);
      starDraw(e.target, relativePoint, e.shiftKey);
    }

    function drawMouse(e: MouseEvent) {
      const point: Point = [e.clientX, e.clientY];
      const relativePoint = getRelativePoint(point, container);
      drawing(relativePoint);
    }

    function endDrawMouse(e: MouseEvent) {
      const point: Point = [e.clientX, e.clientY];
      const relativePoint = getRelativePoint(point, container);
      endDraw(relativePoint, e.shiftKey);
    }

    function startDrawTouch(e: TouchEvent) {
      const startPoint = getTouchCoords(e);
      const relativePoint = getRelativePoint(startPoint, container);
      starDraw(e.target, relativePoint, e.shiftKey);
    }

    function drawTouch(e: TouchEvent) {
      const point = getTouchCoords(e);
      const relativePoint = getRelativePoint(point, container);
      drawing(relativePoint);
    }
    function endDrawTouch(e: TouchEvent) {
      const startPoint = getTouchCoords(e);
      const relativePoint = getRelativePoint(startPoint, container);
      endDraw(relativePoint, e.shiftKey);
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
    window.addEventListener("mousemove", handleMouseMoveObject);
    window.addEventListener("mouseup", handleStopMoveObject);
    window.addEventListener("touchmove", handleTouchMoveObject, {
      passive: false,
    });
    window.addEventListener("touchend", handleStopMoveObject);
    return () => {
      container.removeEventListener("mousedown", startDrawMouse);
      container.removeEventListener("mouseup", endDrawMouse);
      container.removeEventListener("mousemove", drawMouse);
      container.removeEventListener("touchstart", startDrawTouch);
      container.removeEventListener("touchmove", drawTouch);
      container.removeEventListener("touchcancel", endDrawTouch);
      container.removeEventListener("touchend", endDrawTouch);
      container.removeEventListener("mouseleave", endDrawMouse);
      window.removeEventListener("mousemove", handleMouseMoveObject);
      window.removeEventListener("mouseup", handleStopMoveObject);
      window.removeEventListener("touchmove", handleTouchMoveObject);
      window.removeEventListener("touchend", handleStopMoveObject);
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
    handleSelectIds(elementIdsToSelect);
  };

  const handleTryClickObject = (
    renderedMap: ElementsMap,
    bounds: RectBounds,
    didPressShift: boolean
  ) => {
    let itemToSelect = null;
    for (const eleId in renderedMap) {
      const eleData = renderedMap[eleId];
      if (isRectBounding(eleData.container.bounds, bounds)) {
        const eleIsOnTop =
          itemToSelect?.style.zIndex ?? 0 < eleData.style.zIndex;
        if (eleIsOnTop) {
          itemToSelect = eleData;
        }
      }
    }

    // unselect everything.
    let { ids } = unselectEverythingAndReturnPrevious();

    // if did not press shift, all prev will be not selected
    if (!didPressShift) {
      ids = [];
    }
    // if item to select found, add to ids
    if (itemToSelect !== null) {
      ids = ids.concat([itemToSelect.container.id]);
    }
    handleSelectIds(ids);
  };

  const handleSelectIds = (objectIds: string[]) => {
    currentlySelectedElements.current = objectIds;
    const objects = getElementsByIds(objectIds);
    if (objects.length === 1) {
      return selectElement(objects[0]);
    }
    if (objects.length > 1) {
      return selectManyElements(objects);
    }
  };
  const getElementsByIds = (ids: string[]): DrawingData[] => {
    return ids.map((id) => renderedElementsMap.current[id]);
  };

  const unselectEverythingAndReturnPrevious = () => {
    const { objects, ids } = getSelectedDrawingObjects();
    unselectAll(objects);
    currentSelectMode.current = null;
    previousMousePos.current = null;
    currentlySelectedElements.current = [];
    return { ids, objects };
  };
  const getSelectedDrawingObjects = () => {
    const ids = currentlySelectedElements.current;
    return {
      objects: getElementsByIds(ids),
      ids,
    };
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
      unselectEverythingAndReturnPrevious();
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
