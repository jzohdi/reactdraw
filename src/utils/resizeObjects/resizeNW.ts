import { getBoxSize } from "..";
import { DrawingData, OnResizeContext } from "../../types";
import { getDiffCoords } from "../resizeObject";
import { resizeN } from "./resizeN";
import { resizeW } from "./resizeW";

export function resizeNW(data: DrawingData, ctx: OnResizeContext) {
  resizeN(data, ctx);
  resizeW(data, ctx);
}
