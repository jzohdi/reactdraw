import { ActionObject, Point, ReactDrawContext } from "../../types";
import { RotateUndoData } from "./types";
import { getCenterPoint, getRelativePoint, getTouchCoords } from "../utils";
import { getRotateFromDiv } from "./getRotateFromDiv";
import { getSelectedDrawingObjects } from "./getSelectedDrawingObjects";
import { alertAfterUpdate } from "../alertAfterUpdate";
import { pushActionToStack } from "../pushActionToStack";
import { SELECT_TOOL_ID } from "../../constants";
import { rotateDiv } from "./rotateDiv";
import { getBoxSize } from "..";

function startRotating(ctx: ReactDrawContext, relativePoint: Point) {
  const state = ctx.fullState[SELECT_TOOL_ID];
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
  const referenceCenter = getCenterPoint(getBoxSize(data));
  rotateDiv(data, relativePoint, referenceCenter);
  state.prevPoint = relativePoint;
  alertAfterUpdate(data, ctx);
}

function startRotate(ctx: ReactDrawContext, relativePoint: Point) {
  ctx.fullState[SELECT_TOOL_ID].prevPoint = relativePoint;
  pushRotateToUndoStack(ctx);
}

function stopRotate(ctx: ReactDrawContext) {
  const state = ctx.fullState[SELECT_TOOL_ID];
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
    window.addEventListener("touchmove", handleRotatingTouch, {
      passive: true,
    });
    window.addEventListener("touchend", handleStopRotateTouch, {
      passive: true,
    });
    window.addEventListener("touchcancel", handleStopRotateTouch, {
      passive: true,
    });
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
  const customState = ctx.fullState[SELECT_TOOL_ID];
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
  selectFrame.addEventListener("touchstart", handleStartRotateTouch, {
    passive: true,
  });
}

function pushRotateToUndoStack(ctx: ReactDrawContext) {
  const state = ctx.fullState[SELECT_TOOL_ID];
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
        objectId: o.id,
        rotate: getRotateFromDiv(o.containerDiv),
      } as RotateUndoData;
    }),
  };
  pushActionToStack(action, ctx);
}
