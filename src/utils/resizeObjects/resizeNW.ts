import { DrawingData, OnResizeContext } from "../../types";
import { resizeN } from "./resizeN";
import { resizeW } from "./resizeW";

export function resizeNW(data: DrawingData, ctx: OnResizeContext) {
  resizeN(data, ctx, "NW");
  resizeW(data, ctx, "WN");
}
