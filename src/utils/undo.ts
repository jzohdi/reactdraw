import { unselectElement } from "../SelectTool/unselectElement";
import { ActionObject, DrawingData, ReactDrawContext } from "../types";
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
  const data = action.data as { [id: string]: DrawingData };
  if (!data || typeof data !== "object") {
    throw new Error("malformed data");
  }
  const objectIds = Object.keys(data);
  for (const objectId of objectIds) {
    const object = data[objectId];
    // console.log("recreating:", object);
    ctx.viewContainer.appendChild(object.container.div);
    ctx.objectsMap.set(objectId, object);
  }
  action.action = "create";
  action.data = objectIds;
  return action;
}

export function deleteCreatedObjects(
  action: ActionObject,
  ctx: ReactDrawContext
): ActionObject {
  const data: string[] = action.data;
  if (!data || !Array.isArray(data)) {
    throw new Error("malformed data");
  }
  action.data = {};
  for (const objectId of data) {
    action.data[objectId] = getObjectFromMap(ctx.objectsMap, objectId);
    deleteObjectAndNotify(objectId, ctx);
  }
  action.action = "delete";
  return action;
}
