import { DrawingData, OnResizeContext } from "../../types";
import { getDiffCoords, unifiedResizeFunction } from "../resizeObject";
import { forcePreserveAspectRatio, getAspectRatioInput } from "./aspectRatio";

export function resizeSW(data: DrawingData, ctx: OnResizeContext) {
  const [dX, dY] = getDiffCoords(data, ctx);
  if (!ctx.shouldPreserveAspectRatio) {
    return unifiedResizeFunction(data, [dX / 2, -dY / 2], [-dX, dY]);
  }
  const aspectRatioWS = getAspectRatioInput(data, ctx, "WS");
  const [dxWithAspectRatio, _y] = forcePreserveAspectRatio(
    [dX, dY],
    data,
    aspectRatioWS
  );
  const aspectRatioSW = getAspectRatioInput(data, ctx, "SW");
  const [_x, dyWithAspectRatio] = forcePreserveAspectRatio(
    [dX, dY],
    data,
    aspectRatioSW
  );
  return unifiedResizeFunction(
    data,
    [dxWithAspectRatio / 2, -dyWithAspectRatio / 2],
    [-dxWithAspectRatio, dyWithAspectRatio]
  );
}
