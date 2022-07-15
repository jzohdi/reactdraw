import React from "react";
import { ActionTools, DrawingData, ReactDrawContext } from "../types";
import { DuplicateIcon } from "@jzohdi/jsx-icons";
import {
  changeCtxForTool,
  getObjectFromMap,
  getToolById,
} from "../utils/utils";
import {
  getSelectedIdsFromFullState,
  selectElement,
  selectManyElements,
  unselectAll,
} from "../SelectTool/utils";
import { makeid } from "../utils";
import { pushActionToStack, recreateDeletedObjects } from "../utils/undo";
import { SELECT_TOOL_ID } from "../SelectTool/constants";
import { SelectToolCustomState } from "../SelectTool/types";

const duplicateTool: ActionTools = {
  id: "react-draw-duplicate-tool",
  icon: <DuplicateIcon />,
  getDisplayMode(ctx) {
    const selectedIds = getSelectedIdsFromFullState(ctx);
    if (selectedIds.length > 0) {
      return "show";
    }
    return "disabled";
  },
  handleContext(ctx) {
    const selectedIds = getSelectedIdsFromFullState(ctx);
    if (selectedIds.length < 1) {
      return;
    }
    const objects = selectedIds.map((id) =>
      getObjectFromMap(ctx.objectsMap, id)
    );
    unselectAll(objects, ctx);
    const newObjects = objects.map((o) => duplicateObject(o, ctx));
    const data: { [id: string]: DrawingData } = {};
    // console.log("duplicated objects:", newObjects);
    const resultAction = recreateDeletedObjects(
      {
        toolId: SELECT_TOOL_ID,
        objectId: "",
        toolType: "top-bar-tool",
        action: "delete",
        data: newObjects.reduce((prev, cur) => {
          prev[cur.container.id] = cur;
          return prev;
        }, data),
      },
      ctx
    );
    pushActionToStack(resultAction, ctx);
    if (selectedIds.length === 1) {
      selectElement(newObjects[0], ctx);
    } else {
      selectManyElements(newObjects, ctx);
    }
    const selectState = ctx.fullState.get(
      SELECT_TOOL_ID
    ) as SelectToolCustomState;
    selectState.selectedIds = newObjects.map((o) => o.container.id);
  },
};

export default duplicateTool;

function duplicateObject(
  object: DrawingData,
  ctx: ReactDrawContext
): DrawingData {
  const { div, id, bounds } = object.container;
  const newDiv = div.cloneNode(true) as HTMLDivElement;
  const { newId, divId } = makeNewId(div.id);
  newDiv.id = divId;
  const data: DrawingData = {
    coords: object.coords.slice(0),
    toolId: object.toolId,
    element: newDiv.lastElementChild as HTMLElement,
    style: {
      ...object.style,
    },
    customData: new Map(object.customData),
    container: {
      bounds: {
        top: bounds.top + 10,
        left: bounds.left + 10,
        bottom: bounds.bottom + 10,
        right: bounds.right + 10,
      },
      div: newDiv,
      id: newId,
    },
  };
  newDiv.style.top = data.container.bounds.top + "px";
  newDiv.style.left = data.container.bounds.left + "px";

  const tool = getToolById(ctx.drawingTools, object.toolId);
  if (tool.onDuplicate) {
    return tool.onDuplicate(data, changeCtxForTool(ctx, object.toolId));
  }
  return data;
}

function makeNewId(divId: string) {
  const newId = makeid(6);
  const parts = divId.split("-");
  parts[parts.length - 1] = makeid(6);
  return { divId: parts.join("-"), newId };
}
