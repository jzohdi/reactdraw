import { DrawingData, DrawingContainer, Point, RectBounds } from "../types";

// https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
export function makeid(length: number) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function getTouchCoords(e: TouchEvent): Point {
  let touch = e.touches[0];
  if (!touch) {
    touch = e.targetTouches[0];
  }
  if (!touch) {
    touch = e.changedTouches[0];
  }
  return [touch.clientX, touch.clientY];
}

export function getRelativePoint(
  point: Point,
  container: HTMLDivElement | null
): Point {
  if (!container) {
    throw new Error("Container not set.");
  }
  const rect = container.getBoundingClientRect();
  return [point[0] - rect.left, point[1] - rect.top];
}

function isBrowser() {
  return typeof window !== undefined;
}

export function makeNewBoundingDiv(
  relativePoint: Point,
  lineWidth: number
): DrawingData {
  if (!isBrowser()) {
    throw new Error("new bounding div called on the server.");
  }
  const [pointX, pointY] = relativePoint;
  const { id, div, top, left, right, bottom } = makeNewDiv(
    pointX,
    pointY,
    lineWidth
  );
  const data: DrawingData = {
    coords: [relativePoint],
    element: null,
    container: {
      id,
      div,
      bounds: {
        top,
        left,
        right,
        bottom,
      },
    },
    style: {
      zIndex: 1,
      lineWidth,
    },
  };
  return data;
}

type MakeNewDivOutput = {
  div: HTMLDivElement;
  id: string;
  left: number;
  top: number;
  right: number;
  bottom: number;
};

function makeNewDiv(
  pointX: number,
  pointY: number,
  lineWidth: number
): MakeNewDivOutput {
  const id = makeid(6);
  const div = document.createElement("div");
  const left = pointX - lineWidth;
  const top = pointY - lineWidth;
  div.id = id;
  div.style.width = `${lineWidth * 2}px`;
  div.style.height = `${lineWidth * 2}px`;
  div.style.position = "absolute";
  div.style.left = left + "px";
  div.style.top = top + "px";
  div.style.pointerEvents = "none";
  div.style.zIndex = "1";
  return {
    div,
    id,
    top,
    left,
    right: left + lineWidth + lineWidth,
    bottom: top + lineWidth + lineWidth,
  };
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
  //   newSVG.style.position = "absolute";
  //   newSVG.style.top = "0";
  //   newSVG.style.left = "0";
  newSVG.style.width = "100%";
  newSVG.style.height = "100%";
  return newSVG;
}

export function makeRelativeDiv() {
  const div = document.createElement("div");
  if (!div) {
    throw new Error("could not make div");
  }
  div.style.width = "100%";
  div.style.height = "100%";
  div.style.position = "relative";
  return div;
}

export function createPath(): SVGPathElement {
  if (!isBrowser()) {
    throw new Error("createPath called on server");
  }
  const newPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  newPath.setAttribute("fill", "black");
  newPath.setAttribute("stroke-width", "1px");
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

export function mapPointToRect(
  point: Point,
  container: DrawingContainer,
  viewContainer: HTMLDivElement
): Point {
  const containerBounds = container.div.getBoundingClientRect();
  const viewBounds = viewContainer.getBoundingClientRect();
  const topOfCotainerRelativeToView = containerBounds.top - viewBounds.top;
  const pointYRelativeToContainer = point[1] - topOfCotainerRelativeToView;
  const leftOfContainerRelativeToView = containerBounds.left - viewBounds.left;
  const pointXRelativeToContainer = point[0] - leftOfContainerRelativeToView;
  return [pointXRelativeToContainer, pointYRelativeToContainer];
}

/**
 * Returns true if the most recent coordinate did expand the bounds
 * @param data
 */
export function expandContainer(data: DrawingData): boolean {
  let didExapnd = false;
  const [newX, newY] = data.coords[data.coords.length - 1];
  const container = data.container;
  const bounds = container.bounds;
  const lineWidth = data.style.lineWidth;
  if (newX - lineWidth <= bounds.left) {
    bounds.left = newX - lineWidth;
    container.div.style.left = newX - lineWidth + "px";
    container.div.style.width = bounds.right + lineWidth * 2 - newX + "px";
    didExapnd = true;
  } else if (newX + lineWidth >= bounds.right) {
    bounds.right = newX + lineWidth;
    container.div.style.width = newX + lineWidth * 2 - bounds.left + "px";
    didExapnd = true;
  }
  if (newY + lineWidth >= bounds.bottom) {
    bounds.bottom = newY + lineWidth;
    container.div.style.height = newY + lineWidth * 2 - bounds.top + "px";
    didExapnd = true;
  } else if (newY - lineWidth <= bounds.top) {
    bounds.top = newY - lineWidth;
    container.div.style.top = newY - lineWidth + "px";
    container.div.style.height = bounds.bottom + lineWidth * 2 - newY + "px";
    didExapnd = true;
  }
  return didExapnd;
}

/**
 * Uses the initial point and the most recent point
 * has the side effect of altering the container to be the
 * correct position and dimensions;
 */
export function setContainerRect(data: DrawingData): Point[] {
  if (data.coords.length < 2) {
    throw new Error("data coords must be at least length 2");
  }
  const [firstX, firstY] = data.coords[0];
  const [lastX, lastY] = data.coords[data.coords.length - 1];

  const minX = Math.min(firstX, lastX);
  const minY = Math.min(firstY, lastY);
  const maxX = Math.max(firstX, lastX);
  const maxY = Math.max(firstY, lastY);

  const { bounds, div } = data.container;

  bounds.left = minX;
  bounds.right = maxX;
  bounds.top = minY;
  bounds.bottom = maxY;

  div.style.top = minY + "px";
  div.style.left = minX + "px";
  div.style.width = `${maxX - minX}px`;
  div.style.height = `${maxY - minY}px`;

  return data.coords;
}

export function isRectBounding(
  bounds: RectBounds,
  object: RectBounds
): boolean {
  return (
    bounds.top <= object.top &&
    bounds.bottom >= object.bottom &&
    bounds.left <= object.left &&
    bounds.right >= object.right
  );
}

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

export function distance(pointA: Point, pointB: Point): number {
  return Math.sqrt(
    Math.pow(Math.abs(pointA[0] - pointB[0]), 2) +
      Math.pow(Math.abs(pointA[1] - pointB[1]), 2)
  );
}

export function makeBoundingRect(point: Point): RectBounds {
  const [x, y] = point;
  return { top: y, right: x, bottom: y, left: x };
}
export function addPointToBounds(bounds: RectBounds, point: Point): RectBounds {
  let { top, right, bottom, left } = bounds;
  const [x, y] = point;
  if (y > bottom) {
    bottom = y;
  } else if (y < top) {
    top = y;
  }
  if (x < left) {
    left = x;
  } else if (x > right) {
    right = x;
  }
  return { top, right, bottom, left };
}
