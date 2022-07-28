import { DrawingData, OnResizeContext, Point, RectBounds } from "../../types";

export type ResizeFunction = (data: DrawingData, ctx: OnResizeContext) => void;

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
