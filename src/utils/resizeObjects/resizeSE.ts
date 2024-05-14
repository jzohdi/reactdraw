import { DrawingData, OnResizeContext } from "../../types";
import { getDiffCoords, unifiedResizeFunction } from "../resizeObject";
import { forcePreserveAspectRatio, getAspectRatioInput } from "./aspectRatio";

export function resizeSE(data: DrawingData, ctx: OnResizeContext) {
  const [dX, dY] = getDiffCoords(data, ctx);
  if (!ctx.shouldPreserveAspectRatio) {
    return unifiedResizeFunction(data, [dX / 2, -dY / 2], [dX, dY]);
  }
  const aspectRatioES = getAspectRatioInput(data, ctx, "ES");
  const [dxWithAspectRatio, _y] = forcePreserveAspectRatio(
    [dX, dY],
    data,
    aspectRatioES
  );
  const aspectRatioSE = getAspectRatioInput(data, ctx, "SE");
  const [_x, dyWithAspectRatio] = forcePreserveAspectRatio(
    [dX, dY],
    data,
    aspectRatioSE
  );
  return unifiedResizeFunction(
    data,
    [dxWithAspectRatio / 2, -dyWithAspectRatio / 2],
    [dxWithAspectRatio, dyWithAspectRatio]
  );
}
