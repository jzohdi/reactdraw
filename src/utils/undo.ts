import { ActionObject, DrawingData, ReactDrawContext } from "../types";
import { deleteObjectAndNotify } from "./utils";

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
  const object = ctx.objectsMap[action.objectId];
  if (!object) {
    throw new Error("Could not find object during square onUndo");
  }
  deleteObjectAndNotify(action.objectId, ctx);
  action.data = object;
  action.action = "delete";
  return action;
}

export function pushActionToStack(action: ActionObject, ctx: ReactDrawContext) {
  ctx.undoStack.push(action);
  ctx.redoStack.splice(0);
  //   console.log(ctx.undoStack, ctx.redoStack);
}
