import { getBoxSize } from "..";
import { DrawingData, OnResizeContext } from "../../types";
import {
  getDiffCoords,
  getPointRelativeToOther,
  rotatePointAroundAnotherPoint,
  rotatePointAroundOrigin,
  slideCornerOnAnAngle,
} from "../resizeObject";
import { getRotateFromDiv } from "../select/getRotateFromDiv";
import { getCenterPoint } from "../utils";

/**
 * For resizeN
 * 1. take original top left (x, y)
 * 2. rotate around center (cx, cy) - this gives you the displayed top left corner
 * 3. slide the displayed corner in the y direction by the difference
 * 4. get the new center
 * 5. rotate the new displayed corner back around the new center
 *
 * @param data
 * @param ctx
 */
export function resizeN(data: DrawingData, ctx: OnResizeContext) {
  let [xDiff, yDiff] = getDiffCoords(data, ctx);
  xDiff = 0;
  // console.log({ xDiff, yDiff });
  const bounds = getBoxSize(data);
  const div = data.containerDiv;
  const currentRotation = getRotateFromDiv(div);

  const [previousCenterX, previousCenterY] = getCenterPoint(bounds);
  const [newNormalizedCenterX, newNormalizedCenterY] = rotatePointAroundOrigin(
    xDiff,
    -yDiff / 2,
    currentRotation
  );

  const newHeight = bounds.height - yDiff;
  const distanceFromNewCenterToTop = newHeight / 2;
  const distanceFromNewCenterToLeft = bounds.width / 2;

  const newNormalizedCornerX =
    newNormalizedCenterX - distanceFromNewCenterToLeft;
  const newNormalizedCornerY =
    newNormalizedCenterY + distanceFromNewCenterToTop;

  const newTop = previousCenterY - newNormalizedCornerY;
  const newLeft = newNormalizedCornerX + previousCenterX;
  div.style.top = newTop + "px";
  div.style.left = newLeft + "px";
  div.style.width = bounds.width + xDiff + "px";
  div.style.height = bounds.height - yDiff + "px";
}
