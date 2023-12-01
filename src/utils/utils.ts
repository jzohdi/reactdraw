import { unselectElement } from "./select/unselectElement";
import {
  ActionObject,
  DrawingData,
  DrawingDataMap,
  DrawingTools,
  PartialCSS,
  Point,
  ReactDrawContext,
  RectBounds,
  SelectMode,
} from "../types";
import { pushActionToStack } from "./pushActionToStack";
import { BoxSize, makeNewBoundingDiv } from ".";

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

  const { containerDiv, id } = object;
  viewContainer.removeChild(containerDiv);
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

export function clamp(num: number, min: number, max: number) {
  return Math.min(Math.max(num, min), max);
}

export function getCenterPoint(bounds: BoxSize): Point {
  const { width, height, top, left } = bounds;
  const y = top + height / 2;
  const x = left + width / 2;
  return [x, y];
}

export function getViewCenterPoint(ctx: ReactDrawContext): Point {
  const viewContainer = ctx.viewContainer;
  const bbox = viewContainer.getBoundingClientRect();
  return [bbox.width / 2, bbox.height / 2];
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

export function batchDelete(deleteIds: string[], ctx: ReactDrawContext): void {
  const action: ActionObject = {
    action: "batch",
    toolType: "batch",
    toolId: "",
    objectId: "",
    data: [],
  };
  const couldNotDeleteToolsSet = new Set<string>();
  for (const objectId of deleteIds) {
    const object = getObjectFromMap(ctx.objectsMap, objectId);
    const toolId = object.toolId;
    const tool = getToolById(ctx.drawingTools, toolId);
    if (ctx.shouldKeepHistory && tool?.undoHandlers?.delete) {
      const toolAction: ActionObject = {
        action: "delete",
        toolType: "top-bar-tool",
        toolId: toolId,
        objectId,
        data: object,
      };
      action.data.push(toolAction);
    } else {
      couldNotDeleteToolsSet.add(toolId);
    }
    deleteObjectAndNotify(objectId, ctx);
  }
  if (ctx.shouldKeepHistory) {
    // const deletedObjects = new Map<>()
    pushActionToStack(action, ctx);
    if (couldNotDeleteToolsSet.size > 0) {
      console.log(
        "removing items from undo stack since they do not implement undoDelete",
        couldNotDeleteToolsSet
      );
      for (let i = ctx.undoStack.length - 1; i >= 0; i--) {
        if (couldNotDeleteToolsSet.has(ctx.undoStack[i].toolId)) {
          ctx.undoStack.splice(i, 1);
          i++;
        }
      }
    }
  } else {
    ctx.undoStack.splice(0);
  }
}

export function createNewObject(
  ctx: ReactDrawContext,
  point: Point,
  toolId: string
): DrawingData {
  const styles = { ...ctx.globalStyles };
  const newData = makeNewBoundingDiv(point, styles, toolId);
  return newData;
}

export function addObject(ctx: ReactDrawContext, obj: DrawingData): void {
  const { containerDiv, id } = obj;
  ctx.viewContainer.appendChild(containerDiv);
  ctx.objectsMap.set(id, obj);
}

export function centerObject(
  ctx: ReactDrawContext,
  obj: DrawingData,
  w?: number,
  h?: number
) {
  const viewContainer = ctx.viewContainer;
  const viewBox = viewContainer.getBoundingClientRect();
  const div = obj.containerDiv;
  if (!w || !h) {
    const { width, height } = div.getBoundingClientRect();
    w = w || width;
    h = h || height;
  }
  const top = viewBox.height / 2 - h / 2;
  const left = viewBox.width / 2 - w / 2;
  div.style.top = top + "px";
  div.style.left = left + "px";
  div.style.height = h + "px";
  div.style.width = w + "px";
}

export function makeDeleteAction(ctx: ReactDrawContext) {
  const initialAction: ActionObject = {
    toolId: "",
    toolType: "top-bar-tool",
    objectId: "",
    data: [],
    action: "delete",
  };
  return initialAction;
}

export function collectObjectsForDeleteAction(
  action: ActionObject,
  ctx: ReactDrawContext
) {
  const data: string[] = action.data;
  if (!data || !Array.isArray(data)) {
    console.error(action);
    throw new Error("malformed data");
  }
  action.data = {};
  for (const objectId of data) {
    const object = getObjectFromMap(ctx.objectsMap, objectId);
    action.data[objectId] = object;
  }
  action.action = "delete";
  return action;
}
