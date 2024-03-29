import { PencilBoldIcon } from "@jzohdi/jsx-icons";
import React from "react";
import { CUSTOM_DATA_ORIGINAL_BOUNDS } from "../../constants";
import { DrawingData, DrawingTools, Point } from "../../types";
import {
  distance,
  expandContainer,
  getBoxSize,
  mapPointToRect,
  scaleSvg,
  //   makeRelativeDiv,
} from "../../utils";
import { createCircle, createPathSvg, createSvg } from "../../utils/svgUtils";
import {
  redoDelete,
  saveCreateToUndoStack,
  undoCreate,
  undoEleOpacity,
  undoSvgPathColor,
  undoSvgPathWidth,
} from "../../utils/undo";
import { updateSvgPathStroke } from "../../utils/updateStyles/color";
import { updateSvgPathWidth } from "../../utils/updateStyles/linewidth";
import { updateEleOpacity } from "../../utils/updateStyles/opacity";

const cursorPencilBase64 = `PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTQiIHZpZXdCb3g9IjAgMCAxNCAxNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEwLjU4NTggMC41ODU3ODZDMTEuMzY2OCAtMC4xOTUyNjIgMTIuNjMzMiAtMC4xOTUyNjIgMTMuNDE0MiAwLjU4NTc4NkMxNC4xOTUzIDEuMzY2ODMgMTQuMTk1MyAyLjYzMzE2IDEzLjQxNDIgMy40MTQyMUwxMi42MjEzIDQuMjA3MTFMOS43OTI4OSAxLjM3ODY4TDEwLjU4NTggMC41ODU3ODZaIiBmaWxsPSIjMTExODI3Ii8+CjxwYXRoIGQ9Ik04LjM3ODY4IDIuNzkyODlMMCAxMS4xNzE2VjE0SDIuODI4NDJMMTEuMjA3MSA1LjYyMTMyTDguMzc4NjggMi43OTI4OVoiIGZpbGw9IiMxMTE4MjciLz4KPC9zdmc+`;

const freeDrawTool: DrawingTools = {
  id: "free-draw-tool",
  tooltip: "Free draw tool",
  icon: <PencilBoldIcon />,
  onDrawStart: (data) => {
    const lineWidth = parseInt(data.style.lineWidth);
    const newSvg = createSvg(lineWidth, lineWidth, data.style.opacity);
    newSvg.style.overflow = "visible";
    const newPath = createCircle(lineWidth / 2, data.style.color);
    newSvg.appendChild(newPath);
    data.containerDiv.appendChild(newSvg);
    data.element = newSvg;
  },
  onDrawing: (data, ctx) => {
    smoothCoords(data.coords);
    expandContainer(data);
    const boxSize = getBoxSize(data);
    const newSvg = createSvg(boxSize.width, boxSize.height, data.style.opacity);
    newSvg.style.overflow = "visible";
    const path = svgPathFromData(data, ctx.viewContainer);
    newSvg.appendChild(path);
    data.containerDiv.innerHTML = "";
    data.containerDiv.appendChild(newSvg);
    data.element = newSvg;
  },
  onDrawEnd: (data, ctx) => {
    saveCreateToUndoStack(data, ctx);
    saveOriginalBoundsToData(data);
    if (ctx.shouldSelectAfterCreate) {
      ctx.selectObject(data);
    }
  },
  onResize: (data, ctx) => {
    if (!data.element) {
      return;
    }
    scaleSvg(data.element as SVGSVGElement, getBoxSize(data));
  },
  undoHandlers: {
    create: undoCreate,
    delete: redoDelete,
    color: undoSvgPathColor,
    lineWidth: undoSvgPathWidth,
    opacity: undoEleOpacity,
  },
  redoHandlers: {
    create: undoCreate,
    delete: redoDelete,
    color: undoSvgPathColor,
    lineWidth: undoSvgPathWidth,
    opacity: undoEleOpacity,
  },
  styleHandlers: {
    color: (data, value, _ctx) => updateSvgPathStroke(data, value),
    lineWidth: (data, value, _ctx) => updateSvgPathWidth(data, value),
    opacity: (data, value, _ctx) => updateEleOpacity(data, value),
  },
  cursor: `url(data:image/svg+xml;base64,${cursorPencilBase64}) 0 16, pointer`,
};

export default freeDrawTool;

export function svgPathFromData(
  data: DrawingData,
  viewContainer: HTMLDivElement
): SVGPathElement {
  const newPath = createPathSvg(data.style);
  newPath.setAttribute("d", getPathDString(data, viewContainer));
  return newPath;
}
function getPathDString(
  data: DrawingData,
  viewContainer: HTMLDivElement
): string {
  let pathString = "";
  //   let lastPoint = data.coords[0];
  for (let i = 0; i < data.coords.length; i++) {
    const point = data.coords[i];
    const mappedPoint = mapPointToRect(point, data.containerDiv, viewContainer);
    pathString += getPathPoint(mappedPoint, i);
    // pathString += getPathPoint(mappedPoint, lastPoint, i);
    // lastPoint = mappedPoint;
    if (i !== data.coords.length - 1) {
      pathString += " ";
    }
  }
  return pathString;
}

function getPathPoint(curr: Point, index: number): string {
  if (index === 0) {
    return `M ${curr[0]} ${curr[1]}`;
  }
  return `L ${curr[0]} ${curr[1]}`;
}

function smoothCoords(coords: Point[]): void {
  const cLen = coords.length;
  if (cLen < 3) {
    return;
  }
  const first = coords[cLen - 3];
  //  const middle = coords[cLen - 2];
  const last = coords[cLen - 1];
  if (distance(first, last) < 10) {
    coords.splice(cLen - 2, 1);
  }
  if (distance(first, last) < 20) {
    coords[cLen - 2] = average(first, last);
  }
}

function average(a: Point, b: Point): Point {
  const [ax, ay] = a;
  const [bx, by] = b;
  return [
    Math.min(ax, bx) + Math.abs(ax - bx) / 2,
    Math.min(ay, by) + Math.abs(ay - by) / 2,
  ];
}

function saveOriginalBoundsToData(data: DrawingData): void {
  data.customData.set(CUSTOM_DATA_ORIGINAL_BOUNDS, getBoxSize(data));
}
