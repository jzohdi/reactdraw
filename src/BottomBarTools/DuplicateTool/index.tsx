import React from "react";
import {
  ActionObject,
  ActionTools,
  DrawingData,
  ReactDrawContext,
} from "../../types";
import { DuplicateIcon } from "@jzohdi/jsx-icons";
import { getObjectFromMap, getToolById } from "../../utils/utils";
import {
  getSelectedIdsFromFullState,
  selectElement,
  selectManyElements,
  unselectAll,
} from "../../utils/select/utils";
import { getBoxSize, makeid } from "../../utils";
import { recreateDeletedObjects } from "../../utils/undo";
import { pushActionToStack } from "../../utils/pushActionToStack";
import { SELECT_TOOL_ID } from "../../constants";

const duplicateTool: ActionTools = {
  id: "react-draw-duplicate-tool",
  tooltip: "Duplicate objects",
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
    const resultData = newObjects.map((object) => {
      const { toolId, id } = object;
      ctx.objectsMap.set(id, object);
      ctx.viewContainer.appendChild(object.containerDiv);
      const action: ActionObject = {
        action: "create",
        toolType: "top-bar-tool",
        toolId,
        objectId: id,
        data: object,
      };
      return action;
    });
    if (ctx.shouldKeepHistory) {
      const resultAction: ActionObject = {
        toolId: "",
        objectId: "",
        toolType: "batch",
        action: "batch",
        data: resultData,
      };
      pushActionToStack(resultAction, ctx);
    }
    if (selectedIds.length === 1) {
      selectElement(newObjects[0], ctx);
    } else {
      selectManyElements(newObjects, ctx);
    }
    const selectState = ctx.fullState[SELECT_TOOL_ID];
    selectState.selectedIds = newObjects.map((o) => o.id);
  },
};

export default duplicateTool;

function duplicateObject(
  object: DrawingData,
  ctx: ReactDrawContext
): DrawingData {
  const div = object.containerDiv;
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
    containerDiv: newDiv,
    id: newId,
  };
  const bbox = getBoxSize(object);
  newDiv.style.top = bbox.top + 5 + "px";
  newDiv.style.left = bbox.left + 10 + "px";

  const tool = getToolById(ctx.drawingTools, object.toolId);
  if (tool.onDuplicate) {
    return tool.onDuplicate(data, ctx);
  }
  return data;
}

function makeNewId(divId: string) {
  const newId = makeid(6);
  const parts = divId.split("-");
  parts[parts.length - 1] = makeid(6);
  return { divId: parts.join("-"), newId };
}
