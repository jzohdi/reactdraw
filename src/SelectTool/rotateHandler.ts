import { ActionObject, Point, ReactDrawContext } from "../types";
import { RotateUndoData, SelectToolCustomState } from "./types";
import {
  rotateDiv,
  getRelativePoint,
  getTouchCoords,
  getCenterPoint,
} from "../utils";
import { getRotateFromDiv, getSelectedDrawingObjects } from "./utils";
import { alertAfterUpdate } from "../utils/utils";
import { SELECT_TOOL_ID } from "./constants";
import { pushActionToStack } from "../utils/undo";

function startRotating(ctx: ReactDrawContext, relativePoint: Point) {
  const state = ctx.customState as SelectToolCustomState;
  const prevPoint = state.prevPoint;
  if (!prevPoint) {
    // throw new Error("handleDrag prev point not set");
    return;
  }
  const selectedObject = getSelectedDrawingObjects(
    state.selectedIds,
    ctx.objectsMap
  );
  if (selectedObject.length !== 1) {
    throw new Error("start rotating got incorrect number of objects to handle");
  }
  const data = selectedObject[0];
  const referenceCenter = getCenterPoint(data.container.bounds);
  rotateDiv(data, relativePoint, referenceCenter);
  state.prevPoint = relativePoint;
  alertAfterUpdate(data, ctx);
}

function startRotate(ctx: ReactDrawContext, relativePoint: Point) {
  (ctx.customState as SelectToolCustomState).prevPoint = relativePoint;
  pushRotateToUndoStack(ctx);
}

function stopRotate(ctx: ReactDrawContext) {
  const state = ctx.customState as SelectToolCustomState;
  state.prevPoint = null;
}

export default function addHandlersToRotateButton(
  selectFrame: HTMLButtonElement,
  objectId: string,
  ctx: ReactDrawContext
) {
  const handleStartRotateMouse = function (e: MouseEvent) {
    e.stopPropagation();
    const point: Point = [e.clientX, e.clientY];
    const relativePoint = getRelativePoint(point, ctx.viewContainer);
    startRotate(ctx, relativePoint);
    window.addEventListener("mousemove", handleRotateMouse);
    window.addEventListener("mouseup", handleStopRotateMouse);
  };
  const handleRotateMouse = function (e: MouseEvent) {
    e.stopPropagation();
    const point: Point = [e.clientX, e.clientY];
    const relativePoint = getRelativePoint(point, ctx.viewContainer);
    startRotating(ctx, relativePoint);
  };
  const handleStopRotateMouse = function (e: MouseEvent) {
    e.stopPropagation();
    stopRotate(ctx);
    window.removeEventListener("mousemove", handleRotateMouse);
    window.removeEventListener("mouseup", handleStopRotateMouse);
  };
  const handleStartRotateTouch = function (e: TouchEvent) {
    e.stopPropagation();
    const startPoint = getTouchCoords(e);
    const relativePoint = getRelativePoint(startPoint, ctx.viewContainer);
    startRotate(ctx, relativePoint);
    window.addEventListener("touchmove", handleRotatingTouch);
    window.addEventListener("touchend", handleStopRotateTouch);
    window.addEventListener("touchcancel", handleStopRotateTouch);
  };
  const handleRotatingTouch = function (e: TouchEvent) {
    e.stopPropagation();
    const startPoint = getTouchCoords(e);
    const relativePoint = getRelativePoint(startPoint, ctx.viewContainer);
    startRotating(ctx, relativePoint);
  };
  const handleStopRotateTouch = function (e: TouchEvent) {
    e.stopPropagation();
    stopRotate(ctx);
    window.removeEventListener("touchmove", handleRotatingTouch);
    window.removeEventListener("touchend", handleStopRotateTouch);
    window.removeEventListener("touchcancel", handleStopRotateTouch);
  };
  //   const;
  const customState = ctx.customState as SelectToolCustomState;
  const handlers = customState.handlers[objectId] || [];
  customState.handlers[objectId] = handlers;
  handlers.push({
    ele: selectFrame,
    eventName: "mousedown",
    fn: handleStartRotateMouse,
  });
  handlers.push({
    ele: selectFrame,
    eventName: "touchstart",
    fn: handleStartRotateTouch,
  });
  selectFrame.addEventListener("mousedown", handleStartRotateMouse);
  selectFrame.addEventListener("touchstart", handleStartRotateTouch);
}

function pushRotateToUndoStack(ctx: ReactDrawContext) {
  const state = ctx.customState as SelectToolCustomState;
  const selectedObjects = getSelectedDrawingObjects(
    state.selectedIds,
    ctx.objectsMap
  );
  const action: ActionObject = {
    objectId: "",
    toolId: SELECT_TOOL_ID, // TODO: maybe better?
    toolType: "top-bar-tool",
    action: "rotate",
    data: selectedObjects.map((o) => {
      return {
        objectId: o.container.id,
        rotate: getRotateFromDiv(o.container.div),
      } as RotateUndoData;
    }),
  };
  pushActionToStack(action, ctx);
}
