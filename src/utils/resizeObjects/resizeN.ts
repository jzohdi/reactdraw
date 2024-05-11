import { DrawingData, OnResizeContext } from "../../types";
import { getDiffCoords, unifiedResizeFunction } from "../resizeObject";
import { forcePreserveAspectRatio } from "./aspectRatio";

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
export function resizeN(
  data: DrawingData,
  ctx: OnResizeContext,
  preserveAR?: boolean
) {
  const dXdY = getDiffCoords(data, ctx);
  if (preserveAR) {
    const [_xDiff, yDiff] = forcePreserveAspectRatio(dXdY, data, "N");
    return unifiedResizeFunction(data, [0, -yDiff / 2], [0, -yDiff]);
  }
  unifiedResizeFunction(data, [0, -dXdY[1] / 2], [0, -dXdY[1]]);
}
