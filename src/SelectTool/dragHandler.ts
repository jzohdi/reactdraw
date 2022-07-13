import { Point, ReactDrawContext } from "../types";
import { SelectToolCustomState } from "./types";
import { dragDivs, getRelativePoint, getTouchCoords } from "../utils";
import { getSelectedDrawingObjects } from "./utils";
import { alertAfterUpdate, changeCtxForTool } from "../utils/utils";

function startDragging(ctx: ReactDrawContext, relativePoint: Point) {
  const state = ctx.customState as SelectToolCustomState;
  const prevPoint = state.prevPoint;
  if (!prevPoint) {
    // throw new Error("handleDrag prev point not set");
    return;
  }
  const selectedObjects = getSelectedDrawingObjects(
    state.selectedIds,
    ctx.objectsMap
  );
  dragDivs(selectedObjects, prevPoint, relativePoint);
  state.prevPoint = relativePoint;
  if (selectedObjects.length === 1) {
    alertAfterUpdate(selectedObjects[0], ctx);
  }
}

function startDrag(ctx: ReactDrawContext, relativePoint: Point) {
  (ctx.customState as SelectToolCustomState).prevPoint = relativePoint;
}

function stopDrag(ctx: ReactDrawContext) {
  const state = ctx.customState as SelectToolCustomState;
  state.prevPoint = null;
}

export default function addHandlersToSelectFrame(
  selectFrame: HTMLDivElement,
  objectId: string,
  ctx: ReactDrawContext
) {
  const handleStartDrag = function (e: MouseEvent) {
    e.stopPropagation();
    const point: Point = [e.clientX, e.clientY];
    const relativePoint = getRelativePoint(point, ctx.viewContainer);
    startDrag(ctx, relativePoint);
    window.addEventListener("mousemove", handleDrag);
    window.addEventListener("mouseup", handleStopDrag);
  };
  const handleDrag = function (e: MouseEvent) {
    e.stopPropagation();
    const point: Point = [e.clientX, e.clientY];
    const relativePoint = getRelativePoint(point, ctx.viewContainer);
    startDragging(ctx, relativePoint);
  };
  const handleStopDrag = function (e: MouseEvent) {
    e.stopPropagation();
    stopDrag(ctx);
    window.removeEventListener("mousemove", handleDrag);
    window.removeEventListener("mouseup", handleStopDrag);
  };
  const handleStartDragTouch = function (e: TouchEvent) {
    e.stopPropagation();
    const startPoint = getTouchCoords(e);
    const relativePoint = getRelativePoint(startPoint, ctx.viewContainer);
    startDrag(ctx, relativePoint);
    window.addEventListener("touchmove", handleDragTouch);
    window.addEventListener("touchend", handleStopDragTouch);
    window.addEventListener("touchcancel", handleStopDragTouch);
  };
  const handleDragTouch = function (e: TouchEvent) {
    e.stopPropagation();
    const startPoint = getTouchCoords(e);
    const relativePoint = getRelativePoint(startPoint, ctx.viewContainer);
    startDragging(ctx, relativePoint);
  };
  const handleStopDragTouch = function (e: TouchEvent) {
    e.stopPropagation();
    stopDrag(ctx);
    window.removeEventListener("touchmove", handleDragTouch);
    window.removeEventListener("touchend", handleStopDragTouch);
    window.removeEventListener("touchcancel", handleStopDragTouch);
  };
  //   const;
  const customState = ctx.customState as SelectToolCustomState;
  const handlers = customState.handlers[objectId] || [];
  customState.handlers[objectId] = handlers;
  handlers.push({
    ele: selectFrame,
    eventName: "mousedown",
    fn: handleStartDrag,
  });
  handlers.push({
    ele: selectFrame,
    eventName: "touchstart",
    fn: handleStartDragTouch,
  });
  selectFrame.addEventListener("mousedown", handleStartDrag);
  selectFrame.addEventListener("touchstart", handleStartDragTouch);
}