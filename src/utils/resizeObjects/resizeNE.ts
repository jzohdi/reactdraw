import { getBoxSize } from "..";
import { DrawingData, OnResizeContext } from "../../types";
import { getDiffCoords } from "../resizeObject";
import { resizeE } from "./resizeE";
import { resizeN } from "./resizeN";

export function resizeNE(data: DrawingData, ctx: OnResizeContext) {
  resizeN(data, ctx);
  resizeE(data, ctx);
}
