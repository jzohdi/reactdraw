import React, { useEffect, useRef, useState } from "react";
import Container from "./Container";
import { TopToolBar } from "./TopToolBar";
import {
  CurrentDrawingData,
  DrawingTools,
  LayoutOption,
  Point,
  ReactChild,
} from "./types";
import { Children } from "react";
import {
  getRelativePoint,
  getTouchCoords,
  makeid,
  makeNewBoundingDiv,
} from "./utils";

export type ReactDrawProps = {
  children?: ReactChild;
  layout?: LayoutOption;
  topBarTools: DrawingTools[];
};

type ElementsMap = {
  [id: string]: CurrentDrawingData;
};

export default function ReactDraw({
  children,
  topBarTools,
  ...props
}: ReactDrawProps): JSX.Element {
  const drawingAreaRef = useRef<HTMLDivElement>(null);
  const topTools = getTopTools(topBarTools);
  const [currentDrawingTool, setCurrentDrawingTool] = useState(topTools[0]);
  const { layout } = validateProps(children, props.layout);
  const renderedElementsMap = useRef<ElementsMap>({});
  const currentElement = useRef<CurrentDrawingData | null>(null);
  const [currentLineWidth, setCurrentLineWidth] = useState(4);
  const drawingAreaId = useRef<string>(`drawing-area-container-${makeid(6)}`);
  useEffect(() => {
    const container = drawingAreaRef.current;
    if (!container) {
      return;
    }
    function startDrawMouse(e: MouseEvent) {
      if (!container) {
        return;
      }
      const startPoint: Point = [e.clientX, e.clientY];
      const relativePoint = getRelativePoint(startPoint, container);
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
      currentDrawingData.coords.push(relativePoint);
      currentDrawingTool.onDrawing(currentDrawingData, container);
    }

    function endDrawMouse() {
      const currentDrawingData = currentElement.current;
      if (!currentDrawingData || !container) {
        return;
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

    return () => {
      container.removeEventListener("mousedown", startDrawMouse);
      container.removeEventListener("mouseup", endDrawMouse);
      container.removeEventListener("mousemove", drawMouse);
      container.removeEventListener("touchstart", startDrawTouch);
      container.removeEventListener("touchmove", drawTouch);
      container.removeEventListener("touchcancel", endDrawTouch);
      container.removeEventListener("touchend", endDrawTouch);
    };
  }, []);

  const handleSelectTopTool = (toolId: string) => {
    if (currentDrawingTool.id !== toolId) {
      const selectedTool = topTools.find((tool) => tool.id === toolId);
      if (!!selectedTool) {
        setCurrentDrawingTool(selectedTool);
      }
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

type DrawingToolsWithId = DrawingTools & { id: string };

function getTopTools(topTools: DrawingTools[]): DrawingToolsWithId[] {
  return topTools.map(({ id, ...rest }) =>
    !!id ? { id, ...rest } : { ...rest, id: makeid(6) }
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
