import { getBoxSize } from "..";
import { DrawingData, OnResizeContext } from "../../types";
import { getDiffCoords } from "../resizeObject";

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
