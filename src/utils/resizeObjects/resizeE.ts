import { DrawingData, OnResizeContext } from "../../types";
import { getDiffCoords, unifiedResizeFunction } from "../resizeObject";

export function resizeE(data: DrawingData, ctx: OnResizeContext) {
  let [xDiff, _yDiff] = getDiffCoords(data, ctx);
  unifiedResizeFunction(data, [xDiff / 2, 0], [xDiff, 0]);
}
