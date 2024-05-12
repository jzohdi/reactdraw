import { DrawingData, OnResizeContext } from "../../types";
import { getDiffCoords, unifiedResizeFunction } from "../resizeObject";
import { forcePreserveAspectRatio } from "./aspectRatio";

export function resizeW(
  data: DrawingData,
  ctx: OnResizeContext,
  preserveAR?: "WS" | "WN"
) {
  let dXdY = getDiffCoords(data, ctx);
  if (preserveAR !== undefined) {
    const [xDiff, _yDiff] = forcePreserveAspectRatio(dXdY, data, preserveAR);
    return unifiedResizeFunction(data, [xDiff / 2, 0], [-xDiff, 0]);
  }
  unifiedResizeFunction(data, [dXdY[0] / 2, 0], [-dXdY[0], 0]);
}
