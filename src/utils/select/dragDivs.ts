import { DrawingData, Point } from "../../types";

export function dragDivs(
  objects: DrawingData[],
  prevPoint: Point,
  newPoint: Point
): void {
  const [currentMouseX, currentMouseY] = newPoint;
  const [prevMouseX, prevMouseY] = prevPoint;
  const newLeft = currentMouseX - prevMouseX;
  const newTop = currentMouseY - prevMouseY;
  for (const obj of objects) {
    const { bounds, div } = obj.container;
    const { left, top, right, bottom } = bounds;
    bounds.left = left + newLeft;
    bounds.top = top + newTop;
    bounds.right = bounds.left + (right - left);
    bounds.bottom = bounds.top + (bottom - top);
    div.style.top = bounds.top + "px";
    div.style.left = bounds.left + "px";
  }
}
