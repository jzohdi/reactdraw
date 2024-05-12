import { DrawingData, OnResizeContext } from "../../types";
import { getDiffCoords, unifiedResizeFunction } from "../resizeObject";
import { forcePreserveAspectRatio } from "./aspectRatio";

export function resizeS(
  data: DrawingData,
  ctx: OnResizeContext,
  preserveAR?: "SW" | "SE"
) {
  let dXdY = getDiffCoords(data, ctx);
  if (preserveAR !== undefined) {
    const [_xDiff, yDiff] = forcePreserveAspectRatio(dXdY, data, preserveAR);
    return unifiedResizeFunction(data, [0, -yDiff / 2], [0, yDiff]);
  }
  unifiedResizeFunction(data, [0, -dXdY[1] / 2], [0, dXdY[1]]);
}
