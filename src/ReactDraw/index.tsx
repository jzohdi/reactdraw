import React, { useEffect, useMemo, useRef, useState } from "react";
import Container from "./Container";
import { TopToolBar } from "./TopToolBar";
import {
  CurrentDrawingData,
  DrawingTools,
  DrawingToolsWithId,
  LayoutOption,
  Point,
  ReactChild,
  ReactDrawProps,
} from "../types";
import { Children } from "react";
import {
  dragDivs,
  getRelativePoint,
  getTouchCoords,
  isRectBounding,
  makeid,
  makeNewBoundingDiv,
} from "../utils";
import SelectTool from "../SelectTool";
import { CURSOR_ID } from "../constants";
import {
  selectElement,
  selectManyElements,
  unselectAll,
  unselectElement,
} from "./utils";

type ElementsMap = {
  [id: string]: CurrentDrawingData;
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
  const topTools = useMemo(() => getTopTools(topBarTools), [topBarTools]);
  const [currentDrawingTool, setCurrentDrawingTool] = useState(topTools[0]);
  const { layout } = validateProps(children, props.layout);
  const renderedElementsMap = useRef<ElementsMap>({});
  const currentElement = useRef<CurrentDrawingData | null>(null);
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
  //   const handleStartDragging = () => {

  //   }

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
      const target = e.target as HTMLDivElement;
      if (target.id.includes("select-frame")) {
        previousMousePos.current = relativePoint;
        currentSelectMode.current = "drag";
        // target.addEventListener("mousemove", handleMove);
        // target.addEventListener("mouseup", () => {
        //   target.removeEventListener("mousemove", handleMove);
        // });
        // handleStartDragging()
        return;
      } else {
        unselectEverything();
      }
      const newDrawingData = makeNewBoundingDiv(
        relativePoint,
        currentLineWidth
      );
      currentElement.current = newDrawingData;
      container?.append(newDrawingData.container.div);
      currentDrawingTool.onDrawStart(newDrawingData, container);
    }

    function drawMouse(e: MouseEvent) {
      const currentDrawingData = currentElement.current;
      if (!currentDrawingData || !container) {
        return;
      }
      const point: Point = [e.clientX, e.clientY];
      const relativePoint = getRelativePoint(point, container);
      //   console.log("got here");
      if (currentSelectMode.current !== null) {
        // handleSelectToolOperation(relativePoint);
        // previousMousePos.current = relativePoint;
        return;
      }
      currentDrawingData.coords.push(relativePoint);
      currentDrawingTool.onDrawing(currentDrawingData, container);
      if (CURSOR_ID === currentDrawingTool.id) {
        handleTrySelectObjects(currentDrawingData, renderedElementsMap.current);
      }
    }

    function endDrawMouse() {
      const currentDrawingData = currentElement.current;
      if (!currentDrawingData || !container) {
        return;
      }
      if (currentDrawingTool.id === CURSOR_ID) {
        currentSelectMode.current = null;
        previousMousePos.current = null;
      }
      currentElement.current = null;
      renderedElementsMap.current[currentDrawingData.container.id] =
        currentDrawingData;
      currentDrawingTool.onDrawEnd(currentDrawingData, container);
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
    currData: CurrentDrawingData,
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

  const handleSelectTopTool = (toolId: string) => {
    if (currentDrawingTool.id !== toolId) {
      const selectedTool = topTools.find((tool) => tool.id === toolId);
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
        tools={topTools}
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

function getTopTools(topTools: DrawingTools[]): DrawingToolsWithId[] {
  return [SelectTool].concat(
    topTools.map(({ id, ...rest }) => {
      if (id === CURSOR_ID) {
        throw new Error("Cannot give tool with reserved cursor id");
      }
      return !!id ? { id, ...rest } : { ...rest, id: makeid(6) };
    })
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
