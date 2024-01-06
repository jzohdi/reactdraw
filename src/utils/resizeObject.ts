import { BoxSize, getBoxSize } from ".";
import { DrawingData, OnResizeContext, Point } from "../types";
import { getRotateFromDiv } from "./select/getRotateFromDiv";
import { clamp, getCenterPoint } from "./utils";

export function getDiffCoords(data: DrawingData, ctx: OnResizeContext): Point {
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
  const [relativePrevX, relativePrevY] = getPointRelativeToOther(
    ctx.previousPoint,
    center
  );
  const [relativeNewX, relativeNewY] = getPointRelativeToOther(
    ctx.newPoint,
    center
  );
  // const [rotatedPrevX, rotatedPrevY] = rotatePointAroundOrigin(relativePrevX, relativePrevY, currRotation);
  const rotatedPrev = rotatePointAroundOrigin(
    relativePrevX,
    relativePrevY,
    -currRotation
  );
  // const [rotatedNewX, rotatedNewY] = rotatePointAroundOrigin(relativeNewX, relativeNewY, currRotation);
  const rotatedNew = rotatePointAroundOrigin(
    relativeNewX,
    relativeNewY,
    -currRotation
  );
  return getPointRelativeToOther(rotatedNew, rotatedPrev);
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

const LARGEST_X_DIFF = 4;

export function unifiedResizeFunction(
  div: HTMLDivElement,
  bounds: BoxSize,
  currentRotation: number,
  xDiff: number,
  yDiff: number
) {
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
    rotatePointAroundOrigin(xDiff / 2, yDiff, currentRotation);
  const [noramlizedNewCornerX, normalizedNewCornerY] =
    rotatePointAroundAnotherPoint(
      normalizedRotatedCornerX,
      normalizedRotatedCornerY,
      normalizedRotatedCenterX,
      normalizedRotatedCenterY,
      currentRotation
    );
  return {
    top: previousCenterY - normalizedNewCornerY,
    left: noramlizedNewCornerX + previousCenterX,
  };
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
) {
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
