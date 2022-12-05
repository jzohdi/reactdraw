import {
  ActionObject,
  OnResizeContext,
  Point,
  ReactDrawContext,
} from "../../types";
import { ResizeFunction, ResizeUndoData } from "./types";
import { getRelativePoint, getTouchCoords } from "../utils";
import { getSelectedDrawingObjects } from "./getSelectedDrawingObjects";
import { getToolById } from "../utils";

import { pushActionToStack } from "../pushActionToStack";
import { SELECT_TOOL_ID } from "../../constants";
import { getBoxSize } from "..";

function startResizing(
  ctx: ReactDrawContext,
  relativePoint: Point,
  resizeFn: ResizeFunction
) {
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
  //   const pointDiff: Point = getPointDiff(relativePoint, prevPoint);
  const toolUsed = getToolById(ctx.drawingTools, data.toolId);
  const newResizeCtx: OnResizeContext = {
    viewContainer: ctx.viewContainer,
    newPoint: relativePoint,
    previousPoint: prevPoint,
  };
  // probably dont do this, this is an implementation detail of the select tool so other tools should not expose functionality for it specifically
  if (toolUsed.doResize) {
    toolUsed.doResize(data, newResizeCtx);
  } else {
    resizeFn(data, newResizeCtx);
  }
  toolUsed.onResize(data, newResizeCtx);
  state.prevPoint = relativePoint;
}

function startResize(ctx: ReactDrawContext, relativePoint: Point) {
  ctx.fullState[SELECT_TOOL_ID].prevPoint = relativePoint;
  pushResizeToUndoStack(ctx);
}

function stopResize(ctx: ReactDrawContext) {
  const state = ctx.fullState[SELECT_TOOL_ID];
  state.prevPoint = null;
}

export default function addHandlersToCornerButton(
  buttonEle: HTMLButtonElement,
  objectId: string,
  ctx: ReactDrawContext,
  resizeFn: ResizeFunction
) {
  const handleStartResizeMouse = function (e: MouseEvent) {
    e.stopPropagation();
    const point: Point = [e.clientX, e.clientY];
    const relativePoint = getRelativePoint(point, ctx.viewContainer);
    startResize(ctx, relativePoint);
    window.addEventListener("mousemove", handleResizeMouse);
    window.addEventListener("mouseup", handleStopResizeMouse);
  };
  const handleResizeMouse = function (e: MouseEvent) {
    e.stopPropagation();
    const point: Point = [e.clientX, e.clientY];
    const relativePoint = getRelativePoint(point, ctx.viewContainer);
    startResizing(ctx, relativePoint, resizeFn);
  };
  const handleStopResizeMouse = function (e: MouseEvent) {
    e.stopPropagation();
    stopResize(ctx);
    window.removeEventListener("mousemove", handleResizeMouse);
    window.removeEventListener("mouseup", handleStopResizeMouse);
  };
  const handleStartResizeTouch = function (e: TouchEvent) {
    e.stopPropagation();
    const startPoint = getTouchCoords(e);
    const relativePoint = getRelativePoint(startPoint, ctx.viewContainer);
    startResize(ctx, relativePoint);
    window.addEventListener("touchmove", handleResizeTouch, { passive: true });
    window.addEventListener("touchend", handleStopResizeTouch, {
      passive: true,
    });
    window.addEventListener("touchcancel", handleStopResizeTouch, {
      passive: true,
    });
  };
  const handleResizeTouch = function (e: TouchEvent) {
    e.stopPropagation();
    const startPoint = getTouchCoords(e);
    const relativePoint = getRelativePoint(startPoint, ctx.viewContainer);
    startResizing(ctx, relativePoint, resizeFn);
  };
  const handleStopResizeTouch = function (e: TouchEvent) {
    e.stopPropagation();
    stopResize(ctx);
    window.removeEventListener("touchmove", handleResizeTouch);
    window.removeEventListener("touchend", handleStopResizeTouch);
    window.removeEventListener("touchcancel", handleStopResizeTouch);
  };
  //   const;
  const customState = ctx.fullState[SELECT_TOOL_ID];
  const handlers = customState.handlers[objectId] || [];
  customState.handlers[objectId] = handlers;
  handlers.push({
    ele: buttonEle,
    eventName: "mousedown",
    fn: handleStartResizeMouse,
  });
  handlers.push({
    ele: buttonEle,
    eventName: "touchstart",
    fn: handleStartResizeTouch,
  });
  buttonEle.addEventListener("mousedown", handleStartResizeMouse);
  buttonEle.addEventListener("touchstart", handleStartResizeTouch, {
    passive: true,
  });
}
function getPointDiff(pointA: Point, pointB: Point): Point {
  return [pointA[0] - pointB[0], pointA[1] - pointB[1]];
}

function pushResizeToUndoStack(ctx: ReactDrawContext) {
  const state = ctx.fullState[SELECT_TOOL_ID];
  const selectedObjects = getSelectedDrawingObjects(
    state.selectedIds,
    ctx.objectsMap
  );
  if (selectedObjects.length !== 1) {
    throw new Error("resize push to stack expects 1 object selected");
  }
  const object = selectedObjects[0];
  const bounds = getBoxSize(object);
  const action: ActionObject = {
    objectId: object.id,
    toolId: SELECT_TOOL_ID,
    toolType: "top-bar-tool",
    action: "resize",
    data: {
      bounds: {
        top: bounds.top,
        left: bounds.left,
        right: bounds.right,
        bottom: bounds.bottom,
      },
    } as ResizeUndoData,
  };
  pushActionToStack(action, ctx);
}
