import { mapPointToRect } from ".";
import { DrawingData, Point } from "../types";
import { makeLineSvgEle } from "./svgUtils";

export function drawLineFromStartToEnd(
  data: DrawingData,
  viewContainer: HTMLDivElement
): SVGLineElement {
  const coords = data.coords;
  const lineWidth = parseInt(data.style.lineWidth);
  if (coords.length < 2) {
    throw new Error("draw line from start to end must have at least 2 coords");
  }
  const mapFn = (p: Point) => mapPointToRect(p, data.container, viewContainer);
  const pointA = coords[0];
  const pointB = coords[coords.length - 1];
  return makeLineSvgEle(pointA, pointB, data.style, mapFn).lineEle;
}
