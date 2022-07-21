import { Point } from "../types";

export type Orientation =
  | "left"
  | "right"
  | "up"
  | "down"
  | "nw"
  | "ne"
  | "se"
  | "sw";

export function calcOrientation(pointA: Point, pointB: Point): Orientation {
  const [x1, y1] = pointA;
  const [x2, y2] = pointB;
  if (x2 === x1) {
    if (y2 > y1) {
      return "down";
    }
    return "up";
  }
  if (y2 === y1) {
    if (x2 > x1) {
      return "right";
    }
    return "left";
  }
  if (x2 < x1 && y2 < y1) {
    return "nw";
  }
  if (x2 > x1 && y2 < y1) {
    return "ne";
  }
  if (x2 > x1 && y2 > y1) {
    return "se";
  }
  return "sw";
}

export function getStartAndEndPoint(
  width: number,
  height: number,
  orientation: Orientation
): [Point, Point] {
  if (orientation === "right") {
    return [
      [0, 0],
      [width, 0],
    ];
  }
  if (orientation === "left") {
    return [
      [width, 0],
      [0, 0],
    ];
  }
  if (orientation === "down") {
    return [
      [0, 0],
      [0, height],
    ];
  }
  if (orientation === "up") {
    return [
      [0, height],
      [0, 0],
    ];
  }
  if (orientation === "nw") {
    return [
      [width, height],
      [0, 0],
    ];
  }
  if (orientation === "ne") {
    return [
      [0, height],
      [width, 0],
    ];
  }
  if (orientation === "se") {
    return [
      [0, 0],
      [width, height],
    ];
  }
  return [
    [width, 0],
    [0, height],
  ];
}
