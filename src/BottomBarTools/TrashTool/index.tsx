import React from "react";
import { TrashCanBoldIcon } from "@jzohdi/jsx-icons";
import { getSelectedIdsFromFullState } from "../../utils/select/utils";
import { ActionTools } from "../../types";
import { deleteCreatedObjects } from "../../utils/undo";
import { pushActionToStack } from "../../utils/pushActionToStack";
import { SELECT_TOOL_ID } from "../../constants";
import { batchDelete } from "../../utils/utils";

const trashTool: ActionTools = {
  id: "react-draw-trash-tool",
  icon: <TrashCanBoldIcon />,
  tooltip: "Delete selected objects",
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
    /// TODO: should be for self? this unloaded the work to the select tool
    batchDelete(selectedIds, ctx);
  },
};

export default trashTool;
