import { DrawingData, OnResizeContext } from "../../types";
import { getDiffCoords, unifiedResizeFunction } from "../resizeObject";

export function resizeS(data: DrawingData, ctx: OnResizeContext) {
  let [_xDiff, yDiff] = getDiffCoords(data, ctx);
  unifiedResizeFunction(data, [0, -yDiff / 2], [0, yDiff]);
}
