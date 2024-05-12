import { DrawingData, OnResizeContext } from "../../types";
import { resizeS } from "./resizeS";
import { resizeW } from "./resizeW";

export function resizeSW(data: DrawingData, ctx: OnResizeContext) {
  resizeS(data, ctx, "SW");
  resizeW(data, ctx, "WS");
}
