import { getBoxSize } from ".";
import { DrawingData, OnResizeContext, Point } from "../types";
import { getRotateFromDiv } from "./select/getRotateFromDiv";
import { getCenterPoint } from "./utils";

function getDiffCoords(data: DrawingData, ctx: OnResizeContext): Point {
  const [centerX, centerY] = getCenterPoint(getBoxSize(data));
  const currRotation = getRotateFromDiv(data.containerDiv);
  if (currRotation === 0) {
    return [
      ctx.newPoint[0] - ctx.previousPoint[0],
      ctx.newPoint[1] - ctx.previousPoint[1],
    ];
  }
  const rotatedPrev = rotatePoint(
    centerX,
    centerY,
    -(currRotation * Math.PI) / 180,
    ctx.previousPoint
  );
  const rotatedNew = rotatePoint(
    centerX,
    centerY,
    -(currRotation * Math.PI) / 180,
    ctx.newPoint
  );
  return [rotatedNew[0] - rotatedPrev[0], rotatedNew[1] - rotatedPrev[1]];
}

function makePoint(x: number, y: number, color: string): HTMLDivElement {
  const div = document.createElement("div");
  div.style.width = "1px";
  div.style.height = "1px";
  div.style.border = `1px solid ${color}`;
  div.style.position = "absolute";
  div.style.top = y + "px";
  div.style.left = x + "px";
  return div;
}

function rotatePoint(cx: number, cy: number, angle: number, point: Point) {
  const s = Math.sin(angle);
  const c = Math.cos(angle);
  const [px, py] = [point[0] - cx, point[1] - cy];
  const xNew = px * c - py * s;
  const yNew = px * s + py * c;

  return [xNew + cx, yNew + cy];
}

function getAspectDiffs(
  xDiff: number,
  yDiff: number,
  currX: number,
  currY: number
): [number, number] {
  if (currX === currY) {
    if (xDiff === yDiff) {
      return [xDiff, yDiff];
    } else if (xDiff > yDiff) {
      return [xDiff, xDiff];
    } else {
      return [yDiff, yDiff];
    }
  } else if (currX > currY) {
    // const ratio = currX / currY;
    // if is wider than tall and that
    if (xDiff === yDiff) {
      return [xDiff * (currX / currY), xDiff];
    } else if (xDiff > yDiff) {
      return [xDiff, xDiff * (currY / currX)];
    } else {
      return [yDiff * (currX / currY), yDiff];
    }
  } else {
    if (xDiff === yDiff) {
      return [xDiff, xDiff * (currY / currX)];
    } else if (xDiff > yDiff) {
      return [xDiff, xDiff * (currY / currX)];
    } else {
      return [yDiff * (currX / currY), yDiff];
    }
  }
}

export function resizeNE(data: DrawingData, ctx: OnResizeContext) {
  let [xDiff, yDiff] = getDiffCoords(data, ctx);
  const div = data.containerDiv;
  const bounds = getBoxSize(data);
  if (
    bounds.left >= bounds.right + xDiff ||
    bounds.bottom <= bounds.top + yDiff
  ) {
    return;
  }
  // if (ctx.shouldPreserveAspectRatio) {
  //   const ratio = bounds.width / bounds.height;
  //   xDiff = yDiff * ratio;
  //   // [xDiff, yDiff] = getAspectDiffs(xDiff, yDiff, bounds.width, bounds.height);
  // }
  const newTop = bounds.top + yDiff;
  // const newRight = bounds.right + xDiff;
  div.style.top = newTop + "px";
  div.style.width = bounds.width + xDiff + "px";
  div.style.height = bounds.bottom - newTop + "px";
}

export function resizeN(data: DrawingData, ctx: OnResizeContext) {
  let [xDiff, yDiff] = getDiffCoords(data, ctx);
  xDiff = 0;
  const div = data.containerDiv;
  const bounds = getBoxSize(data);
  if (
    bounds.left >= bounds.right + xDiff ||
    bounds.bottom <= bounds.top + yDiff
  ) {
  }
  // if (ctx.shouldPreserveAspectRatio) {
  //   const ratio = bounds.width / bounds.height;
  //   xDiff = yDiff * ratio;
  //   // [xDiff, yDiff] = getAspectDiffs(xDiff, yDiff, bounds.width, bounds.height);
  // }
  const newTop = bounds.top + yDiff;
  // const newRight = bounds.right + xDiff;
  div.style.top = newTop + "px";
  div.style.width = bounds.width + xDiff + "px";
  div.style.height = bounds.bottom - newTop + "px";
}

export function resizeNW(data: DrawingData, ctx: OnResizeContext) {
  const [xDiff, yDiff] = getDiffCoords(data, ctx);
  const div = data.containerDiv;
  const bounds = getBoxSize(data);
  if (
    bounds.left + xDiff >= bounds.right ||
    bounds.bottom <= bounds.top + yDiff
  ) {
    return;
  }
  const newTop = bounds.top + yDiff;
  const newleft = bounds.left + xDiff;
  div.style.top = newTop + "px";
  div.style.left = newleft + "px";
  div.style.width = bounds.right - newleft + "px";
  div.style.height = bounds.bottom - newTop + "px";
}

export function resizeW(data: DrawingData, ctx: OnResizeContext) {
  let [xDiff, yDiff] = getDiffCoords(data, ctx);
  yDiff = 0;
  const div = data.containerDiv;
  const bounds = getBoxSize(data);
  if (
    bounds.left + xDiff >= bounds.right ||
    bounds.bottom <= bounds.top + yDiff
  ) {
    return;
  }
  const newTop = bounds.top + yDiff;
  const newleft = bounds.left + xDiff;
  div.style.top = newTop + "px";
  div.style.left = newleft + "px";
  div.style.width = bounds.right - newleft + "px";
  div.style.height = bounds.bottom - newTop + "px";
}

export function resizeSE(data: DrawingData, ctx: OnResizeContext) {
  const [xDiff, yDiff] = getDiffCoords(data, ctx);
  const bounds = getBoxSize(data);
  const div = data.containerDiv;
  if (
    bounds.left >= bounds.right + xDiff ||
    bounds.bottom + yDiff <= bounds.top
  ) {
    return;
  }

  const newRight = bounds.right + xDiff;
  const newBottom = bounds.bottom + yDiff;
  div.style.width = newRight - bounds.left + "px";
  div.style.height = newBottom - bounds.top + "px";
}

export function resizeS(data: DrawingData, ctx: OnResizeContext) {
  let [xDiff, yDiff] = getDiffCoords(data, ctx);
  xDiff = 0;
  const bounds = getBoxSize(data);
  const div = data.containerDiv;
  if (
    bounds.left >= bounds.right + xDiff ||
    bounds.bottom + yDiff <= bounds.top
  ) {
    return;
  }

  const newRight = bounds.right + xDiff;
  const newBottom = bounds.bottom + yDiff;
  div.style.width = newRight - bounds.left + "px";
  div.style.height = newBottom - bounds.top + "px";
}
export function resizeE(data: DrawingData, ctx: OnResizeContext) {
  let [xDiff, yDiff] = getDiffCoords(data, ctx);
  yDiff = 0;
  const bounds = getBoxSize(data);
  const div = data.containerDiv;
  if (
    bounds.left >= bounds.right + xDiff ||
    bounds.bottom + yDiff <= bounds.top
  ) {
    return;
  }

  const newRight = bounds.right + xDiff;
  const newBottom = bounds.bottom + yDiff;
  div.style.width = newRight - bounds.left + "px";
  div.style.height = newBottom - bounds.top + "px";
}
export function resizeSW(data: DrawingData, ctx: OnResizeContext) {
  const [xDiff, yDiff] = getDiffCoords(data, ctx);
  const div = data.containerDiv;
  const bounds = getBoxSize(data);
  if (
    bounds.left + xDiff >= bounds.right ||
    bounds.bottom + yDiff <= bounds.top
  ) {
    return;
  }
  const newLeft = bounds.left + xDiff;
  const newBottom = bounds.bottom + yDiff;
  div.style.left = newLeft + "px";
  div.style.width = bounds.right - newLeft + "px";
  div.style.height = newBottom - bounds.top + "px";
}
