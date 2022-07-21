import { unselectElement } from "./select/unselectElement";
import {
  DrawingData,
  DrawingDataMap,
  DrawingTools,
  PartialCSS,
  Point,
  ReactDrawContext,
  RectBounds,
  SelectMode,
} from "../types";

export function setStyles(div: HTMLElement, styles: PartialCSS): HTMLElement {
  for (const key in styles) {
    (<any>div.style)[key] = styles[key];
  }
  return div;
}

export function getCornerMode(id: string): SelectMode {
  const direction = id.split("-")[2];
  if (direction === "sw") {
    return "resize-sw";
  }
  if (direction === "nw") {
    return "resize-nw";
  }
  if (direction === "se") {
    return "resize-se";
  }
  if (direction === "ne") {
    return "resize-ne";
  }
  throw new Error("corner mode id not valid");
}

export function getToolById(tools: DrawingTools[], toolId: string) {
  const tool = tools.find((t) => t.id === toolId);
  if (!tool) {
    throw new Error("could not find the used tool");
  }
  return tool;
}

export function deleteObjectAndNotify(objectId: string, ctx: ReactDrawContext) {
  const { objectsMap, viewContainer } = ctx;
  const object = getObjectFromMap(ctx.objectsMap, objectId);

  // if deleting a selected element, remove select
  unselectElement(object, ctx);

  const { div, id } = object.container;
  viewContainer.removeChild(div);
  objectsMap.delete(id);
  const tool = getToolById(ctx.drawingTools, object.toolId);
  if (tool.onDeleteObject) {
    tool.onDeleteObject(object, ctx);
  }
}

export function getObjectFromMap(
  map: DrawingDataMap,
  objectId: string
): DrawingData {
  const object = map.get(objectId);
  if (!object) {
    throw new Error("could not get object from map");
  }
  return object;
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

export function getCenterPoint(bounds: RectBounds): Point {
  const height = bounds.bottom - bounds.top;
  const y = bounds.top + height / 2;
  const width = bounds.right - bounds.left;
  const x = bounds.left + width / 2;
  return [x, y];
}

export function makeSureArtifactsGone(
  query: string,
  container: HTMLDivElement
): void {
  const objects = container.querySelectorAll(query);
  if (objects.length > 0) {
    objects.forEach((obj) => {
      container.removeChild(obj);
    });
  }
}

export function isNotUndefined<T>(item: T | undefined): item is T {
  return item !== undefined;
}
