import { DrawingData, OnResizeContext } from "../../types";
import { getDiffCoords, unifiedResizeFunction } from "../resizeObject";
import { AspectRatioParam, forcePreserveAspectRatio } from "./aspectRatio";

/**
 * If given param "aspectRatio", the function will try to resize
 * using a possibly different dx by calculating to preserve the
 * current aspect ratio
 */
export function resizeE(
  data: DrawingData,
  ctx: OnResizeContext,
  aspectRatio?: AspectRatioParam
) {
  let dXdY = getDiffCoords(data, ctx);
  if (aspectRatio !== undefined) {
    const [xDiff, _yDiff] = forcePreserveAspectRatio(dXdY, data, aspectRatio);
    return unifiedResizeFunction(data, [xDiff / 2, 0], [xDiff, 0]);
  }
  return unifiedResizeFunction(data, [dXdY[0] / 2, 0], [dXdY[0], 0]);
}
