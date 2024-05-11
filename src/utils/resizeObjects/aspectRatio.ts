import { getBoxSize } from "..";
import { DrawingData, OnResizeContext, Point } from "../../types";

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
  direction: "N" | "E" | "S" | "W"
): Point {
  const x = Math.abs(dX);
  const y = Math.abs(dY);
  const { width, height } = getBoxSize(data);
  const currentAspectRatio = width / height;
  const aspectRatioOfChange = x / y;
  // if direction is north, check if need to scale y
  // console.log({
  //   x,
  //   y,
  //   dX,
  //   dY,
  //   currentAspectRatio,
  //   aspectRatioOfChange,
  //   direction,
  // });
  if (direction === "N") {
    if (x === 0) {
      return [dX, dY];
    }
    if (y === 0 && dX < 0) {
      return [dX, x / currentAspectRatio];
    }
    if (y === 0 && dX > 0) {
      return [dX, (x / currentAspectRatio) * -1];
    }
    if (aspectRatioOfChange > currentAspectRatio && dX < 0) {
      return [dX, x / currentAspectRatio];
    }
    if (aspectRatioOfChange > currentAspectRatio && dX > 0) {
      return [dX, (x / currentAspectRatio) * -1];
    }
  }
  if (direction === "E") {
    if (y === 0) {
      return [dX, dY];
    }
    if (x === 0 && dY > 0) {
      return [y * currentAspectRatio * -1, dY];
    }
    if (x === 0 && dY < 0) {
      return [y * currentAspectRatio, dY];
    }
    // if (aspectRatioOfChange < cur)
  }
  // if (dX === 0) {
  //   // if y < 0 means y going up direction, x should be a positive number
  //   if (nY < 0) {
  //     console.log([targetAspectRatio * y, nY]);
  //     return [targetAspectRatio * y, nY];
  //   } else if (y > 0) {
  //     // if y > 0 means y going down, and x should be negative
  //     return [targetAspectRatio * nY * -1, nY];
  //   }
  // } else if (y == 0) {
  // }

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
