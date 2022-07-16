import React from "react";
import { TrashCanBoldIcon } from "@jzohdi/jsx-icons";
import { getSelectedIdsFromFullState } from "../utils/select/utils";
import { ActionTools } from "../types";
import { deleteCreatedObjects, pushActionToStack } from "../utils/undo";
import { SELECT_TOOL_ID } from "../constants";

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
    /// TODO: should be for self?
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
