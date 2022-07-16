import { DrawingData, Point, RectBounds } from "../../types";

export type ResizeFunction = (data: DrawingData, pointDiff: Point) => void;

export type DragUndoData = {
  objectId: string;
  top: number;
  left: number;
};

export type RotateUndoData = {
  objectId: string;
  rotate: number;
};

export type UndoAction = "drag" | "rotate" | "resize" | "delete" | "create";

export type ResizeUndoData = {
  bounds: RectBounds;
};
