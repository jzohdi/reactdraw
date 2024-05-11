import { DrawingData, OnResizeContext } from "../../types";
import { resizeN } from "./resizeN";
import { resizeW } from "./resizeW";

export function resizeNW(data: DrawingData, ctx: OnResizeContext) {
  resizeN(data, ctx, ctx.shouldPreserveAspectRatio);
  resizeW(data, ctx, ctx.shouldPreserveAspectRatio);
}
