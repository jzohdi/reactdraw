import React from "react";
import { CursorClickIcon } from "@jzohdi/jsx-icons";
import {
  DrawingData,
  DrawingDataMap,
  DrawingTools,
  ReactDrawContext,
  RectBounds,
} from "../types";
import { COLORS, SELECT_TOOL_DRAG_MIN_DISTANCE } from "../constants";
import {
  addPointToBounds,
  distance,
  getElementsThatBoundsAreWithin,
  isRectBounding,
  makeBoundingRect,
  setContainerRect,
} from "../utils";
import {
  getElementsByIds,
  notifyTool,
  selectElement,
  selectManyElements,
  unselectAll,
  unselectElement,
  unselectEverythingAndReturnPrevious,
} from "./utils";
import { SELECT_TOOL_ID } from "./constants";
import { SelectToolCustomState, UndoAction } from "./types";
import { deleteObjectAndNotify } from "../utils/utils";
import { handelResizUndo, handleDragUndo, handleRotateUndo } from "./undo";

const selectTool: DrawingTools = {
  icon: <CursorClickIcon style={{ transform: "translate(-2px, -1px)" }} />,
  id: SELECT_TOOL_ID,
  onDrawStart: (data) => {
    data.container.div.style.border = `1px solid ${COLORS.primary.main}`;
    data.container.div.style.backgroundColor = COLORS.primary.light + "4d";
  },
  onDrawing: (data, ctx) => {
    setContainerRect(data);
    data.coords.splice(1);
    handleTrySelectObjects(data, ctx);
  },
  onDrawEnd: (data, ctx) => {
    const { objectsMap, viewContainer } = ctx;
    viewContainer.removeChild(data.container.div);
    delete objectsMap[data.container.id];
    tryClickObject(data, ctx);
  },
  onResize: (data) => {},
  onUnMount(ctx) {
    for (const object of Object.values(ctx.objectsMap)) {
      unselectElement(object, ctx);
    }
  },
  setupCustomState(): SelectToolCustomState {
    return {
      selectedIds: [],
      handlers: {},
      prevPoint: null,
    };
  },
  onUnPickTool(ctx) {
    const state = ctx.customState as SelectToolCustomState;
    const selectedIds = state.selectedIds;
    if (selectedIds.length === 0) {
      return;
    }
    const objects = selectedIds.map((id) => ctx.objectsMap[id]);
    unselectAll(objects, ctx);
    state.selectedIds = [];
  },
  onKeyPress(event, ctx) {
    const keyPressed = event.key;
    const shouldDeleteSelected = keyPressed === "Delete";
    if (!shouldDeleteSelected) {
      return;
    }
    const state = ctx.customState as SelectToolCustomState;
    const selectedIds = state.selectedIds;
    if (selectedIds.length < 1) {
      return;
    }
    const objects = getElementsByIds(ctx.objectsMap, selectedIds);
    unselectAll(objects, ctx);
    for (const object of objects) {
      deleteObjectAndNotify(object.container.id, ctx);
    }
  },
  onUndo(action, ctx) {
    const act = action.action as UndoAction;
    if (act === "drag") {
      return handleDragUndo(action, ctx);
    }
    if (act === "rotate") {
      return handleRotateUndo(action, ctx);
    }
    if (act === "resize") {
      return handelResizUndo(action, ctx);
    }
    console.log("unsupported action", action);
    throw new Error();
  },
};

export default selectTool;

/**
 * If the user is using the select tool, the draw end function couldve
 * been intended to click on an object. We can check for this by
 * checking if the [x,y] position of the click on mouseup/touchend (lastPoint),
 * is within a min distnace from the initial [x, y] start.
 */
const tryClickObject = (drawingData: DrawingData, ctx: ReactDrawContext) => {
  // if the distance from mouse down to mouse up is small, then see if user tried to select something.
  const didPressShift = !!ctx.lastEvent?.shiftKey;
  const firstPoint = drawingData.coords[0];
  const lastPoint = drawingData.coords[drawingData.coords.length - 1];
  if (distance(lastPoint, firstPoint) < SELECT_TOOL_DRAG_MIN_DISTANCE) {
    const bounds = addPointToBounds(makeBoundingRect(firstPoint), lastPoint);
    handleTryClickObject(ctx, bounds, didPressShift);
  }
};

const handleTryClickObject = (
  ctx: ReactDrawContext,
  bounds: RectBounds,
  didPressShift: boolean
) => {
  const clickedEle = getElementsThatBoundsAreWithin(ctx.objectsMap, bounds);
  // unselect everything.
  let { ids } = unselectEverythingAndReturnPrevious(ctx);

  // if did not press shift, all prev will be not selected
  if (!didPressShift) {
    ids = [];
  }
  // if item to select found, add to ids
  if (clickedEle !== null) {
    ids = ids.concat([clickedEle.container.id]);
  }
  handleSelectIds(ctx, ids);
  return ids;
};

function handleSelectIds(ctx: ReactDrawContext, objectIds: string[]) {
  (ctx.customState as SelectToolCustomState).selectedIds = objectIds;
  const objects = getElementsByIds(ctx.objectsMap, objectIds);
  if (objects.length === 1) {
    notifyTool(ctx.drawingTools, objects[0], ctx);
    return selectElement(objects[0], ctx);
  }
  if (objects.length > 1) {
    return selectManyElements(objects, ctx);
  }
}

function handleTrySelectObjects(currData: DrawingData, ctx: ReactDrawContext) {
  const didPressShift = ctx.lastEvent?.shiftKey ?? false;
  const selectedIds =
    (ctx.customState as SelectToolCustomState).selectedIds || [];
  let elementIdsToSelect = getElementIdsInsideOfBounds(
    ctx.objectsMap,
    currData.container.bounds,
    ctx
  );
  if (didPressShift) {
    elementIdsToSelect = new Array(
      ...new Set([...elementIdsToSelect, ...selectedIds])
    );
  }
  handleSelectIds(ctx, elementIdsToSelect);
}

function getElementIdsInsideOfBounds(
  renderedMap: DrawingDataMap,
  bounds: RectBounds,
  ctx: ReactDrawContext
) {
  const elementIdsToSelect = [];
  for (const elementId in renderedMap) {
    const eleData = renderedMap[elementId];
    unselectElement(eleData, ctx);

    if (isRectBounding(bounds, eleData.container.bounds)) {
      elementIdsToSelect.push(elementId);
    }
  }
  return elementIdsToSelect;
}
