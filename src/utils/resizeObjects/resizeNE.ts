import { DrawingData, OnResizeContext } from "../../types";
import { getDiffCoords, unifiedResizeFunction } from "../resizeObject";
import { forcePreserveAspectRatio, getAspectRatioInput } from "./aspectRatio";

export function resizeNE(data: DrawingData, ctx: OnResizeContext) {
  const [dX, dY] = getDiffCoords(data, ctx);
  if (!ctx.shouldPreserveAspectRatio) {
    return unifiedResizeFunction(data, [dX / 2, -dY / 2], [dX, -dY]);
  }
  const aspectRatioEN = getAspectRatioInput(data, ctx, "EN");
  const [dxWithAspectRatio, _y] = forcePreserveAspectRatio(
    [dX, dY],
    data,
    aspectRatioEN
  );
  const aspectRatioNE = getAspectRatioInput(data, ctx, "NE");
  const [_x, dyWithAspectRatio] = forcePreserveAspectRatio(
    [dX, dY],
    data,
    aspectRatioNE
  );
  return unifiedResizeFunction(
    data,
    [dxWithAspectRatio / 2, -dyWithAspectRatio / 2],
    [dxWithAspectRatio, -dyWithAspectRatio]
  );
}
