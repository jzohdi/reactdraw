import { DiamondBoldIcon } from "@jzohdi/jsx-icons";
import React from "react";
import { DIAMOND_TOOL_ID } from "../constants";
import { DrawingData, DrawingTools, RectBounds } from "../types";
import { createSvg, scaleSvg, setContainerRect } from "../utils";
import { createPathSvg } from "../utils/svgUtils";

const diamondTool: DrawingTools = {
  id: DIAMOND_TOOL_ID,
  icon: <DiamondBoldIcon />,
  onDrawStart: (data) => {
    const div = data.container.div;
    const newSvg = makeDiamondSvg(data);
    div.appendChild(newSvg);
  },
  onDrawing: (data) => {
    setContainerRect(data);
    const div = data.container.div;
    const newSvg = makeDiamondSvg(data);
    div.innerHTML = "";
    div.appendChild(newSvg);
    data.element = newSvg;
    data.coords.splice(1);
  },
  onDrawEnd: (data) => {},
  onUpdate(data, ctx) {
    scaleSvg(data.element as SVGSVGElement, data.container.bounds);
    // setContainerRect(data);
    // const div = data.container.div;
    // const newSvg = makeDiamondSvg(data);
    // div.removeChild(data.element);
    // div.appendChild(newSvg);
    // data.element = newSvg;
  },
};

export default diamondTool;

function makeDiamondSvg(data: DrawingData): SVGSVGElement {
  const lineWidth = data.style.lineWidth;
  const { bounds } = data.container;
  // const width = bounds
  const width = bounds.right - bounds.left;
  const height = bounds.bottom - bounds.top;
  const newSvg = createSvg(width + lineWidth, height + lineWidth);
  const path = drawDiamondInBounds(bounds, data.style.lineWidth);
  newSvg.appendChild(path);
  return newSvg;
}

function drawDiamondInBounds(
  bounds: RectBounds,
  lineWidth: number
): SVGPathElement {
  const newPath = createPathSvg(lineWidth);
  newPath.setAttribute("d", getPathDiamondString(bounds, lineWidth));
  return newPath;
}

function getPathDiamondString(bounds: RectBounds, lineWidth: number): string {
  const height = bounds.bottom - bounds.top;
  const width = bounds.right - bounds.left;
  // left corner -> top -> right -> bottom -> left
  const leftCorner = `${lineWidth / 2} ${height / 2}`;
  const topCorner = `L ${width / 2} ${lineWidth / 2}`;
  const rightCorner = `L ${width - lineWidth / 2} ${height / 2}`;
  const bottomCorner = `L ${width / 2} ${height - lineWidth / 2}`;
  return `M ${leftCorner} ${topCorner} ${rightCorner} ${bottomCorner} L ${leftCorner}`;
}
