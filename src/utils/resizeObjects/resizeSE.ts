import { DrawingData, OnResizeContext } from "../../types";
import { getAspectRatioInput } from "./aspectRatio";
import { resizeE } from "./resizeE";
import { resizeS } from "./resizeS";

export function resizeSE(data: DrawingData, ctx: OnResizeContext) {
  const aspectRatio = getAspectRatioInput(data, ctx, "ES");
  const didResize = resizeE(data, ctx, aspectRatio);
  if (!didResize) {
    return;
  }
  if (aspectRatio) {
    aspectRatio.direction = "SE";
  }
  resizeS(data, ctx, aspectRatio);
}
