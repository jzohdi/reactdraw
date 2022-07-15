import React from "react";
import { ActionTools } from "../types";
import { RedoIcon } from "@jzohdi/jsx-icons";
import { changeCtxForTool, getToolById } from "../utils/utils";

const undoTool: ActionTools = {
  id: "react-draw-redo-tool",
  icon: <RedoIcon />,
  getDisplayMode(ctx) {
    // console.log(ctx);
    if (ctx.redoStack.length > 0) {
      return "show";
    }
    return "disabled";
  },
  handleContext(ctx) {
    const lastAction = ctx.redoStack.pop();
    if (!lastAction) {
      return;
    }
    // console.log("popped action", lastAction);
    // console.log("new stack", ctx.undoStack);
    if (lastAction.toolType === "top-bar-tool") {
      const tool = getToolById(ctx.drawingTools, lastAction.toolId);
      if (tool.onRedo) {
        const result = tool.onRedo(lastAction, changeCtxForTool(ctx, tool.id));
        if (ctx.shouldKeepHistory) {
          ctx.undoStack.push(result);
        }
      }
    }
  },
};

export default undoTool;
