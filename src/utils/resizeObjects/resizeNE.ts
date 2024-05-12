import { DrawingData, OnResizeContext } from "../../types";
import { resizeE } from "./resizeE";
import { resizeN } from "./resizeN";

export function resizeNE(data: DrawingData, ctx: OnResizeContext) {
  resizeN(data, ctx, "NE");
  resizeE(data, ctx, "EN");
}
