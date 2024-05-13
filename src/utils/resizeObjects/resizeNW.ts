import { DrawingData, OnResizeContext } from "../../types";
import { getAspectRatioInput } from "./aspectRatio";
import { resizeN } from "./resizeN";
import { resizeW } from "./resizeW";

export function resizeNW(data: DrawingData, ctx: OnResizeContext) {
  const aspectRatio = getAspectRatioInput(data, ctx, "NW");
  const didResize = resizeN(data, ctx, aspectRatio);
  if (!didResize) {
    return;
  }
  if (aspectRatio) {
    aspectRatio.direction = "WN";
  }
  resizeW(data, ctx, aspectRatio);
}
