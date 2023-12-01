import { getBoxSize } from ".";
import { DrawingData, OnResizeContext, Point } from "../types";
import { getRotateFromDiv } from "./select/getRotateFromDiv";
import { clamp, getCenterPoint } from "./utils";

function getDiffCoords(data: DrawingData, ctx: OnResizeContext): Point {
  const center = getCenterPoint(getBoxSize(data));
  const [centerX, centerY] = center;
  const currRotation = getRotateFromDiv(data.containerDiv);
  // return getPointRelativeToOther(ctx.newPoint, ctx.previousPoint);
  if (currRotation === 0) {
    return [
      ctx.newPoint[0] - ctx.previousPoint[0],
      ctx.newPoint[1] - ctx.previousPoint[1],
    ];
  }
  const rotatedNewPoint = rotatePointAroundAnotherPoint(
    ctx.newPoint[0],
    ctx.newPoint[1],
    ctx.previousPoint[0],
    ctx.previousPoint[1],
    currRotation
  );
  return getPointRelativeToOther(ctx.previousPoint, rotatedNewPoint);
  // const [relativePrevX, relativePrevY] = getPointRelativeToOther(
  //   ctx.previousPoint,
  //   center
  // );
  // const [relativeNewX, relativeNewY] = getPointRelativeToOther(
  //   ctx.newPoint,
  //   center
  // );
  // // const [rotatedPrevX, rotatedPrevY] = rotatePointAroundOrigin(relativePrevX, relativePrevY, currRotation);
  // const rotatedPrev = rotatePointAroundOrigin(
  //   relativePrevX,
  //   relativePrevY,
  //   -currRotation
  // );
  // // const [rotatedNewX, rotatedNewY] = rotatePointAroundOrigin(relativeNewX, relativeNewY, currRotation);
  // const rotatedNew = rotatePointAroundOrigin(
  //   relativeNewX,
  //   relativeNewY,
  //   -currRotation
  // );
  // return getPointRelativeToOther(rotatedNew, rotatedPrev);
  // const rotatedPrev = rotatePoint(
  //   centerX,
  //   centerY,
  //   -(currRotation * Math.PI) / 180,
  //   ctx.previousPoint
  // );
  // const rotatedNew = rotatePoint(
  //   centerX,
  //   centerY,
  //   -(currRotation * Math.PI) / 180,
  //   ctx.newPoint
  // );
  // return [rotatedNew[0] - rotatedPrev[0], rotatedNew[1] - rotatedPrev[1]];
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
const LARGEST_X_DIFF = 4;
export function resizeE(data: DrawingData, ctx: OnResizeContext) {
  // debugger;
  let [xDiff, yDiff] = getDiffCoords(data, ctx);
  yDiff = 0;
  xDiff = round(xDiff, 5);
  const bounds = getBoxSize(data);
  const div = data.containerDiv;
  const currentRotation = getRotateFromDiv(div);
  // debugger;
  // step 1: map the current top left corner to coordinates relative to the center of the div
  const [previousCenterX, previousCenterY] = getCenterPoint(bounds);
  const [relativeCornerX, relativeCornerY] = getPointRelativeToOther(
    [bounds.left, bounds.top],
    [previousCenterX, previousCenterY]
  );
  // const relativeCornerY = previousCenterY - previousCornerY;
  // const relativeCornerX = previousCornerX - previousCenterX;
  // debugger;
  // step 2: rotate the relative corner around the center
  // (this will give the actual rotated corner coordinates)
  const [normalizedRotatedCornerX, normalizedRotatedCornerY] =
    rotatePointAroundOrigin(relativeCornerX, relativeCornerY, currentRotation);

  // step 2 calculate the new center (the new center);
  // the new center when relative to the origin is dx, o
  // const newWiderCenterX = centerX + xDiff;
  // this is the new origin
  const [normalizedRotatedCenterX, normalizedRotatedCenterY] =
    rotatePointAroundOrigin(xDiff, yDiff, currentRotation);
  const [noramlizedNewCornerX, normalizedNewCornerY] =
    rotatePointAroundAnotherPoint(
      normalizedRotatedCornerX,
      normalizedRotatedCornerY,
      normalizedRotatedCenterX,
      normalizedRotatedCenterY,
      currentRotation
    );
  // debugger;
  const denormalizedCenterX = previousCenterX + normalizedRotatedCenterX;
  const denormalizedCenterY = previousCenterY - normalizedRotatedCenterY;
  // const norNewCornerX = rotatePointAroundOrigin(norm);
  // debugger;
  const clampedXDiff = clamp(xDiff, -0.1, 0.1);
  // const clampedYDiff = clamp(yDiff, -0.2, 0.2);
  const errorCorrectionY = clampedXDiff * 0.05 * Math.min(currentRotation, 100);
  div.style.top =
    previousCenterY - normalizedNewCornerY - errorCorrectionY + "px";
  const errorCorrectionX = clampedXDiff * 0.07 * Math.min(currentRotation, 180);
  // debugger;
  div.style.left =
    noramlizedNewCornerX + previousCenterX + errorCorrectionX + "px";
  div.style.width = bounds.width + xDiff + "px";
  div.style.height = bounds.height + yDiff + "px";
  // if (
  //   bounds.left >= bounds.right + xDiff ||
  //   bounds.bottom + yDiff <= bounds.top
  // ) {
  //   return;
  // }

  // const newRight = bounds.right + xDiff;
  // const newBottom = bounds.bottom + yDiff;
  // div.style.width = newRight - bounds.left + "px";
  // div.style.height = newBottom - bounds.top + "px";
}

function getPointRelativeToOther(point: Point, other: Point): Point {
  const [previousCenterX, previousCenterY] = other;
  const [previousCornerX, previousCornerY] = point;
  const relativeCornerY = previousCenterY - previousCornerY;
  const relativeCornerX = previousCornerX - previousCenterX;
  return [relativeCornerX, relativeCornerY];
}

const RESIZE_ROUNDING = 5;

function rotatePointAroundOrigin(x: number, y: number, theta: number): Point {
  // Convert theta from degrees to radians
  const radians = theta * (Math.PI / 180);

  // Apply the rotation formulas
  const rotatedX = x * Math.cos(radians) + y * Math.sin(radians);
  const rotatedY = -x * Math.sin(radians) + y * Math.cos(radians);

  return [round(rotatedX, RESIZE_ROUNDING), round(rotatedY, RESIZE_ROUNDING)];
}

export function round(num: number, decimals: number) {
  const multiplier = Math.pow(10, decimals);
  return Math.round(num * multiplier) / multiplier;
}
function rotatePointAroundAnotherPoint(
  px: number,
  py: number,
  cx: number,
  cy: number,
  theta: number
): Point {
  // Convert theta from degrees to radians
  const radians = theta * (Math.PI / 180);

  // Translate point to origin
  const translatedX = px - cx;
  const translatedY = py - cy;

  // Rotate the point around the origin
  const rotatedX =
    translatedX * Math.cos(radians) - translatedY * Math.sin(radians);
  const rotatedY =
    translatedX * Math.sin(radians) + translatedY * Math.cos(radians);

  // Translate the point back
  const finalX = rotatedX + cx;
  const finalY = rotatedY + cy;

  return [round(finalX, RESIZE_ROUNDING), round(finalY, RESIZE_ROUNDING)];
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
