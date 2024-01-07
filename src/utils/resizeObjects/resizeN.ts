import { DrawingData, OnResizeContext } from "../../types";
import { getDiffCoords, unifiedResizeFunction } from "../resizeObject";

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
  let [_xDiff, yDiff] = getDiffCoords(data, ctx);
  unifiedResizeFunction(data, [0, -yDiff / 2], [0, -yDiff]);
}
