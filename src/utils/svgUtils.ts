import { Point } from "../types";
import { isBrowser } from "./index";

export function createPathSvg(lineWidth: number): SVGPathElement {
  const newPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  newPath.setAttribute("fill", "transparent");
  newPath.setAttribute("stroke", "black");
  newPath.style.strokeWidth = `${lineWidth}px`;
  newPath.setAttribute("stroke-linejoin", "round");
  newPath.setAttribute("stroke-linecap", "round");
  return newPath;
}

export function createLineSvg(lineWidth: number): SVGLineElement {
  const newPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "line"
  );
  newPath.setAttribute("fill", "transparent");
  newPath.setAttribute("stroke", "black");
  newPath.style.strokeWidth = `${lineWidth}px`;
  newPath.setAttribute("stroke-linejoin", "round");
  newPath.setAttribute("stroke-linecap", "round");
  return newPath;
}

export function createSvg(w: number, h: number): SVGSVGElement {
  if (!isBrowser()) {
    throw new Error("createSVG called on server");
  }
  const newSVG = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  //   newSVG.setAttribute("width", `${w}px`);
  //   newSVG.setAttribute("height", `${h}px`);
  newSVG.setAttributeNS(
    "http://www.w3.org/2000/xmlns/",
    "xmlns:xlink",
    "http://www.w3.org/1999/xlink"
  );
  //   newSVG.setAttribute("version", "1.1");
  //   newSVG.setAttribute("preserveAspectRatio", "none");
  newSVG.setAttribute("viewbox", `0 0 ${w} ${h}`);
  newSVG.style.position = "absolute";
  newSVG.style.top = "0";
  newSVG.style.left = "0";
  //   newSVG.style.transform = "scale(1.0, 1.0)";
  newSVG.style.width = "100%";
  newSVG.style.height = "100%";
  return newSVG;
}

export function createPath(lineWidth: number): SVGPathElement {
  if (!isBrowser()) {
    throw new Error("createPath called on server");
  }
  const newPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  newPath.setAttribute("fill", "black");
  newPath.style.strokeWidth = `${lineWidth}px`;
  //   newPath.setAttribute("stroke-width", `${lineWidth}px`);
  newPath.setAttribute("stroke-linejoin", "round");
  newPath.setAttribute("stroke-linecap", "round");
  newPath.setAttribute("d", "M 0 0 L 1 1");
  return newPath;
}

export function createCircle(radius: number) {
  if (!isBrowser()) {
    throw new Error("createPath called on server");
  }
  const ele = document.createElementNS("http://www.w3.org/2000/svg", "circle");
  ele.setAttribute("fill", "black");
  ele.setAttribute("cx", `${Math.ceil(radius / 2)}`);
  ele.setAttribute("cy", `${Math.ceil(radius / 2)}`);
  ele.setAttribute("r", `${radius}`);
  //   ele.setAttribute("d", "M 0 0 L 1 1");
  return ele;
}

export function makeLineSvgEle(
  pointA: Point,
  pointB: Point,
  lineWidth: number,
  mapFn: (point: Point) => Point
) {
  const lineEle = createLineSvg(lineWidth);
  const offset = lineWidth / 2;
  // if you're not first you're last
  let [x1, y1] = mapFn(pointA);
  let [x2, y2] = mapFn(pointB);
  if (x1 < x2) {
    x1 += offset;
    x2 -= offset;
  } else if (x2 < x1) {
    x2 += offset;
    x1 -= offset;
  }
  if (y1 < y2) {
    y1 += offset;
    y2 -= offset;
  } else if (y2 < y1) {
    y1 -= offset;
    y2 += offset;
  }
  lineEle.setAttribute("x1", x1.toString());
  lineEle.setAttribute("y1", y1.toString());
  lineEle.setAttribute("x2", x2.toString());
  lineEle.setAttribute("y2", y2.toString());
  return { lineEle, x1, y1, x2, y2 };
}
