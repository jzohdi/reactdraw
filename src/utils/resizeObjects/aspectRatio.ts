import { getBoxSize } from "..";
import { DrawingData, Point } from "../../types";

export type AspectDirection =
  | "NW"
  | "NE"
  | "EN"
  | "ES"
  | "SW"
  | "SE"
  | "WS"
  | "WN";

/**
 * takes dx or dy and returns one of these number based on the current aspect ratio.
 * for example if direction is N (north) and dx is larger than the aspect ratio, this
 * function will return a new dY that is calculated on dx.
 * @param dx
 * @param dy
 * @param data
 * @param ctx
 * @param direction
 * @returns
 */
export function forcePreserveAspectRatio(
  [dX, dY]: Point,
  data: DrawingData,
  direction: AspectDirection
): Point {
  const x = Math.abs(dX);
  const y = Math.abs(dY);
  const { width, height } = getBoxSize(data);
  const currentAspectRatio = width / height;
  const aspectRatioOfChange = x / y;

  if (direction[0] === "N") {
    const reverseFlag = direction[1] === "W" ? -1 : 1;
    if (x === 0) {
      return [dX, dY];
    }
    if (y === 0 && dX < 0) {
      return [dX, (x / currentAspectRatio) * reverseFlag];
    }
    if (y === 0 && dX > 0) {
      return [dX, (x / currentAspectRatio) * -1 * reverseFlag];
    }
    // if controlling north and AR greater than current,
    // means that X is the larger so we need to calculate y
    if (aspectRatioOfChange > currentAspectRatio && dX < 0) {
      return [dX, (x / currentAspectRatio) * reverseFlag];
    }
    if (aspectRatioOfChange > currentAspectRatio && dX > 0) {
      return [dX, (x / currentAspectRatio) * -1 * reverseFlag];
    }
  } else if (direction[0] === "E") {
    const switchFlag = direction[1] === "S" ? -1 : 1;
    if (y === 0) {
      return [dX, dY];
    }
    if (x === 0 && dY > 0) {
      return [y * currentAspectRatio * -1 * switchFlag, dY];
    }
    if (x === 0 && dY < 0) {
      return [y * currentAspectRatio * switchFlag, dY];
    }
    if (aspectRatioOfChange < currentAspectRatio && dY > 0) {
      return [y * currentAspectRatio * -1 * switchFlag, dY];
    }
    if (aspectRatioOfChange < currentAspectRatio && dY < 0) {
      return [y * currentAspectRatio * switchFlag, dY];
    }
    // console.log("got here");
  } else if (direction[0] === "S") {
    const reverseFlag = direction[1] === "W" ? -1 : 1;
    if (x === 0) {
      return [dX, dY];
    }
    if (y === 0 && dX < 0) {
      return [dX, (x / currentAspectRatio) * -1 * reverseFlag];
    }
    if (y === 0 && dX > 0) {
      return [dX, (x / currentAspectRatio) * reverseFlag];
    }
    if (aspectRatioOfChange > currentAspectRatio && dX < 0) {
      return [dX, (x / currentAspectRatio) * -1 * reverseFlag];
    }
    if (aspectRatioOfChange > currentAspectRatio && dX > 0) {
      return [dX, (x / currentAspectRatio) * reverseFlag];
    }
  } else if (direction[0] === "W") {
    const reverseFlag = direction[1] === "S" ? -1 : 1;
    if (y === 0) {
      return [dX, dY];
    }
    if (x === 0 && dY > 0) {
      return [y * currentAspectRatio * reverseFlag, dY];
    }
    if (x === 0 && dY < 0) {
      return [y * currentAspectRatio * -1 * reverseFlag, dY];
    }
    if (aspectRatioOfChange < currentAspectRatio && dY > 0) {
      return [y * currentAspectRatio * reverseFlag, dY];
    }
    if (aspectRatioOfChange < currentAspectRatio && dY < 0) {
      return [y * currentAspectRatio * -1 * reverseFlag, dY];
    }
  }

  return [dX, dY];
}

function getCurrentAspectRatio(data: DrawingData) {
  const box = getBoxSize(data);
  const ratio = box.width / box.height;
  return ratio;
}

function calcNewAspectRatio(newPoint: Point) {
  const [nX, nY] = newPoint;
  const x = Math.abs(nX);
  const y = Math.abs(nY);
  if (x === 0) {
  }
  if (y === 0) {
  }
  return Math.abs(nX) / Math.abs(nY);
}

// ratio = x/y so to get new y, multiple 1/ratio * newX
function calcY(point: Point, ratio: number): number {
  const [x, y] = point;
  return (1 / ratio) * x;
}

// ratio = x/y so to get new X, multiple ratio * new y
function calcX(point: Point, ratio: number): number {
  const [x, y] = point;
  return ratio * y;
}
