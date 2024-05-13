import { DrawingData, OnResizeContext } from "../../types";
import { getAspectRatioInput } from "./aspectRatio";
import { resizeE } from "./resizeE";
import { resizeN } from "./resizeN";

export function resizeNE(data: DrawingData, ctx: OnResizeContext) {
  const aspectRatio = getAspectRatioInput(data, ctx, "EN");
  const didResize = resizeE(data, ctx, aspectRatio);
  if (!didResize) {
    return;
  }
  if (aspectRatio) {
    aspectRatio.direction = "NE";
  }
  resizeN(data, ctx, aspectRatio);
}
