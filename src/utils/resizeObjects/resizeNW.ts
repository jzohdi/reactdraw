import { DrawingData, OnResizeContext } from "../../types";
import { getDiffCoords, unifiedResizeFunction } from "../resizeObject";
import { forcePreserveAspectRatio, getAspectRatioInput } from "./aspectRatio";

export function resizeNW(data: DrawingData, ctx: OnResizeContext) {
  const [dX, dY] = getDiffCoords(data, ctx);
  if (!ctx.shouldPreserveAspectRatio) {
    return unifiedResizeFunction(data, [dX / 2, -dY / 2], [-dX, -dY]);
  }
  const aspectRatioWN = getAspectRatioInput(data, ctx, "WN");
  const [dxWithAspectRatio, _y] = forcePreserveAspectRatio(
    [dX, dY],
    data,
    aspectRatioWN
  );
  const aspectRatioNW = getAspectRatioInput(data, ctx, "NW");
  const [_x, dyWithAspectRatio] = forcePreserveAspectRatio(
    [dX, dY],
    data,
    aspectRatioNW
  );
  return unifiedResizeFunction(
    data,
    [dxWithAspectRatio / 2, -dyWithAspectRatio / 2],
    [-dxWithAspectRatio, -dyWithAspectRatio]
  );
}
