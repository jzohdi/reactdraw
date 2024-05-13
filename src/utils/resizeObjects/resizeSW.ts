import { DrawingData, OnResizeContext } from "../../types";
import { getAspectRatioInput } from "./aspectRatio";
import { resizeS } from "./resizeS";
import { resizeW } from "./resizeW";

export function resizeSW(data: DrawingData, ctx: OnResizeContext) {
  const aspectRatio = getAspectRatioInput(data, ctx, "SW");
  const didResize = resizeS(data, ctx, aspectRatio);
  if (!didResize) {
    return;
  }
  if (aspectRatio) {
    aspectRatio.direction = "WS";
  }
  resizeW(data, ctx, aspectRatio);
}
