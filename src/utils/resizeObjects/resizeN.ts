import { getBoxSize } from "..";
import { DrawingData, OnResizeContext } from "../../types";
import { getDiffCoords } from "../resizeObject";
import { getRotateFromDiv } from "../select/getRotateFromDiv";


/**
 * For resizeN
 * 1. take original top left (x, y)
 * 2. rotate around center (cx, cy) - this gives you the displayed top left corner
 * 3. slide the displayed corner in the y direction by the difference 
 * 4. get the new center
 * 5. rotate the new displayed corner back around the new center    
 *
 * @param data 
 * @param ctx 
 */
export function resizeN(data: DrawingData, ctx: OnResizeContext) {
  let [xDiff, yDiff] = getDiffCoords(data, ctx);
  xDiff = 0;
	const bounds = getBoxSize(data);
  const div = data.containerDiv;
  const currentRotation = getRotateFromDiv(div);
  if (
    bounds.left >= bounds.right + xDiff ||
    bounds.bottom <= bounds.top + yDiff
  ) {
  }
  const newTop = bounds.top + yDiff;
  div.style.top = newTop + "px";
  div.style.width = bounds.width + xDiff + "px";
  div.style.height = bounds.bottom - newTop + "px";
}
