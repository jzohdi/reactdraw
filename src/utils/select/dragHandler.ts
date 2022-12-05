import { ActionObject, Point, ReactDrawContext } from "../../types";
import { DragUndoData } from "./types";
// import { dragDivs, getRelativePoint, getTouchCoords } from "./utils";
import { getSelectedDrawingObjects } from "./getSelectedDrawingObjects";
import { alertAfterUpdate } from "../alertAfterUpdate";
import { pushActionToStack } from "../pushActionToStack";
import { SELECT_TOOL_ID } from "../../constants";
import { dragDivs } from "./dragDivs";
import { getRelativePoint, getTouchCoords } from "../utils";
import { getBoxSize } from "..";

function startDragging(ctx: ReactDrawContext, relativePoint: Point) {
  const state = ctx.fullState[SELECT_TOOL_ID];
  const prevPoint = state.prevPoint;
  //   console.log("start dragging");
  if (!prevPoint) {
    console.error("handleDrag prev point not set");
    return;
  }
  const selectedObjects = getSelectedDrawingObjects(
    state.selectedIds,
    ctx.objectsMap
  );
  //   console.log(state.selectedIds, ctx.objectsMap);
  dragDivs(selectedObjects, prevPoint, relativePoint);
  state.prevPoint = relativePoint;
  if (selectedObjects.length === 1) {
    alertAfterUpdate(selectedObjects[0], ctx);
  }
}

function startDrag(ctx: ReactDrawContext, relativePoint: Point) {
  const state = ctx.fullState[SELECT_TOOL_ID];
  state.prevPoint = relativePoint;
  pushDragToUndoStack(ctx);
}

function stopDrag(ctx: ReactDrawContext) {
  const state = ctx.fullState[SELECT_TOOL_ID];
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
    window.addEventListener("touchmove", handleDragTouch, { passive: true });
    window.addEventListener("touchend", handleStopDragTouch, { passive: true });
    window.addEventListener("touchcancel", handleStopDragTouch, {
      passive: true,
    });
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
  const customState = ctx.fullState[SELECT_TOOL_ID];
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
  selectFrame.addEventListener("touchstart", handleStartDragTouch, {
    passive: true,
  });
}

function pushDragToUndoStack(ctx: ReactDrawContext) {
  const state = ctx.fullState[SELECT_TOOL_ID];
  const selectedObjects = getSelectedDrawingObjects(
    state.selectedIds,
    ctx.objectsMap
  );
  const action: ActionObject = {
    objectId: "",
    toolId: SELECT_TOOL_ID,
    toolType: "top-bar-tool",
    action: "drag",
    data: selectedObjects.map((o) => {
      const bounds = getBoxSize(o);
      return {
        objectId: o.id,
        top: bounds.top,
        left: bounds.left,
      } as DragUndoData;
    }),
  };
  pushActionToStack(action, ctx);
}
