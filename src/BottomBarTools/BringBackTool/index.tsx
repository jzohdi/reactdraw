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

export function bringSelectedBack(ctx: ReactDrawContext) {
  const selectedIds = getSelectedIdsFromFullState(ctx);
  if (selectedIds.length < 1) {
    return;
  }
  const selectObjects = selectedIds.map((id) =>
    getObjectFromMap(ctx.objectsMap, id)
  );
  // TODO: maybe do something smarter
  let lowestZIndex = Infinity;
  for (const curr of ctx.objectsMap.values()) {
    const z = pushObjectUp(curr);
    if (z < lowestZIndex) {
      lowestZIndex = z;
    }
  }
  selectObjects.forEach((obj) => {
    obj.containerDiv.style.zIndex = lowestZIndex.toString();
    obj.style.zIndex = lowestZIndex.toString();
  });
}

function pushObjectUp(data: DrawingData): number {
  const currZ = parseInt(data.style.zIndex);
  data.containerDiv.style.zIndex = (currZ + 1).toString();
  data.style.zIndex = (currZ + 1).toString();
  return currZ;
}
