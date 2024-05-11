import { DrawingData, OnResizeContext } from "../../types";
import { getDiffCoords, unifiedResizeFunction } from "../resizeObject";
import { forcePreserveAspectRatio } from "./aspectRatio";

export function resizeE(
  data: DrawingData,
  ctx: OnResizeContext,
  preserveAR?: boolean
) {
  let dXdY = getDiffCoords(data, ctx);
  if (preserveAR) {
    const [xDiff, _yDiff] = forcePreserveAspectRatio(dXdY, data, "E");
    return unifiedResizeFunction(data, [xDiff / 2, 0], [xDiff, 0]);
  }
  unifiedResizeFunction(data, [dXdY[0] / 2, 0], [dXdY[0], 0]);
}
