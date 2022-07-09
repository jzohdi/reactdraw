import { PencilBoldIcon } from "@jzohdi/jsx-icons";
import React from "react";
import { DrawingData, DrawingTools, Point } from "../types";
import {
  expandContainer,
  createCircle,
  createSvg,
  mapPointToRect,
  scaleSvg,
  //   makeRelativeDiv,
} from "../utils";
import { createPathSvg } from "../utils/svgUtils";

const cursorPencilBase64 = `PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTQiIHZpZXdCb3g9IjAgMCAxNCAxNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEwLjU4NTggMC41ODU3ODZDMTEuMzY2OCAtMC4xOTUyNjIgMTIuNjMzMiAtMC4xOTUyNjIgMTMuNDE0MiAwLjU4NTc4NkMxNC4xOTUzIDEuMzY2ODMgMTQuMTk1MyAyLjYzMzE2IDEzLjQxNDIgMy40MTQyMUwxMi42MjEzIDQuMjA3MTFMOS43OTI4OSAxLjM3ODY4TDEwLjU4NTggMC41ODU3ODZaIiBmaWxsPSIjMTExODI3Ii8+CjxwYXRoIGQ9Ik04LjM3ODY4IDIuNzkyODlMMCAxMS4xNzE2VjE0SDIuODI4NDJMMTEuMjA3MSA1LjYyMTMyTDguMzc4NjggMi43OTI4OVoiIGZpbGw9IiMxMTE4MjciLz4KPC9zdmc+`;

const freeDrawTool: DrawingTools = {
  id: "free-draw-tool",
  icon: <PencilBoldIcon />,
  onDrawStart: (data) => {
    const lineWidth = data.style.lineWidth;
    // const relativeDiv = makeRelativeDiv();
    const newSvg = createSvg(lineWidth, lineWidth);
    // const newPath = createPath();
    // newSvg.style.transform = "scale(1.0, 1.0)";
    const newPath = createCircle(lineWidth / 2);
    newSvg.appendChild(newPath);
    // relativeDiv.appendChild(newSvg);
    // data.container.div.appendChild(relativeDiv);
    data.container.div.appendChild(newSvg);
    data.element = newSvg;
  },
  onDrawing: (data, viewContainer) => {
    expandContainer(data);
    const boxSize = getBoxSize(data);
    const newSvg = createSvg(boxSize.width, boxSize.height);

    // const relativeDiv = makeRelativeDiv();
    const path = svgPathFromData(data, viewContainer);
    // path.style.width = boxSize.width + "px";
    // path.style.height = boxSize.height + "px";
    newSvg.appendChild(path);
    data.container.div.innerHTML = "";
    // relativeDiv.appendChild(newSvg);
    // data.container.div.appendChild(relativeDiv);
    data.container.div.appendChild(newSvg);
    data.element = newSvg;
  },
  onDrawEnd: (data) => {
    console.log("free draw end");
  },
  onUpdate: (data, ctx) => {
    if (!data.element) {
      return;
    }
    scaleSvg(data.element as SVGSVGElement, data.container.bounds);
  },
  cursor: `url('data:image/svg+xml;base64,${cursorPencilBase64}') 0 16, pointer`,
};

export default freeDrawTool;

function getBoxSize(data: DrawingData) {
  const bounds = data.container.bounds;
  return {
    width: bounds.right - bounds.left,
    height: bounds.bottom - bounds.top,
  };
}

function svgPathFromData(
  data: DrawingData,
  viewContainer: HTMLDivElement
): SVGPathElement {
  const newPath = createPathSvg(data.style.lineWidth);
  newPath.setAttribute("d", getPathDString(data, viewContainer));
  return newPath;
}
function getPathDString(
  data: DrawingData,
  viewContainer: HTMLDivElement
): string {
  let pathString = "";
  let lastPoint = data.coords[0];
  for (let i = 0; i < data.coords.length; i++) {
    const point = data.coords[i];
    const mappedPoint = mapPointToRect(point, data.container, viewContainer);
    pathString += getPathPoint(mappedPoint, lastPoint, i);
    lastPoint = mappedPoint;
    if (i !== data.coords.length - 1) {
      pathString += " ";
    }
  }
  return pathString;
}

function getPathPoint(curr: Point, prev: Point, index: number): string {
  if (index === 0) {
    return `M ${curr[0]} ${curr[1]}`;
  }
  return `l ${curr[0] - prev[0]} ${curr[1] - prev[1]}`;
}
