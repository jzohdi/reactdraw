import { DrawingData, OnResizeContext } from "../../types";
import { resizeE } from "./resizeE";
import { resizeS } from "./resizeS";

export function resizeSE(data: DrawingData, ctx: OnResizeContext) {
  resizeE(data, ctx, ctx.shouldPreserveAspectRatio);
  resizeS(data, ctx);
}
