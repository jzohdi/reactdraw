import React from "react";
import { STRAIGHT_LINE_TOOL_ID } from "../constants";
import { DrawingData, DrawingTools, Point } from "../types";
import { scaleSvg, setContainerRect } from "../utils";
import { drawLineFromStartToEnd } from "../utils/onDrawingUtils";
import { createCircle, createLineSvg, createSvg } from "../utils/svgUtils";
import { HorizontalLineIcon } from "@jzohdi/jsx-icons";

type Orientation = "left" | "right" | "up" | "down" | "nw" | "ne" | "se" | "sw";
type StraightLineCustomData = {
  orientation: Orientation;
};

const straightLineTool: DrawingTools = {
  id: STRAIGHT_LINE_TOOL_ID,
  icon: <HorizontalLineIcon />,
  onDrawStart: (data) => {
    const div = data.container.div;
    const lineWidth = data.style.lineWidth;
    const newSvg = createSvg(lineWidth, lineWidth);
    const newPath = createCircle(lineWidth / 2);
    newSvg.appendChild(newPath);
    div.append(newSvg);
    data.element = newSvg;
    data.customData = {};
  },
  onDrawing: (data, viewContainer) => {
    setContainerRect(data);
    const firstPoint = data.coords[0];
    const lastPoint = data.coords[data.coords.length - 1];
    const orientation = calcOrientation(firstPoint, lastPoint);
    (data.customData as StraightLineCustomData).orientation = orientation;
    const newSvg = makeLineInOrientation(data, orientation);
    const div = data.container.div;
    // const newSvg = makeLineSvg(data, viewContainer);
    div.innerHTML = "";
    div.appendChild(newSvg);
    data.element = newSvg;
    data.coords.splice(1);
  },
  onDrawEnd: (data) => {},
  onResize(data, ctx) {
    const orientation = (data.customData as StraightLineCustomData).orientation;
    const newSvg = makeLineInOrientation(data, orientation);
    const div = data.container.div;
    div.removeChild(data.element as SVGSVGElement);
    console.log();
    // const newSvg = makeLineSvg(data, viewContainer);
    div.appendChild(newSvg);
    data.element = newSvg;
    data.coords.splice(1);
    // scaleSvg(data.element as SVGSVGElement, data.container.bounds);
  },
};

export default straightLineTool;

function calcOrientation(pointA: Point, pointB: Point): Orientation {
  const [x1, y1] = pointA;
  const [x2, y2] = pointB;
  if (x2 === x1) {
    if (y2 > y1) {
      return "down";
    }
    return "up";
  }
  if (y2 === y1) {
    if (x2 > x1) {
      return "right";
    }
    return "left";
  }
  if (x2 < x1 && y2 < y1) {
    return "nw";
  }
  if (x2 > x1 && y2 < y1) {
    return "ne";
  }
  if (x2 > x1 && y2 > y1) {
    return "se";
  }
  return "sw";
}

function makeLineInOrientation(
  data: DrawingData,
  orientation: Orientation
): SVGSVGElement {
  const { bounds } = data.container;
  const width = bounds.right - bounds.left;
  const height = bounds.bottom - bounds.top;
  const newSvg = createSvg(width, height);
  newSvg.style.overflow = "visible";
  const [start, end] = getStartEnd(width, height, orientation);
  const lineSvg = createLineSvg(data.style.lineWidth);
  lineSvg.setAttribute("x1", start[0].toString());
  lineSvg.setAttribute("y1", start[1].toString());
  lineSvg.setAttribute("x2", end[0].toString());
  lineSvg.setAttribute("y2", end[1].toString());
  newSvg.appendChild(lineSvg);
  return newSvg;
}

function getStartEnd(
  width: number,
  height: number,
  orientation: Orientation
): [Point, Point] {
  if (orientation === "right") {
    return [
      [0, 0],
      [width, 0],
    ];
  }
  if (orientation === "left") {
    return [
      [width, 0],
      [0, 0],
    ];
  }
  if (orientation === "down") {
    return [
      [0, 0],
      [0, height],
    ];
  }
  if (orientation === "up") {
    return [
      [0, height],
      [0, 0],
    ];
  }
  if (orientation === "nw") {
    return [
      [width, height],
      [0, 0],
    ];
  }
  if (orientation === "ne") {
    return [
      [0, height],
      [width, 0],
    ];
  }
  if (orientation === "se") {
    return [
      [0, 0],
      [width, height],
    ];
  }
  return [
    [width, 0],
    [0, height],
  ];
}

function makeLineSvg(
  data: DrawingData,
  viewContainer: HTMLDivElement
): SVGSVGElement {
  const lineWidth = data.style.lineWidth;
  const { bounds } = data.container;
  // const width = bounds
  const width = bounds.right - bounds.left;
  const height = bounds.bottom - bounds.top;
  const newSvg = createSvg(width + lineWidth, height + lineWidth);
  const lineEle = drawLineFromStartToEnd(data, viewContainer);
  newSvg.appendChild(lineEle);
  return newSvg;
}
