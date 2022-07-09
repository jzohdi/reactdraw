import { HorizontalLineIcon } from "@jzohdi/jsx-icons";
import React from "react";
import { STRAIGHT_LINE_TOOL_ID } from "../constants";
import { DrawingData, DrawingTools, Point } from "../types";
import {
  createCircle,
  createSvg,
  mapPointToRect,
  scaleSvg,
  setContainerRect,
} from "../utils";
import { createPathSvg } from "../utils/svgUtils";

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
  },
  onDrawing: (data, viewContainer) => {
    setContainerRect(data);
    const div = data.container.div;
    const newSvg = makeLineSvg(data, viewContainer);
    div.innerHTML = "";
    div.appendChild(newSvg);
    data.element = newSvg;
    data.coords.splice(1);
  },
  onDrawEnd: (data) => {},
  onUpdate(data, ctx) {
    scaleSvg(data.element as SVGSVGElement, data.container.bounds);
  },
};

export default straightLineTool;

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
  const path = drawLineFromStartToEnd(data, viewContainer);
  newSvg.appendChild(path);
  return newSvg;
}

function drawLineFromStartToEnd(
  data: DrawingData,
  viewContainer: HTMLDivElement
): SVGPathElement {
  const coords = data.coords;
  const lineWidth = data.style.lineWidth;
  if (coords.length < 2) {
    throw new Error("draw line from start to end must have at least 2 coords");
  }
  const pathEle = createPathSvg(lineWidth);
  // if you're not first you're last
  const first = mapPointToRect(coords[0], data.container, viewContainer);
  const last = mapPointToRect(
    coords[coords.length - 1],
    data.container,
    viewContainer
  );
  //   const
  const startPoint = `M ${first[0]} ${first[1]}`;
  const endPoint = `L ${last[0]} ${last[1]}`;
  pathEle.setAttribute("d", `${startPoint} ${endPoint}`);
  return pathEle;
}
