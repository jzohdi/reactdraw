import { getBoxSize } from "..";
import { DrawingData, OnResizeContext } from "../../types";
import { getDiffCoords, rotatePointAroundOrigin } from "../resizeObject";
import { getRotateFromDiv } from "../select/getRotateFromDiv";
import { getCenterPoint } from "../utils";

export function resizeW(data: DrawingData, ctx: OnResizeContext) {
  let [xDiff, yDiff] = getDiffCoords(data, ctx);
  yDiff = 0;
  const bounds = getBoxSize(data);
  const div = data.containerDiv;
  const currentRotation = getRotateFromDiv(div);
  const [previousCenterX, previousCenterY] = getCenterPoint(bounds);
  const [newNormalizedCenterX, newNormalizedCenterY] = rotatePointAroundOrigin(
    xDiff / 2,
    yDiff,
    currentRotation
  );
  const newWidth = bounds.width - xDiff;
  const distanceFromNewCenterToTop = bounds.height / 2;
  const distanceFromNewCenterToLeft = newWidth / 2;

  const newNormalizedCornerX =
    newNormalizedCenterX - distanceFromNewCenterToLeft;
  const newNormalizedCornerY =
    newNormalizedCenterY + distanceFromNewCenterToTop;

  const newTop = previousCenterY - newNormalizedCornerY;
  const newLeft = newNormalizedCornerX + previousCenterX;
  div.style.top = newTop + "px";
  div.style.left = newLeft + "px";
  div.style.width = bounds.width - xDiff + "px";
  div.style.height = bounds.height + yDiff + "px";
}
