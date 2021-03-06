import React from "react";
import { ActionObject, ActionTools } from "../types";
import { RedoIcon } from "@jzohdi/jsx-icons";
import { getToolById } from "../utils/utils";

const redoTool: ActionTools = {
  id: "react-draw-redo-tool",
  tooltip: "Redo",
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
        const result = tool.onRedo(lastAction, ctx);
        if (ctx.shouldKeepHistory) {
          ctx.undoStack.push(result);
        }
      }
    } else if (lastAction.toolType === "batch") {
      const data = lastAction.data as ActionObject[];
      const result = [];
      for (const obj of data) {
        const tool = getToolById(ctx.drawingTools, obj.toolId);
        if (tool.onRedo) {
          result.push(tool.onRedo(obj, ctx));
        }
      }
      lastAction.data = result;
      if (ctx.shouldKeepHistory) {
        ctx.undoStack.push(lastAction);
      }
    }
  },
};

export default redoTool;
