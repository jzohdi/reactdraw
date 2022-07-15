import {
  DrawingData,
  DrawingContainer,
  Point,
  RectBounds,
  DrawingDataMap,
} from "../types";
import { getObjectFromMap } from "./utils";

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

export function isBrowser() {
  return typeof window !== undefined;
}

export function makeNewBoundingDiv(
  relativePoint: Point,
  lineWidth: number,
  toolId: string
): DrawingData {
  if (!isBrowser()) {
    throw new Error("new bounding div called on the server.");
  }
  const [pointX, pointY] = relativePoint;
  const { id, div, top, left, right, bottom } = makeNewDiv(
    pointX,
    pointY,
    lineWidth,
    toolId
  );
  const data: DrawingData = {
    coords: [relativePoint],
    element: null,
    toolId,
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
    customData: new Map(),
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
  lineWidth: number,
  toolId: string
): MakeNewDivOutput {
  const id = makeid(6);
  const div = document.createElement("div");
  const left = pointX - lineWidth;
  const top = pointY - lineWidth;
  div.id = `${toolId}-${id}`;
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

/**
 * Assumes that the svg has a viewBox set the the original dimensions
 * and that the svg has a single path child ele
 */
export function scaleSvg(svgEle: SVGSVGElement, bounds: RectBounds): void {
  const { width, height } = getOriginalDimensions(svgEle);
  const newWidth = bounds.right - bounds.left;
  const newHeight = bounds.bottom - bounds.top;
  const widthDiff = newWidth / width;
  const heightDiff = newHeight / height;
  const pathEle = (svgEle as SVGSVGElement).lastElementChild as SVGPathElement;
  pathEle.style.transform = `scale(${widthDiff}, ${heightDiff})`;
}

function getOriginalDimensions(svg: SVGSVGElement) {
  const viewBox = svg.getAttribute("viewbox");
  if (!viewBox) {
    throw new Error("no viewbox found on ele");
  }
  const each = viewBox.split(" ");
  return { width: parseFloat(each[2]), height: parseFloat(each[3]) };
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
  const lineWidth = data.style.lineWidth;
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
  div.style.width = `${maxX - minX + lineWidth}px`;
  div.style.height = `${maxY - minY + lineWidth}px`;

  return data.coords;
}

export function getElementsThatBoundsAreWithin(
  renderedMap: DrawingDataMap,
  bounds: RectBounds
) {
  let itemToSelect = null;
  for (const [eleId, eleData] of renderedMap.entries()) {
    if (isRectBounding(eleData.container.bounds, bounds)) {
      const eleIsOnTop = itemToSelect?.style.zIndex ?? 0 < eleData.style.zIndex;
      if (eleIsOnTop) {
        itemToSelect = eleData;
      }
    }
  }
  return itemToSelect;
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

export function rotateDiv(
  object: DrawingData,
  newPoint: Point,
  referenceCenter: Point
) {
  const div = object.container.div;
  const x = newPoint[0] - referenceCenter[0];
  const y = newPoint[1] - referenceCenter[1];
  const angleDeg = (Math.atan2(y, x) * 180) / Math.PI + 90;
  div.style.transform = `rotate(${angleDeg}deg)`;
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
/**
 * Expands the bounds of a current bounding rect { top, left, right, bottom}
 * if the point is outside of the current.
 * @param bounds
 * @param point
 * @returns
 */
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

export function getCenterPoint(bounds: RectBounds): Point {
  const height = bounds.bottom - bounds.top;
  const y = bounds.top + height / 2;
  const width = bounds.right - bounds.left;
  const x = bounds.left + width / 2;
  return [x, y];
}

export function getBoxSize(data: DrawingData) {
  const bounds = data.container.bounds;
  return {
    width: bounds.right - bounds.left,
    height: bounds.bottom - bounds.top,
  };
}
