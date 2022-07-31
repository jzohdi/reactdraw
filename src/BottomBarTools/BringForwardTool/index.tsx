import React from "react";
import { BackIcon, ForwardIcon } from "@jzohdi/jsx-icons";
import { ActionTools, DrawingData } from "../../types";
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
    const selectedIds = getSelectedIdsFromFullState(ctx);
    if (selectedIds.length < 1) {
      return;
    }
    const selectObjects = selectedIds.map((id) =>
      getObjectFromMap(ctx.objectsMap, id)
    );
    let lowestZIndex = -Infinity;
    for (const curr of ctx.objectsMap.values()) {
      const z = pushObjectDown(curr);
      if (z > lowestZIndex) {
        lowestZIndex = z;
      }
    }
    selectObjects.forEach((obj) => {
      obj.container.div.style.zIndex = lowestZIndex.toString();
      obj.style.zIndex = lowestZIndex.toString();
    });
  },
};

export default bringForwardTool;

function pushObjectDown(data: DrawingData): number {
  const currZ = parseInt(data.style.zIndex);
  data.container.div.style.zIndex = (currZ - 1).toString();
  data.style.zIndex = (currZ - 1).toString();
  return currZ;
}
