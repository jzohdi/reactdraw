import React from "react";
import { BackIcon } from "@jzohdi/jsx-icons";
import { ActionTools, DrawingData, ReactDrawContext } from "../../types";
import { getSelectedIdsFromFullState } from "../../utils/select/utils";
import { getObjectFromMap } from "../../utils/utils";

const bringBackTool: ActionTools = {
  id: "react-draw-back-tool",
  icon: <BackIcon />,
  tooltip: "Move object back",
  getDisplayMode(ctx) {
    const selectedIds = getSelectedIdsFromFullState(ctx);
    if (selectedIds.length > 0) {
      return "show";
    }
    return "disabled";
  },
  handleContext(ctx) {
    bringSelectedBack(ctx);
  },
};

export default bringBackTool;

/**
 * Always use div ele as source of truth
 * Algo:
 * 1. take the selected Objects and set their z-index to min num
 *    ei: if there are 3 selected then z-index will be 0,0,0 (TODO: preserve order)
 * 2. find the current lowest object not selected
 * 3. add the different from the lowest(unselected) to the highest (selected)
 */
export function bringSelectedBack(ctx: ReactDrawContext) {
  const selectedIds = getSelectedIdsFromFullState(ctx);
  if (selectedIds.length < 1) {
    return;
  }
  let selectedObjects: DrawingData[] = [];
  let selectedIdSet: Set<string> = new Set();
  selectedIds.forEach((id) => {
    selectedObjects.push(getObjectFromMap(ctx.objectsMap, id));
    selectedIdSet.add(id);
  });
  for (const object of selectedObjects) {
    object.style.zIndex = "0";
    object.containerDiv.style.zIndex = "0";
  }
  let lowestNumNotSelected = Infinity;
  for (const object of ctx.objectsMap.values()) {
    if (selectedIdSet.has(object.id)) {
      continue;
    }
    const objectZIndex = parseInt(object.containerDiv.style.zIndex ?? "0");
    if (objectZIndex < lowestNumNotSelected) {
      lowestNumNotSelected = objectZIndex;
    }
  }
  let amountToAdd = 1;
  if (lowestNumNotSelected < 0) {
    amountToAdd = 1 - lowestNumNotSelected;
  }
  for (const object of ctx.objectsMap.values()) {
    if (selectedIdSet.has(object.id)) {
      continue;
    }
    const objectZIndex = parseInt(object.containerDiv.style.zIndex ?? "0");
    const newZIndex = objectZIndex + amountToAdd;
    object.style.zIndex = newZIndex.toString();
    object.containerDiv.style.zIndex = newZIndex.toString();
  }
}
