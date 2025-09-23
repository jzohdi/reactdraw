import React from "react";
import { CursorClickIcon } from "@jzohdi/jsx-icons";
import {
  DrawingData,
  DrawingDataMap,
  DrawingTools,
  Point,
  ReactDrawContext,
  RectBounds,
} from "../../types";
import {
  COLORS,
  SELECT_TOOL_DRAG_MIN_DISTANCE,
  SELECT_TOOL_ID,
} from "../../constants";
import {
  BoxSize,
  distance,
  getBoxSize,
  getElementsThatBoundsAreWithin,
  isPointWithinBounds,
  isRectBounding,
  setContainerRect,
} from "../../utils";
import {
  getSelectedIdsFromFullState,
  notifyTool,
  selectElement,
  selectManyElements,
  unselectAll,
  unselectEverythingAndReturnPrevious,
} from "../../utils/select/utils";
import { getSelectedDrawingObjects } from "../../utils/select/getSelectedDrawingObjects";
import { unselectElement } from "../../utils/select/unselectElement";
import { handelResizeUndo, handleDragUndo, handleRotateUndo } from "./undo";
import { deleteCreatedObjects, recreateDeletedObjects } from "../../utils/undo";
import { pushActionToStack } from "../../utils/pushActionToStack";
import {
  getCenterPoint,
  makeDeleteAction,
  makeSureArtifactsGone,
} from "../../utils/utils";
import { getRotateFromDiv } from "../../utils/select/getRotateFromDiv";
import {
  getPointRelativeToOther,
  rotatePointAroundOrigin,
} from "../../utils/resizeObject";

type CallbackFn = (event: string) => void;

export function alertSelected(tool: DrawingTools, ctx: ReactDrawContext) {
  const fns = (tool.localState?.["subs"] as CallbackFn[]) ?? [];
  const selectedIds = getSelectedIdsFromFullState(ctx);
  if (selectedIds.length > 0) {
    fns.forEach((fn) => fn("selected"));
  } else {
    fns.forEach((fn) => fn("none-selected"));
  }
}

const selectTool: DrawingTools = {
  tooltip: "Select tool",
  icon: <CursorClickIcon style={{ transform: "translate(-2px, -1px)" }} />,
  id: SELECT_TOOL_ID,
  onDrawStart: (data) => {
    data.containerDiv.style.border = `1px solid ${COLORS.primary.main}`;
    data.containerDiv.style.backgroundColor = COLORS.primary.light + "4d";
  },
  onDrawing(data, ctx) {
    setContainerRect(data);
    data.coords.splice(1);
    handleTrySelectObjects(data, ctx);
    alertSelected(selectTool, ctx);
  },
  onDrawEnd(data, ctx) {
    const { objectsMap, viewContainer } = ctx;
    viewContainer.removeChild(data.containerDiv);
    objectsMap.delete(data.id);
    makeSureArtifactsGone('[id^="react-draw-cursor"', ctx.viewContainer);
    tryClickObject(data, ctx);
    alertSelected(selectTool, ctx);
  },
  onResize: (data) => {},
  onUnMount(ctx) {
    for (const object of Object.values(ctx.objectsMap)) {
      unselectElement(object, ctx);
    }
    if (selectTool.localState?.["subs"]) {
      selectTool.localState["subs"] = [];
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
    alertSelected(selectTool, ctx);
  },
  onKeyPress(event, ctx) {
    const keyPressed = event.key;
    const shouldDeleteSelected = keyPressed === "Delete";
    if (!shouldDeleteSelected) {
      return;
    }
    deletedSelected(ctx);
    alertSelected(selectTool, ctx);
  },
  undoHandlers: {
    delete: recreateDeletedObjects,
    create: deleteCreatedObjects,
    drag: handleDragUndo,
    rotate: handleRotateUndo,
    resize: handelResizeUndo,
  },
  redoHandlers: {
    delete: recreateDeletedObjects,
    create: deleteCreatedObjects,
    drag: handleDragUndo,
    rotate: handleRotateUndo,
    resize: handelResizeUndo,
  },
  subscribe(callback) {
    if (!selectTool.localState) {
      selectTool.localState = {};
    }
    if (!selectTool.localState?.["subs"]) {
      selectTool.localState["subs"] = [];
    }
    selectTool.localState["subs"].push(callback);
  },
};

export default selectTool;

export function deletedSelected(ctx: ReactDrawContext) {
  const state = ctx.fullState[SELECT_TOOL_ID];
  const selectedIds = state.selectedIds;
  if (selectedIds.length < 1) {
    return;
  }
  const action = makeDeleteAction(ctx);
  action.toolId = SELECT_TOOL_ID;
  action.data = [...selectedIds];
  const resultAction = deleteCreatedObjects(action, ctx);
  if (ctx.shouldKeepHistory) {
    pushActionToStack(resultAction, ctx);
  }
  alertSelected(selectTool, ctx);
}

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
    // const bounds = addPointToBounds(makeBoundingRect(firstPoint), lastPoint);
    // handleTryClickObject(ctx, bounds, didPressShift);
    maybeClickObject(ctx, firstPoint, lastPoint, didPressShift);
  }
};

function maybeClickObject(
  ctx: ReactDrawContext,
  pointA: Point,
  pointB: Point,
  didPressShift: boolean
) {
  const clickedEle = getElementsThatSatisfyPoints(
    ctx.objectsMap,
    pointA,
    pointB
  );
  // unselect everything.
  let { ids } = unselectEverythingAndReturnPrevious(ctx);
  //   console.log(ids, didPressShift);
  // if did not press shift, all prev will be not selected
  if (!didPressShift) {
    ids = [];
  }
  // if item to select found, add to ids
  if (clickedEle !== null) {
    ids = ids.concat([clickedEle.id]);
  }
  handleSelectIds(ctx, ids);
  return ids;
}

/**
 * If either pointA or pointB is contained within the rect
 * select the object. Prioritize objects with a higher z index. Note:
 * zIndex is an implementation detail elsewhere so not the cleanest.
 */
function getElementsThatSatisfyPoints(
  renderedMap: DrawingDataMap,
  pointA: Point,
  pointB: Point
) {
  let itemToSelect = null;
  for (const [_eleId, eleData] of renderedMap.entries()) {
    const zIndex = parseInt(eleData.style.zIndex);
    const bounds = getBoxSize(eleData);
    const rotation = getRotateFromDiv(eleData.containerDiv);
    if (areAnyPointsWithin({ bounds, rotation }, pointA, pointB)) {
      if (itemToSelect === null) {
        itemToSelect = eleData;
        continue;
      }
      const eleIsOnTop = zIndex > parseInt(itemToSelect.style.zIndex);
      if (eleIsOnTop) {
        itemToSelect = eleData;
      }
    }
  }
  return itemToSelect;
}
interface BoundsSpecs {
  bounds: BoxSize;
  rotation: number;
}
function areAnyPointsWithin(
  { bounds, rotation }: BoundsSpecs,
  ...points: Point[]
): boolean {
  for (const point of points) {
    const centerOfBounds = getCenterPoint(bounds);
    const [relativeX, relativeY] = getPointRelativeToOther(
      point,
      centerOfBounds
    );
    const rotatedPoint = rotatePointAroundOrigin(
      relativeX,
      relativeY,
      -rotation
    );
    if (isPointWithinBounds(bounds, rotatedPoint)) {
      return true;
    }
  }
  return false;
}

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
    ids = ids.concat([clickedEle.id]);
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
    getBoxSize(currData),
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

    if (isRectBounding(bounds, getBoxSize(eleData))) {
      elementIdsToSelect.push(eleId);
    }
  }
  return elementIdsToSelect;
}
