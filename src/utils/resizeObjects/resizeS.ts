import { DrawingData, OnResizeContext } from "../../types";
import { getDiffCoords, unifiedResizeFunction } from "../resizeObject";
import { AspectRatioParam, forcePreserveAspectRatio } from "./aspectRatio";

/**
 * If given param "aspectRatio", the function will try to resize
 * using a possibly different dY by calculating to preserve the
 * current aspect ratio
 */
export function resizeS(
  data: DrawingData,
  ctx: OnResizeContext,
  aspectRatio?: AspectRatioParam
) {
  let dXdY = getDiffCoords(data, ctx);
  if (aspectRatio !== undefined) {
    const [_xDiff, yDiff] = forcePreserveAspectRatio(dXdY, data, aspectRatio);
    return unifiedResizeFunction(data, [0, -yDiff / 2], [0, yDiff]);
  }
  return unifiedResizeFunction(data, [0, -dXdY[1] / 2], [0, dXdY[1]]);
}
