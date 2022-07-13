import React from "react";
import { ArrowRightBoldIcon } from "@jzohdi/jsx-icons";
import { DrawingData, DrawingTools, Point } from "../types";
import { ARROW_TOOL_ID } from "../constants";
import {
  createCircle,
  createLineSvg,
  createSvg,
  makeLineSvgEle,
} from "../utils/svgUtils";
import { mapPointToRect, scaleSvg, setContainerRect } from "../utils";
import { drawLineFromStartToEnd } from "../utils/onDrawingUtils";

const arrowTool: DrawingTools = {
  icon: <ArrowRightBoldIcon />,
  id: ARROW_TOOL_ID,
  onDrawStart: (data) => {
    const div = data.container.div;
    const lineWidth = data.style.lineWidth;
    const newSvg = createSvg(lineWidth, lineWidth);
    const newPath = createCircle(lineWidth / 2);
    newSvg.appendChild(newPath);
    div.append(newSvg);
    data.element = newSvg;
  },
  onDrawing: (data, { viewContainer }) => {
    setContainerRect(data);
    const div = data.container.div;
    const newSvg = makeArrowSvg(data, viewContainer);
    div.innerHTML = "";
    div.appendChild(newSvg);
    data.element = newSvg;
    data.coords.splice(1);
  },
  onDrawEnd: (data) => {},
  onResize(data, ctx) {
    scaleSvg(data.element as SVGSVGElement, data.container.bounds);
  },
};

/**
 * <svg width="237" height="23" viewBox="0 0 237 23" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M236.028 13.0919C236.632 12.5239 236.66 11.5746 236.092 10.9715L226.836 1.14442C226.268 0.541381 225.318 0.512983 224.715 1.08099C224.112 1.649 224.084 2.59832 224.652 3.20136L232.88 11.9366L224.144 20.1643C223.541 20.7323 223.513 21.6817 224.081 22.2847C224.649 22.8877 225.598 22.9161 226.201 22.3481L236.028 13.0919ZM0.955148 6.49933L234.955 13.4993L235.045 10.5007L1.04485 3.50067L0.955148 6.49933Z" fill="black"/>
</svg>

 * 
 */

export default arrowTool;

function makeArrowSvg(
  data: DrawingData,
  viewContainer: HTMLDivElement
): SVGSVGElement {
  const lineWidth = data.style.lineWidth;
  const { bounds } = data.container;
  // const width = bounds
  const width = bounds.right - bounds.left;
  const height = bounds.bottom - bounds.top;
  const newSvg = createSvg(width + lineWidth, height + lineWidth);
  newSvg.style.overflow = "visible";
  makeArrowLines(data, viewContainer).forEach((line) => {
    newSvg.appendChild(line);
  });
  return newSvg;
}

//https://math.stackexchange.com/questions/1314006/drawing-an-arrow
function makeArrowLines(
  data: DrawingData,
  viewContainer: HTMLDivElement
): SVGLineElement[] {
  const lines: SVGLineElement[] = [];
  const coords = data.coords;
  const lineWidth = data.style.lineWidth;
  if (coords.length < 2) {
    throw new Error("draw line from start to end must have at least 2 coords");
  }
  const mapFn = (p: Point) => mapPointToRect(p, data.container, viewContainer);
  const pointA = coords[0];
  const pointB = coords[coords.length - 1];
  const { lineEle, x1, x2, y1, y2 } = makeLineSvgEle(
    pointA,
    pointB,
    lineWidth,
    mapFn
  );
  const head1 = createLineSvg(lineWidth);
  head1.setAttribute("x1", x2.toString());
  head1.setAttribute("y1", y2.toString());

  // y = rise/run * x + b
  //   const v = [x2 - x1, y2 - y1];
  //   const mag = Math.sqrt(v[0] * v[0] + v[1] * v[1]);
  //   const u = [v[0] / mag, v[1] / mag];
  //   const arrowDistance = 30;
  //   const du = [u[0] * arrowDistance, u[1] * arrowDistance];
  //   const p2 = [x2 + du[0], y2 + du[1]];
  const rads = Math.atan2(y2, x2) - Math.atan2(y1, x1);
  const length = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  const l2 = 20;
  const lenRatio = l2 / length;
  //   console.log(rads);
  let theta = (30 * Math.PI) / 180;
  const offset = (10 * Math.PI) / 180;
  //   const theta = rads;
  const diff = 0.1;
  if (isCloseTo(rads, -1.5, diff)) {
    theta += offset;
  }
  const cosTheta = Math.cos(theta);
  const sinTheta = Math.sign(theta);

  const x3 = x2 + lenRatio * ((x1 - x2) * cosTheta + (y1 - y2) * sinTheta);
  const y3 = y2 + lenRatio * ((y1 - y2) * cosTheta + (x1 - x2) * sinTheta);
  head1.setAttribute("x2", x3.toString());
  head1.setAttribute("y2", y3.toString());
  //   const m = (y2 - y1)/(x2 - x1);
  //   const b = y1 - (m * x1);
  lines.push(head1);
  lines.push(lineEle);
  return lines;
}

function isCloseTo(num1: number, num2: number, diff: number) {
  if (num1 > num2) {
    return num1 - diff <= num2;
  }
  if (num2 > num1) {
    return num2 - diff <= num1;
  }
  return true;
}
