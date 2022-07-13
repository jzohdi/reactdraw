import { Point } from "../types";

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
