import { DrawingData, Point, RectBounds } from "../types";

// store event listeners in custom state so that can be refered to later
export type EventHandler = {
  ele: HTMLElement;
  eventName: keyof HTMLElementEventMap;
  fn: (...args: any) => void;
};

export type SelectToolCustomState = {
  selectedIds: string[];
  handlers: {
    [objectId: string]: EventHandler[];
  };
  prevPoint: Point | null;
};

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

export type UndoAction = "drag" | "rotate" | "resize";

export type ResizeUndoData = {
  bounds: RectBounds;
};
