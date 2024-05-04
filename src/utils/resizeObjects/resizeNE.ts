import { getBoxSize } from "..";
import { DrawingData, OnResizeContext, Point } from "../../types";
import { resizeE } from "./resizeE";
import { resizeN } from "./resizeN";

export function resizeNE(data: DrawingData, ctx: OnResizeContext) {
  forcePreserveAspectRatio(data, ctx);
  resizeN(data, ctx);
  resizeE(data, ctx);
}

function forcePreserveAspectRatio(data: DrawingData, ctx: OnResizeContext) {
  if (!ctx.shouldPreserveAspectRatio) {
    return;
  }
  const currentAspectRatio = getCurrentAspectRatio(data);
  const newAspectRatio = calcAspectRatioFromPoints(
    ctx.newPoint,
    ctx.previousPoint
  );
  // if the newAspectRatio is larger, then the change in x is bigger, so calculate y
  if (newAspectRatio > currentAspectRatio) {
    ctx.newPoint = [ctx.newPoint[0], calcY(ctx.newPoint, currentAspectRatio)];
  } // if the newAspectRatio is smaller, then change in y is bigger, so calculate x
  else if (newAspectRatio < currentAspectRatio) {
    ctx.newPoint = [calcX(ctx.newPoint, currentAspectRatio), ctx.newPoint[1]];
  }
}

function getCurrentAspectRatio(data: DrawingData) {
  const box = getBoxSize(data);
  const ratio = box.width / box.height;
  return ratio;
}

function calcAspectRatioFromPoints(newPoint: Point, prevPoint: Point) {
  const [nX, nY] = newPoint;
  const [pX, pY] = prevPoint;
  const dy = Math.abs(pY - nY);
  const dx = Math.abs(pX - nX);
  return dx / dy;
}

// ratio = x/y so to get new y, multiple 1/ratio * newX
function calcY(point: Point, ratio: number): number {
  const [x, y] = point;
  return (1 / ratio) * x;
}

// ratio = x/y so to get new X, multiple ratio * new y
function calcX(point: Point, ratio: number): number {
  const [x, y] = point;
  return ratio * y;
}
