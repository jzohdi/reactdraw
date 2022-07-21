import { PencilBoldIcon } from "@jzohdi/jsx-icons";
import React from "react";
import { DrawingData, DrawingTools, Point } from "../types";
import {
  expandContainer,
  getBoxSize,
  mapPointToRect,
  scaleSvg,
  //   makeRelativeDiv,
} from "../utils";
import { createCircle, createPathSvg, createSvg } from "../utils/svgUtils";
import {
  redoDelete,
  saveCreateToUndoStack,
  undoCreate,
  undoSvgPathColor,
} from "../utils/undo";
import { updateSvgPathStroke } from "../utils/updateStyles/color";

const cursorPencilBase64 = `PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTQiIHZpZXdCb3g9IjAgMCAxNCAxNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEwLjU4NTggMC41ODU3ODZDMTEuMzY2OCAtMC4xOTUyNjIgMTIuNjMzMiAtMC4xOTUyNjIgMTMuNDE0MiAwLjU4NTc4NkMxNC4xOTUzIDEuMzY2ODMgMTQuMTk1MyAyLjYzMzE2IDEzLjQxNDIgMy40MTQyMUwxMi42MjEzIDQuMjA3MTFMOS43OTI4OSAxLjM3ODY4TDEwLjU4NTggMC41ODU3ODZaIiBmaWxsPSIjMTExODI3Ii8+CjxwYXRoIGQ9Ik04LjM3ODY4IDIuNzkyODlMMCAxMS4xNzE2VjE0SDIuODI4NDJMMTEuMjA3MSA1LjYyMTMyTDguMzc4NjggMi43OTI4OVoiIGZpbGw9IiMxMTE4MjciLz4KPC9zdmc+`;

const freeDrawTool: DrawingTools = {
  id: "free-draw-tool",
  tooltip: "Free draw tool",
  icon: <PencilBoldIcon />,
  getEditableStyles() {
    return ["color", "lineWidth"];
  },
  onDrawStart: (data) => {
    const lineWidth = parseInt(data.style.lineWidth);
    // const relativeDiv = makeRelativeDiv();
    const newSvg = createSvg(lineWidth, lineWidth);
    newSvg.style.overflow = "visible";
    // const newPath = createPath();
    // newSvg.style.transform = "scale(1.0, 1.0)";
    const newPath = createCircle(lineWidth / 2, data.style.color);
    newSvg.appendChild(newPath);
    // relativeDiv.appendChild(newSvg);
    // data.container.div.appendChild(relativeDiv);
    data.container.div.appendChild(newSvg);
    data.element = newSvg;
  },
  onDrawing: (data, { viewContainer }) => {
    expandContainer(data);
    const boxSize = getBoxSize(data);
    const newSvg = createSvg(boxSize.width, boxSize.height);
    // console.log(newSvg);
    newSvg.style.overflow = "visible";
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
  onDrawEnd: (data, ctx) => {
    // console.log("free draw end");
    saveCreateToUndoStack(data, ctx);
    if (ctx.shouldSelectAfterCreate) {
      ctx.selectObject(data);
    }
  },
  onResize: (data, ctx) => {
    if (!data.element) {
      return;
    }
    scaleSvg(data.element as SVGSVGElement, data.container.bounds);
  },
  onUndo(action, ctx) {
    if (action.action === "create") {
      return undoCreate(action, ctx);
    }
    if (action.action === "color") {
      return undoSvgPathColor(action, ctx);
    }
    console.error("Unsupported action: ", action);
    throw new Error();
  },
  onRedo(action, ctx) {
    if (action.action === "delete") {
      return redoDelete(action, ctx);
    }
    if (action.action === "color") {
      return undoSvgPathColor(action, ctx);
    }
    console.error("unsupported action:", action);
    throw new Error();
  },
  onUpdateStyle(data, ctx, key, value) {
    if (key === "color") {
      return updateSvgPathStroke(data, value);
    }
    console.log(key, value, data);
    throw new Error("unknown update style action");
  },
  cursor: `url('data:image/svg+xml;base64,${cursorPencilBase64}') 0 16, pointer`,
};

export default freeDrawTool;

function svgPathFromData(
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
    const mappedPoint = mapPointToRect(point, data.container, viewContainer);
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

/**
 * function getPathDString(
  data: DrawingData,
  viewContainer: HTMLDivElement
): string {
  let pathString = "";
  let prev: Point = data.coords[0];
  let prev2: Point | null = null;
  for (let i = 0; i < data.coords.length; i++) {
    const point = data.coords[i];
    const mappedPoint = mapPointToRect(point, data.container, viewContainer);
    const next =
      i < data.coords.length - 1
        ? mapPointToRect(data.coords[i + 1], data.container, viewContainer)
        : mappedPoint;
    if (i === 0) {
      pathString += `M ${mappedPoint[0]} ${mappedPoint[1]}`;
    } else {
      pathString += bezierCommand(mappedPoint, prev, prev2, next);
    }

    // pathString += getPathPoint(mappedPoint, lastPoint, i);
    if (i !== data.coords.length - 1) {
      pathString += " ";
    }
    prev = mappedPoint;
    prev2 = prev;
  }
  return pathString;
}

function lineProperties(pointA: Point, pointB: Point) {
  const lengthX = pointB[0] - pointA[0];
  const lengthY = pointB[1] - pointA[1];
  return {
    length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
    angle: Math.atan2(lengthY, lengthX),
  };
}

function controlPoint(
  current: Point,
  previous: Point | null,
  next: Point,
  reverse: boolean
) {
  // When 'current' is the first or last point of the array
  // 'previous' or 'next' don't exist.
  // Replace with 'current'
  const p = previous || current;
  const n = next || current;
  // The smoothing ratio
  const smoothing = 0.2;
  // Properties of the opposed-line
  const o = lineProperties(p, n);
  // If is end-control-point, add PI to the angle to go backward
  const angle = o.angle + (reverse ? Math.PI : 0);
  const length = o.length * smoothing;
  // The control point position is relative to the current point
  const x = current[0] + Math.cos(angle) * length;
  const y = current[1] + Math.sin(angle) * length;
  return [x, y];
}

function bezierCommand(
  point: Point,
  prev: Point,
  prev2: Point | null,
  next: Point
) {
  // start control point
  const [cpsX, cpsY] = controlPoint(prev, prev2, point, false);
  // end control point
  const [cpeX, cpeY] = controlPoint(point, prev, next, true);
  return `C ${cpsX},${cpsY} ${cpeX},${cpeY} ${point[0]},${point[1]}`;
}

 */
