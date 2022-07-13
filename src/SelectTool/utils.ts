import {
  DrawingData,
  DrawingDataMap,
  DrawingTools,
  Point,
  ReactDrawContext,
} from "../types";
import { dragDivs, getRelativePoint, getTouchCoords } from "../utils";
import { getToolById, setStyles } from "../utils/utils";
import {
  CORNER_BUTTON_PRE,
  ROTATE_BUTTON_PRE,
  ROTATE_BUTTON_STYLES,
  ROTATE_DOTTED_LINE_STYLES,
  SELECTED_CORNER_BUTTON,
  SELECT_FRAME_DIV_STYLES,
  SELECT_FRAME_PRE,
} from "./constants";
import { SelectToolCustomState } from "./types";

// maybe move this to the custom data also
let isDragging = false;

export function selectManyElements(
  selectObjects: DrawingData[],
  ctx: ReactDrawContext
): void {
  for (const data of selectObjects) {
    const selectFrame = makeSelectFrameDiv(data);
    if (selectFrame) {
      addHandlersToSelectFrame(selectFrame, data.container.id, ctx);
      data.container.div.appendChild(selectFrame);
    }
  }
}

function startDragging(ctx: ReactDrawContext, relativePoint: Point) {
  const state = ctx.customState as SelectToolCustomState;
  const prevPoint = state.prevPoint;
  if (!prevPoint) {
    throw new Error("handleDrag prev point not set");
  }
  const selectedObjects = getSelectedDrawingObjects(
    state.selectedIds,
    ctx.objectsMap
  );
  dragDivs(selectedObjects, prevPoint, relativePoint);
  state.prevPoint = relativePoint;
}

function startDrag(ctx: ReactDrawContext, relativePoint: Point) {
  (ctx.customState as SelectToolCustomState).prevPoint = relativePoint;
  isDragging = true;
}

function stopDrag(ctx: ReactDrawContext) {
  isDragging = false;
  const state = ctx.customState as SelectToolCustomState;
  state.prevPoint = null;
}

function addHandlersToSelectFrame(
  selectFrame: HTMLDivElement,
  objectId: string,
  ctx: ReactDrawContext
) {
  const handleStartDrag = function (e: MouseEvent) {
    e.stopPropagation();
    const point: Point = [e.clientX, e.clientY];
    const relativePoint = getRelativePoint(point, ctx.viewContainer);
    // console.log("start drag");
    startDrag(ctx, relativePoint);
  };
  const handleDrag = function (e: MouseEvent) {
    if (isDragging) {
      e.stopPropagation();
      const point: Point = [e.clientX, e.clientY];
      const relativePoint = getRelativePoint(point, ctx.viewContainer);
      startDragging(ctx, relativePoint);
    }
  };
  const handleStopDrag = function (e: MouseEvent) {
    e.stopPropagation();
    stopDrag(ctx);
  };
  const handleStartDragTouch = function (e: TouchEvent) {
    e.stopPropagation();
    const startPoint = getTouchCoords(e);
    const relativePoint = getRelativePoint(startPoint, ctx.viewContainer);
    startDrag(ctx, relativePoint);
  };
  const handleDragTouch = function (e: TouchEvent) {
    if (isDragging) {
      e.stopPropagation();
      const startPoint = getTouchCoords(e);
      const relativePoint = getRelativePoint(startPoint, ctx.viewContainer);
      startDragging(ctx, relativePoint);
    }
  };
  const handleStopDragTouch = function (e: TouchEvent) {
    e.stopPropagation();
    stopDrag(ctx);
  };
  //   const;
  const customState = ctx.customState as SelectToolCustomState;
  const handlers = customState.handlers[objectId] || [];
  customState.handlers[objectId] = handlers;
  handlers.push({
    ele: selectFrame,
    eventName: "drag",
    fn: handleStartDrag,
  });
  handlers.push({
    ele: selectFrame,
    eventName: "mousemove",
    fn: handleDrag,
  });
  handlers.push({
    ele: selectFrame,
    eventName: "mouseup",
    fn: handleStopDrag,
  });
  handlers.push({
    ele: selectFrame,
    eventName: "drag",
    fn: handleStartDragTouch,
  });
  handlers.push({
    ele: selectFrame,
    eventName: "touchmove",
    fn: handleDragTouch,
  });
  handlers.push({
    ele: selectFrame,
    eventName: "touchend",
    fn: handleStopDragTouch,
  });
  handlers.push({
    ele: selectFrame,
    eventName: "touchcancel",
    fn: handleStopDragTouch,
  });
  selectFrame.addEventListener("mousedown", handleStartDrag);
  selectFrame.addEventListener("mousemove", handleDrag);
  selectFrame.addEventListener("mouseup", handleStopDrag);
  selectFrame.addEventListener("touchstart", handleStartDragTouch);
  selectFrame.addEventListener("touchmove", handleDragTouch);
  selectFrame.addEventListener("touchend", handleStopDragTouch);
  selectFrame.addEventListener("touchcancel", handleStopDragTouch);
}

function makeSelectFrameDiv(data: DrawingData) {
  const containerDiv = data.container.div;
  const eleId = data.container.id;
  if (isElementSelected(containerDiv)) {
    return null;
  }
  const div = document.createElement("div");
  div.setAttribute("id", `${SELECT_FRAME_PRE}-${eleId}`);
  div.setAttribute("draggable", "true");
  setStyles(div, SELECT_FRAME_DIV_STYLES);
  return div;
}

function isElementSelected(div: HTMLDivElement) {
  return div.querySelector('[id^="select-frame"') !== null;
}

export function unselectEverythingAndReturnPrevious(ctx: ReactDrawContext) {
  const selectedIds =
    (ctx.customState as SelectToolCustomState).selectedIds || [];
  const { objectsMap, prevMousePosition } = ctx;
  const objects = getSelectedDrawingObjects(selectedIds, objectsMap);
  unselectAll(objects, ctx);
  if (objects.length === 1) {
    const tool = getToolById(ctx.drawingTools, objects[0].toolId);
    if (tool && ctx && tool.onUnSelect) {
      tool.onUnSelect(objects[0], ctx);
    }
  }
  prevMousePosition.current = null;
  const prevIds = selectedIds.splice(0, selectedIds.length);
  return { ids: prevIds, objects };
}

export function getElementsByIds(
  objects: DrawingDataMap,
  ids: string[]
): DrawingData[] {
  return ids.map((id) => objects[id]);
}

const getSelectedDrawingObjects = (
  selectedIds: string[],
  objects: DrawingDataMap
) => {
  return selectedIds.map((id) => objects[id]);
};

export function notifyTool(
  tools: DrawingTools[],
  data: DrawingData,
  ctx: ReactDrawContext
) {
  const tool = getToolById(tools, data.toolId);
  if (!tool || !ctx || !tool.onSelect) {
    return;
  }
  tool.onSelect(data, ctx);
}

export function unselectAll(
  selectedObjects: DrawingData[],
  ctx: ReactDrawContext
): void {
  for (const obj of selectedObjects) {
    unselectElement(obj, ctx);
  }
}

export function selectElement(data: DrawingData, ctx: ReactDrawContext): void {
  const selectFrame = makeSelectFrameDiv(data);
  if (selectFrame) {
    addHandlersToSelectFrame(selectFrame, data.container.id, ctx);
    addToolsToSelectionDiv(selectFrame, data.container.id);
    data.container.div.appendChild(selectFrame);
  }
}

function addToolsToSelectionDiv(div: HTMLDivElement, eleId: string): void {
  const topLeftCorner = cornerButton(eleId, true, false, false, true);
  const topRightCorner = cornerButton(eleId, true, true);
  const bottomRightCorner = cornerButton(eleId, false, true, true);
  const bottomLeftCorner = cornerButton(eleId, false, false, true, true);

  div.appendChild(topLeftCorner);
  div.appendChild(topRightCorner);
  div.appendChild(bottomRightCorner);
  div.appendChild(bottomLeftCorner);

  const rotateButton = cornerButton(eleId);
  rotateButton.id = `${ROTATE_BUTTON_PRE}-${eleId}`;
  setStyles(rotateButton, ROTATE_BUTTON_STYLES);
  const divLine = document.createElement("div");
  setStyles(divLine, ROTATE_DOTTED_LINE_STYLES);
  divLine.id = `line-div-${eleId}`;
  rotateButton.appendChild(divLine);
  div.appendChild(rotateButton);
}

const CORNER_BUTTON_OFFSET = -12;

function cornerButton(
  eleId: string,
  top?: boolean,
  right?: boolean,
  bottom?: boolean,
  left?: boolean
): HTMLButtonElement {
  const button = document.createElement("button");
  setStyles(button, SELECTED_CORNER_BUTTON);
  let buttonId = "";
  if (top) {
    button.style.top = `${CORNER_BUTTON_OFFSET}px`;
    buttonId += "n";
  } else if (bottom) {
    button.style.bottom = `${CORNER_BUTTON_OFFSET}px`;
    buttonId += "s";
  }
  if (right) {
    button.style.right = `${CORNER_BUTTON_OFFSET}px`;
    buttonId += "e";
  } else if (left) {
    button.style.left = `${CORNER_BUTTON_OFFSET}px`;
    buttonId += "w";
  }
  button.id = `${CORNER_BUTTON_PRE}-${buttonId}-${eleId}`;
  button.style.cursor = `${buttonId}-resize`;
  return button;
}

/**
 * Unselecting an element requires also cleaning up the event listeners
 * TODO: this could be a performance hit.
 * @param data
 * @param ctx
 */
export function unselectElement(
  data: DrawingData,
  ctx: ReactDrawContext
): void {
  const { div } = data.container;
  const selectFrame = div.querySelector('[id^="select-frame"');
  const state = ctx.customState as SelectToolCustomState;
  const handlers = state.handlers[data.container.id];
  if (handlers) {
    // console.log("removing ", handlers.length, "handlers");
    for (const handler of handlers) {
      handler.ele.removeEventListener(handler.eventName, handler.fn);
    }
  }
  state.handlers[data.container.id] = [];
  if (selectFrame !== null) {
    div.removeChild(selectFrame);
  }
}
