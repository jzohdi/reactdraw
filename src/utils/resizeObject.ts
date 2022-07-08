import { DrawingData, Point } from "../types";

export function resizeNE(data: DrawingData, point: Point) {
  const [xDiff, yDiff] = point;
  const container = data.container;
  const bounds = container.bounds;
  const div = container.div;
  if (
    bounds.left + 5 >= bounds.right + xDiff ||
    bounds.bottom - 5 <= bounds.top + yDiff
  ) {
    return;
  }
  bounds.top += yDiff;
  bounds.right += xDiff;
  div.style.top = bounds.top + "px";
  div.style.width = bounds.right - bounds.left + "px";
  div.style.height = bounds.bottom - bounds.top + "px";
}

export function resizeNW(data: DrawingData, point: Point) {
  const [xDiff, yDiff] = point;
  const container = data.container;
  const bounds = container.bounds;
  const div = container.div;
  if (
    bounds.left + xDiff >= bounds.right - 5 ||
    bounds.bottom - 5 <= bounds.top + yDiff
  ) {
    return;
  }
  bounds.top += yDiff;
  bounds.left += xDiff;
  div.style.top = bounds.top + "px";
  div.style.left = bounds.left + "px";
  div.style.width = bounds.right - bounds.left + "px";
  div.style.height = bounds.bottom - bounds.top + "px";
}

export function resizeSE(data: DrawingData, point: Point) {
  const [xDiff, yDiff] = point;
  const container = data.container;
  const bounds = container.bounds;
  const div = container.div;
  if (
    bounds.left + 5 >= bounds.right + xDiff ||
    bounds.bottom + yDiff <= bounds.top + 5
  ) {
    return;
  }
  bounds.right += xDiff;
  bounds.bottom += yDiff;
  div.style.width = bounds.right - bounds.left + "px";
  div.style.height = bounds.bottom - bounds.top + "px";
}

export function resizeSW(data: DrawingData, point: Point) {
  const [xDiff, yDiff] = point;
  const container = data.container;
  const bounds = container.bounds;
  const div = container.div;
  if (
    bounds.left + xDiff >= bounds.right - 5 ||
    bounds.bottom + yDiff <= bounds.top + 5
  ) {
    return;
  }
  bounds.bottom += yDiff;
  bounds.left += xDiff;
  div.style.left = bounds.left + "px";
  div.style.width = bounds.right - bounds.left + "px";
  div.style.height = bounds.bottom - bounds.top + "px";
}
