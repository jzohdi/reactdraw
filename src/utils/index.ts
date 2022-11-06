import {
  DrawingData,
  DrawingContainer,
  Point,
  RectBounds,
  DrawingDataMap,
  ToolPropertiesMap,
  ReactDrawContext,
} from "../types";

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

export function isBrowser() {
  return typeof window !== undefined;
}

export function makeNewBoundingDiv(
  relativePoint: Point,
  globalStyles: ToolPropertiesMap,
  toolId: string
): DrawingData {
  if (!isBrowser()) {
    throw new Error("new bounding div called on the server.");
  }
  const lineWidth = parseInt(globalStyles.lineWidth);
  const [pointX, pointY] = relativePoint;
  const { id, div } = makeNewDiv(pointX, pointY, lineWidth, toolId);
  const data: DrawingData = {
    coords: [relativePoint],
    element: null,
    toolId,
    containerDiv: div,
    id,
    style: globalStyles,
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

export function makeNewDiv(
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
  div.style.boxSizing = "border-box";
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
  containerDiv: HTMLDivElement,
  viewContainer: HTMLDivElement
): Point {
  const containerBounds = containerDiv.getBoundingClientRect();
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
  const container = data.containerDiv;
  const bounds = getBoxSize(data);
  // console.log(bounds);
  const lineWidth = parseInt(data.style.lineWidth);

  if (newX - lineWidth <= bounds.left) {
    const newLeft = newX - lineWidth;
    const diff = bounds.left - newLeft;
    container.style.left = newLeft + "px";
    container.style.width = bounds.width + diff + "px";
    didExapnd = true;
  } else if (newX + lineWidth >= bounds.right) {
    container.style.width = newX + lineWidth * 2 - bounds.left + "px";
    didExapnd = true;
  }
  if (newY + lineWidth >= bounds.bottom) {
    // console.log("expanding bottom");
    container.style.height = newY + lineWidth * 2 - bounds.top + "px";
    didExapnd = true;
  } else if (newY - lineWidth <= bounds.top) {
    // console.log("expanding top");
    const newTop = newY - lineWidth;
    const diff = bounds.top - newTop;
    container.style.top = newTop + "px";
    container.style.height = bounds.height + diff + "px";
    didExapnd = true;
  }
  return didExapnd;
}

export function getRelativeBoxSize(data: DrawingData, ctx: ReactDrawContext) {
  const bbox = data.containerDiv.getBoundingClientRect();
  const viewBounds = ctx.viewContainer.getBoundingClientRect();
  const left = bbox.left - viewBounds.left;
  const top = bbox.top - viewBounds.top;
  const { width, height } = bbox;
  return {
    top,
    left,
    right: bbox.right - viewBounds.left,
    bottom: bbox.bottom - viewBounds.top,
    width,
    height,
  };
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
  const lineWidth = parseInt(data.style.lineWidth);
  const minX = Math.min(firstX, lastX);
  const minY = Math.min(firstY, lastY);
  const maxX = Math.max(firstX, lastX);
  const maxY = Math.max(firstY, lastY);

  const div = data.containerDiv;

  div.style.top = minY + "px";
  div.style.left = minX + "px";
  div.style.width = `${Math.max(maxX - minX, 1)}px`;
  div.style.height = `${Math.max(maxY - minY, 1)}px`;

  return data.coords;
}

export function getElementsThatBoundsAreWithin(
  renderedMap: DrawingDataMap,
  bounds: RectBounds
) {
  let itemToSelect = null;
  for (const [_eleId, eleData] of renderedMap.entries()) {
    const zIndex = parseInt(eleData.style.zIndex);
    const eleBounds = getBoxSize(eleData);
    if (isRectBounding(eleBounds, bounds)) {
      const eleIsOnTop = itemToSelect?.style.zIndex ?? 0 < zIndex;
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

export type BoxSize = {
  left: number;
  top: number;
  height: number;
  width: number;
  right: number;
  bottom: number;
};

export function getBoxSize(data: DrawingData): BoxSize {
  const div = data.containerDiv;
  const bbox = div.getBoundingClientRect();
  const left = getNumFrom(div.style.left);
  const top = getNumFrom(div.style.top);
  const styleHeight = getNumFrom(div.style.height);
  const styleWidth = getNumFrom(div.style.width);
  const height = styleHeight === 0 ? bbox.height : styleHeight;
  const width = styleWidth === 0 ? bbox.width : styleWidth;
  return {
    left,
    top,
    height,
    width,
    right: left + width,
    bottom: top + height,
  };
}

const numRegex = /-?\d+\.*\d*/;

function getNumFrom(str: string): number {
  const match = str.match(numRegex);
  if (match) {
    return parseFloat(match[0]);
  }
  return 0;
}
