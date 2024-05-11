import { getBoxSize } from "..";
import { DrawingData, OnResizeContext, Point } from "../../types";
import { resizeE } from "./resizeE";
import { resizeN } from "./resizeN";

export function resizeNE(data: DrawingData, ctx: OnResizeContext) {
  resizeN(data, ctx, ctx.shouldPreserveAspectRatio);
  resizeE(data, ctx);
}
