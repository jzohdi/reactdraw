import { getBoxSize } from "..";
import { DrawingData, OnResizeContext } from "../../types";
import { getDiffCoords } from "../resizeObject";

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
