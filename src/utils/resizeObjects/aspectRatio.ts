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
  const aspectX = getXFunction(direction);
  const aspectY = getYFunction(direction);
  const reverseFlag = getReverseFlag(direction);
  const dirFlag = getDirectionFlag(direction, dX, dY);
  const inputs: CalculationInputs = {
    dX,
    dY,
    currAR: currentAspectRatio,
    dirFlag,
    reverseFlag,
  };
  return [aspectX(inputs), aspectY(inputs)];
}

type CalculationInputs = {
  dX: number;
  dY: number;
  currAR: number;
  dirFlag: number;
  reverseFlag: number;
};

function getXFunction(direction: AspectDirection) {
  return (input: CalculationInputs) => {
    const dir = direction[0];
    const x = Math.abs(input.dX);
    const y = Math.abs(input.dY);
    const changeAr = x / y;
    switch (dir) {
      case "E":
      case "W":
        if (input.dY === 0) {
          return input.dX;
        }
        if (changeAr > input.currAR) {
          return input.dX;
        }
        return y * input.currAR * input.dirFlag * input.reverseFlag;
      default:
        return input.dX;
    }
  };
}

function getYFunction(direction: AspectDirection) {
  return (input: CalculationInputs) => {
    const x = Math.abs(input.dX);
    const y = Math.abs(input.dY);
    const dir = direction[0];
    const changeAr = x / y;
    switch (dir) {
      case "N":
      case "S":
        if (input.dX === 0) {
          return input.dY;
        }
        if (changeAr < input.currAR) {
          return input.dY;
        }
        return (x / input.currAR) * input.dirFlag * input.reverseFlag;
      default:
        return input.dY;
    }
  };
}

function getReverseFlag(direction: AspectDirection) {
  if (direction[1] === "S" || direction[1] === "W") {
    return -1;
  }
  return 1;
}

function getDirectionFlag(direction: AspectDirection, dX: number, dY: number) {
  const dir = direction[0];
  switch (dir) {
    case "N":
      return dX < 0 ? 1 : -1;
    case "S":
      return dX < 0 ? -1 : 1;
    case "E":
      return dY < 0 ? 1 : -1;
    case "W":
      return dY < 0 ? -1 : 1;
  }
  return 1;
}
