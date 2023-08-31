import React from "react";
import { BackIcon, ForwardIcon } from "@jzohdi/jsx-icons";
import { ActionTools, DrawingData, ReactDrawContext } from "../../types";
import { getSelectedIdsFromFullState } from "../../utils/select/utils";
import { getObjectFromMap } from "../../utils/utils";

const bringForwardTool: ActionTools = {
  id: "react-draw-forward-tool",
  tooltip: "Move object forward",
  icon: <ForwardIcon />,
  getDisplayMode(ctx) {
    const selectedIds = getSelectedIdsFromFullState(ctx);
    if (selectedIds.length > 0) {
      return "show";
    }
    return "disabled";
  },
  handleContext(ctx) {
    moveSelectedForward(ctx);
  },
};

export default bringForwardTool;

/**
 * Algorithm:
 * get list of selected elements
 * get the list of non-selected elements
 * for each of the selected elements make the z index equal to the number of non-selected elements + 1,
 *   this ensures that there will be enough numbers between this and 0 for the other elements
 * sort the list of non-selected elements by their current z-index
 * for each of the non-selected elements, iterate through and set z-index to current - 1
 *
 * This ensures that the selected are at the top, and the rest maintain their ordering
 *
 * Example:
 * selected = [object1 (z=1), object2 (z=4)]
 * non-selected = [object3 (z=5), object4 (z=2), object5(z=10), object6(z=3)]
 *
 * object1.zindex = 4
 * object2.zindex = 5
 *
 * non-selected
 * (sorted) = [object5, object3, object6, object4],
 * (set zindex) = [(z=3), (z=2), (z=1), (z=0)]
 */
export function moveSelectedForward(ctx: ReactDrawContext) {
  const selectedIds = getSelectedIdsFromFullState(ctx);
  if (selectedIds.length < 1) {
    return;
  }
  const selectedObjects = selectedIds.map((id) =>
    getObjectFromMap(ctx.objectsMap, id)
  );
  // sort selected (this puts lowest on left)
  selectedObjects.sort((a, b) => getCurrentZIndex(a) - getCurrentZIndex(b));

  // get list of non-selected objects
  const nonSelectedObjects: DrawingData[] = [];
  for (const objectOnCanvas of ctx.objectsMap.values()) {
    if (!selectedIds.includes(objectOnCanvas.id)) {
      nonSelectedObjects.push(objectOnCanvas);
    }
  }

  // set selected z-index
  let currentZToSetSelected = nonSelectedObjects.length + 1;
  for (const selected of selectedObjects) {
    selected.style.zIndex = currentZToSetSelected.toString();
    selected.containerDiv.style.zIndex = currentZToSetSelected.toString();
    currentZToSetSelected += 1;
  }

  // sort non-selected (will sort such that larger is in front)
  nonSelectedObjects.sort((a, b) => {
    const zIndexA = getCurrentZIndex(a);
    const zIndexB = getCurrentZIndex(b);
    return zIndexB - zIndexA;
  });
  let currentZToSetNonSelected = nonSelectedObjects.length;
  nonSelectedObjects.forEach((o) => {
    o.style.zIndex = currentZToSetNonSelected.toString();
    o.containerDiv.style.zIndex = currentZToSetNonSelected.toString();
    currentZToSetNonSelected -= 1;
  });
}

/**
 * Uses html as the source of truth and goes to the style as backup
 */
const getCurrentZIndex = (obj: DrawingData): number => {
  if (obj.containerDiv.style.zIndex) {
    return parseInt(obj.containerDiv.style.zIndex);
  }
  if (obj.style.zIndex) {
    return parseInt(obj.style.zIndex);
  }
  return 0;
};
