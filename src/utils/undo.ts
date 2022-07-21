import {
  ActionObject,
  DrawingData,
  ReactDrawContext,
  ToolPropertiesMap,
} from "../types";
import { borderFromStyles } from "./updateStyles/color";
import { deleteObjectAndNotify, getObjectFromMap } from "./utils";

export function saveCreateToUndoStack(
  data: DrawingData,
  ctx: ReactDrawContext
) {
  if (!ctx.shouldKeepHistory) {
    return;
  }
  const newAction: ActionObject = {
    toolId: data.toolId,
    toolType: "top-bar-tool",
    objectId: data.container.id,
    action: "create",
    data: null,
  };
  pushActionToStack(newAction, ctx);
}

export function undoCreate(
  action: ActionObject,
  ctx: ReactDrawContext
): ActionObject {
  const object = getObjectFromMap(ctx.objectsMap, action.objectId);
  deleteObjectAndNotify(action.objectId, ctx);
  action.data = object;
  action.action = "delete";
  return action;
}

export function redoDelete(
  action: ActionObject,
  ctx: ReactDrawContext
): ActionObject {
  const object = action.data as DrawingData;
  if (!object) {
    throw new Error("redo delete but no data exists");
  }
  ctx.objectsMap.set(object.container.id, object);
  ctx.viewContainer.appendChild(object.container.div);
  action.data = null;
  action.action = "create";
  return action;
}

export function pushActionToStack(action: ActionObject, ctx: ReactDrawContext) {
  if (ctx.shouldKeepHistory) {
    ctx.undoStack.push(action);
    // console.log("before:", ctx.redoStack);
    ctx.redoStack.splice(0);
    // console.log("after:", ctx.redoStack);
  }
}

/**
 * Expects action.data to be in the form of:
 * {
 * 	  objectId: DrawingData
 * }
 */
export function recreateDeletedObjects(
  action: ActionObject,
  ctx: ReactDrawContext
): ActionObject {
  const data = action.data as Map<string, DrawingData>;
  if (!data || typeof data !== "object") {
    throw new Error("malformed data");
  }
  //   console.log(data);
  for (const [objectId, object] of data.entries()) {
    ctx.viewContainer.appendChild(object.container.div);
    ctx.objectsMap.set(objectId, object);
  }
  action.action = "create";
  action.data = Array.from(data.keys());
  return action;
}

export function deleteCreatedObjects(
  action: ActionObject,
  ctx: ReactDrawContext
): ActionObject {
  const data: string[] = action.data;
  if (!data || !Array.isArray(data)) {
    console.error(action);
    throw new Error("malformed data");
  }
  action.data = new Map<string, DrawingData>();
  for (const objectId of data) {
    action.data.set(objectId, getObjectFromMap(ctx.objectsMap, objectId));
    deleteObjectAndNotify(objectId, ctx);
  }
  action.action = "delete";
  return action;
}

// TODO: Generalize?
export function undoEleBackgroundColor(
  action: ActionObject,
  ctx: ReactDrawContext
): ActionObject {
  const object = getObjectFromMap(ctx.objectsMap, action.objectId);
  const currColor = object.style.background;
  const colorTo = action.data;
  const ele = object.element;
  if (!colorTo || !ele) {
    throw new Error();
  }
  object.style.background = colorTo;
  ele.style.backgroundColor = colorTo;
  action.data = currColor;
  return action;
}

export function undoEleBorderColor(
  action: ActionObject,
  ctx: ReactDrawContext
): ActionObject {
  const object = getObjectFromMap(ctx.objectsMap, action.objectId);
  const currColor = object.style.color;
  const colorTo = action.data;
  const ele = object.element;
  if (!colorTo || !ele) {
    throw new Error();
  }
  object.style.color = colorTo;
  ele.style.border = borderFromStyles(object.style);
  action.data = currColor;
  return action;
}

export function undoSvgPathColor(
  action: ActionObject,
  ctx: ReactDrawContext
): ActionObject {
  return undoSvgStyle(action, ctx, "color", "stroke");
}

export function undoSvgPathFill(
  action: ActionObject,
  ctx: ReactDrawContext
): ActionObject {
  return undoSvgStyle(action, ctx, "background", "fill");
}

function undoSvgStyle(
  action: ActionObject,
  ctx: ReactDrawContext,
  dataKey: keyof ToolPropertiesMap,
  svgKey: string
) {
  const object = getObjectFromMap(ctx.objectsMap, action.objectId);
  const currColor = object.style[dataKey];
  const colorTo = action.data;
  const svg = object.element;
  if (!svg) {
    throw new Error();
  }
  let path = svg.querySelector("path");
  if (!path) {
    path = svg.querySelector("line");
  }
  if (!path) {
    throw new Error();
  }
  object.style[dataKey] = colorTo;
  (<any>path.style)[svgKey] = colorTo;
  action.data = currColor;
  return action;
}
