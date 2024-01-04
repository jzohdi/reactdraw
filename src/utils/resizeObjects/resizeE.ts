import { getBoxSize } from "..";
import { DrawingData, OnResizeContext } from "../../types";
import { getRotateFromDiv } from "../select/getRotateFromDiv";
import { getDiffCoords, unifiedResizeFunction } from "../resizeObject";

export function resizeE(data: DrawingData, ctx: OnResizeContext) {
  let [xDiff, yDiff] = getDiffCoords(data, ctx);
  yDiff = 0;
  const bounds = getBoxSize(data);
  const div = data.containerDiv;
  const currentRotation = getRotateFromDiv(div);
  const { top, left } = unifiedResizeFunction(
    div,
    bounds,
    currentRotation,
    xDiff,
    yDiff
  );
  // debugger;
  div.style.top = top + "px";
  // debugger;
  div.style.left = left + "px";
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
