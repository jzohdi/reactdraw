import { getBoxSize } from "..";
import { DrawingData, OnResizeContext } from "../../types";
import { getDiffCoords } from "../resizeObject";
import { resizeS } from "./resizeS";
import { resizeW } from "./resizeW";

export function resizeSW(data: DrawingData, ctx: OnResizeContext) {
  resizeS(data, ctx);
  resizeW(data, ctx);
}
