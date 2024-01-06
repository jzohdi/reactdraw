import { DrawingData, Point } from "../../types";
import { round } from "../resizeObject";

export function rotateDiv(
  object: DrawingData,
  newPoint: Point,
  referenceCenter: Point
) {
  const div = object.containerDiv;
  const x = newPoint[0] - referenceCenter[0];
  const y = newPoint[1] - referenceCenter[1];
  const angleDeg = (Math.atan2(y, x) * 180) / Math.PI + 90;
  div.style.transform = `rotate(${round(angleDeg, 5)}deg)`;
}
