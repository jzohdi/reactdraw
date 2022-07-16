import React from "react";
import { CursorClickIcon } from "@jzohdi/jsx-icons";
import {
  DrawingData,
  DrawingDataMap,
  DrawingTools,
  ReactDrawContext,
  RectBounds,
} from "../types";
import {
  COLORS,
  SELECT_TOOL_DRAG_MIN_DISTANCE,
  SELECT_TOOL_ID,
} from "../constants";
import {
  addPointToBounds,
  distance,
  getElementsThatBoundsAreWithin,
  isRectBounding,
  makeBoundingRect,
  setContainerRect,
} from "../utils";
import {
  notifyTool,
  selectElement,
  selectManyElements,
  unselectAll,
  unselectEverythingAndReturnPrevious,
} from "../utils/select/utils";
import { getSelectedDrawingObjects } from "../utils/select/getSelectedDrawingObjects";
import { unselectElement } from "../utils/select/unselectElement";
import { UndoAction } from "../utils/select/types";
import { handelResizUndo, handleDragUndo, handleRotateUndo } from "./undo";
import {
  deleteCreatedObjects,
  pushActionToStack,
  recreateDeletedObjects,
} from "../utils/undo";

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
    objectsMap.delete(data.container.id);
    tryClickObject(data, ctx);
  },
  onResize: (data) => {},
  onUnMount(ctx) {
    for (const object of Object.values(ctx.objectsMap)) {
      unselectElement(object, ctx);
    }
  },
  onUnPickTool(ctx) {
    const state = ctx.fullState[SELECT_TOOL_ID];
    const selectedIds = state.selectedIds;
    if (selectedIds.length === 0) {
      return;
    }
    const objects = getSelectedDrawingObjects(selectedIds, ctx.objectsMap);
    unselectAll(objects, ctx);
    state.selectedIds = [];
  },
  onKeyPress(event, ctx) {
    const keyPressed = event.key;
    const shouldDeleteSelected = keyPressed === "Delete";
    if (!shouldDeleteSelected) {
      return;
    }
    const state = ctx.fullState[SELECT_TOOL_ID];
    const selectedIds = state.selectedIds;
    if (selectedIds.length < 1) {
      return;
    }
    // unselectAll(objects, ctx);
    const resultAction = deleteCreatedObjects(
      {
        toolId: SELECT_TOOL_ID,
        toolType: "top-bar-tool",
        objectId: "",
        data: [...selectedIds],
        action: "delete",
      },
      ctx
    );
    pushActionToStack(resultAction, ctx);
  },
  onUndo(action, ctx) {
    const act = action.action as UndoAction;
    if (act === "delete") {
      return recreateDeletedObjects(action, ctx);
    }
    if (act === "create") {
      return deleteCreatedObjects(action, ctx);
    }
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
  onRedo(action, ctx) {
    const act = action.action as UndoAction;
    if (act === "delete") {
      return recreateDeletedObjects(action, ctx);
    }
    if (act === "create") {
      return deleteCreatedObjects(action, ctx);
    }
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
  const didPressShift = ctx.lastEvent?.shiftKey ?? false;
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
  //   console.log(ids, didPressShift);
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
  ctx.fullState[SELECT_TOOL_ID].selectedIds = objectIds;
  const objects = getSelectedDrawingObjects(objectIds, ctx.objectsMap);
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
  const selected = ctx.fullState[SELECT_TOOL_ID].selectedIds;
  const selectedIds = [...selected];
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
  for (const [eleId, eleData] of renderedMap.entries()) {
    unselectElement(eleData, ctx);

    if (isRectBounding(bounds, eleData.container.bounds)) {
      elementIdsToSelect.push(eleId);
    }
  }
  return elementIdsToSelect;
}
