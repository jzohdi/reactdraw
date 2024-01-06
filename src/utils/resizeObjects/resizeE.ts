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
  div.style.top = top + "px";
  div.style.left = left + "px";
  div.style.width = bounds.width + xDiff + "px";
  div.style.height = bounds.height + yDiff + "px";
}
