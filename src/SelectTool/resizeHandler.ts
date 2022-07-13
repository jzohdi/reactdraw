import { OnResizeContext, Point, ReactDrawContext } from "../types";
import { ResizeFunction, SelectToolCustomState } from "./types";
import { getRelativePoint, getTouchCoords } from "../utils";
import { getSelectedDrawingObjects } from "./utils";
import { getToolById } from "../utils/utils";

function startResizing(
  ctx: ReactDrawContext,
  relativePoint: Point,
  resizeFn: ResizeFunction
) {
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
  const pointDiff: Point = getPointDiff(relativePoint, prevPoint);
  const toolUsed = getToolById(ctx.drawingTools, data.toolId);
  const newResizeCtx: OnResizeContext = {
    viewContainer: ctx.viewContainer,
    newPoint: relativePoint,
    previousPoint: prevPoint,
  };
  if (toolUsed.doResize) {
    toolUsed.doResize(data, newResizeCtx);
  } else {
    resizeFn(data, pointDiff);
  }
  toolUsed.onResize(data, newResizeCtx);
  state.prevPoint = relativePoint;
}

function startRotate(ctx: ReactDrawContext, relativePoint: Point) {
  (ctx.customState as SelectToolCustomState).prevPoint = relativePoint;
}

function stopRotate(ctx: ReactDrawContext) {
  const state = ctx.customState as SelectToolCustomState;
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
    startRotate(ctx, relativePoint);
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
    stopRotate(ctx);
    window.removeEventListener("mousemove", handleResizeMouse);
    window.removeEventListener("mouseup", handleStopResizeMouse);
  };
  const handleStartResizeTouch = function (e: TouchEvent) {
    e.stopPropagation();
    const startPoint = getTouchCoords(e);
    const relativePoint = getRelativePoint(startPoint, ctx.viewContainer);
    startRotate(ctx, relativePoint);
    window.addEventListener("touchmove", handleResizeTouch);
    window.addEventListener("touchend", handleStopResizeTouch);
    window.addEventListener("touchcancel", handleStopResizeTouch);
  };
  const handleResizeTouch = function (e: TouchEvent) {
    e.stopPropagation();
    const startPoint = getTouchCoords(e);
    const relativePoint = getRelativePoint(startPoint, ctx.viewContainer);
    startResizing(ctx, relativePoint, resizeFn);
  };
  const handleStopResizeTouch = function (e: TouchEvent) {
    e.stopPropagation();
    stopRotate(ctx);
    window.removeEventListener("touchmove", handleResizeTouch);
    window.removeEventListener("touchend", handleStopResizeTouch);
    window.removeEventListener("touchcancel", handleStopResizeTouch);
  };
  //   const;
  const customState = ctx.customState as SelectToolCustomState;
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
  buttonEle.addEventListener("touchstart", handleStartResizeTouch);
}
function getPointDiff(pointA: Point, pointB: Point): Point {
  return [pointA[0] - pointB[0], pointA[1] - pointB[1]];
}
