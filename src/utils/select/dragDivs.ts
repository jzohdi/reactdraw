import { getBoxSize } from "..";
import { DrawingData, Point } from "../../types";

export function dragDivs(
  objects: DrawingData[],
  prevPoint: Point,
  newPoint: Point
): void {
  const [currentMouseX, currentMouseY] = newPoint;
  console.log(currentMouseX, currentMouseY);
  const [prevMouseX, prevMouseY] = prevPoint;
  const newLeft = currentMouseX - prevMouseX;
  const newTop = currentMouseY - prevMouseY;
  for (const obj of objects) {
    const div = obj.containerDiv;
    const bounds = getBoxSize(obj);
    const { left, top } = bounds;
    div.style.top = top + newTop + "px";
    div.style.left = left + newLeft + "px";
  }
}
