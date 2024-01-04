import { getBoxSize } from "..";
import { DrawingData, OnResizeContext } from "../../types";
import { getDiffCoords } from "../resizeObject";

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
