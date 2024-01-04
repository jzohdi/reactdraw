import { getBoxSize } from "..";
import { DrawingData, OnResizeContext } from "../../types";
import { getDiffCoords } from "../resizeObject";

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
