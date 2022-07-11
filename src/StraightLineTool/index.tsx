import React from "react";
import { STRAIGHT_LINE_TOOL_ID } from "../constants";
import { DrawingData, DrawingTools } from "../types";
import { scaleSvg, setContainerRect } from "../utils";
import { drawLineFromStartToEnd } from "../utils/onDrawingUtils";
import { createCircle, createSvg } from "../utils/svgUtils";
import { HorizontalLineIcon } from "@jzohdi/jsx-icons";

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
  onResize(data, ctx) {
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
  const lineEle = drawLineFromStartToEnd(data, viewContainer);
  newSvg.appendChild(lineEle);
  return newSvg;
}
