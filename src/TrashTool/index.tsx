import { TrashCanBoldIcon } from "@jzohdi/jsx-icons";
import React from "react";
import { SELECT_TOOL_ID } from "../SelectTool/constants";
import { getSelectedIdsFromFullState } from "../SelectTool/utils";
import { ActionTools } from "../types";
import { deleteCreatedObjects, pushActionToStack } from "../utils/undo";

const trashTool: ActionTools = {
  id: "react-draw-trash-tool",
  icon: <TrashCanBoldIcon />,
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
    // console.log("trashing:", resultAction);
    pushActionToStack(resultAction, ctx);
  },
};

export default trashTool;
