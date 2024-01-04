import { getBoxSize } from "..";
import { DrawingData, OnResizeContext } from "../../types";
import { getDiffCoords } from "../resizeObject";

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
