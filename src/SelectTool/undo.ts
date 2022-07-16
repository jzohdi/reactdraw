import { ActionObject, ReactDrawContext, RectBounds } from "../types";
import { getObjectFromMap, getToolById } from "../utils/utils";
import { alertAfterUpdate } from "../utils/alertAfterUpdate";
import {
  DragUndoData,
  ResizeUndoData,
  RotateUndoData,
} from "../utils/select/types";
import { getRotateFromDiv } from "../utils/select/getRotateFromDiv";

export function handleDragUndo(
  action: ActionObject,
  ctx: ReactDrawContext
): ActionObject {
  const data = action.data as DragUndoData[];
  const redoData: DragUndoData[] = [];
  for (const obj of data) {
    const object = getObjectFromMap(ctx.objectsMap, obj.objectId);
    const { bounds, div } = object.container;
    const { left, top } = obj;
    redoData.push({
      objectId: obj.objectId,
      top: bounds.top,
      left: bounds.left,
    });
    bounds.top = top;
    bounds.left = left;
    div.style.left = left + "px";
    div.style.top = top + "px";
    alertAfterUpdate(object, ctx);
  }

  action.data = redoData;
  return action;
}

export function handleRotateUndo(
  action: ActionObject,
  ctx: ReactDrawContext
): ActionObject {
  const data = action.data as RotateUndoData[];
  const redoData: RotateUndoData[] = [];
  for (const obj of data) {
    const object = getObjectFromMap(ctx.objectsMap, obj.objectId);
    const { div } = object.container;
    const currRotate = getRotateFromDiv(div);
    redoData.push({
      objectId: obj.objectId,
      rotate: currRotate,
    });
    div.style.transform = `rotate(${obj.rotate}deg)`;
    alertAfterUpdate(object, ctx);
  }
  action.data = redoData;
  return action;
}

export function handelResizUndo(
  action: ActionObject,
  ctx: ReactDrawContext
): ActionObject {
  const object = getObjectFromMap(ctx.objectsMap, action.objectId);
  const undoData = action.data as ResizeUndoData;
  const currBounds = object.container.bounds;
  const redoBounds: RectBounds = { ...currBounds };

  setDivToBounds(object.container.div, undoData.bounds);

  object.container.bounds = undoData.bounds;

  const toolUsed = getToolById(ctx.drawingTools, object.toolId);
  toolUsed.onResize(object, {
    ...ctx,
    previousPoint: [currBounds.left, currBounds.top],
    newPoint: [undoData.bounds.left, undoData.bounds.top],
  });
  action.data.bounds = redoBounds;
  return action;
}

function setDivToBounds(div: HTMLDivElement, bounds: RectBounds) {
  div.style.left = bounds.left + "px";
  div.style.top = bounds.top + "px";
  div.style.width = bounds.right - bounds.left + "px";
  div.style.height = bounds.bottom - bounds.top + "px";
}
