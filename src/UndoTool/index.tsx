import React from "react";
import { ActionObject, ActionTools } from "../types";
import { UndoIcon } from "@jzohdi/jsx-icons";
import { getToolById } from "../utils/utils";

const undoTool: ActionTools = {
  id: "react-draw-undo-tool",
  tooltip: "Undo",
  icon: <UndoIcon />,
  getDisplayMode(ctx) {
    if (ctx.undoStack.length > 0) {
      return "show";
    }
    return "disabled";
  },
  handleContext(ctx) {
    const lastAction = ctx.undoStack.pop();
    if (!lastAction) {
      return;
    }
    // console.log("undo action", lastAction);
    // console.log("new stack", ctx.undoStack);
    if (lastAction.toolType === "top-bar-tool") {
      const tool = getToolById(ctx.drawingTools, lastAction.toolId);
      if (tool.onUndo) {
        const result = tool.onUndo(lastAction, ctx);
        if (ctx.shouldKeepHistory) {
          ctx.redoStack.push(result);
        }
      }
    }
    if (lastAction.toolType === "batch") {
      const data = lastAction.data as ActionObject[];
      const result = [];
      for (const obj of data) {
        const tool = getToolById(ctx.drawingTools, obj.toolId);
        if (tool.onUndo) {
          result.push(tool.onUndo(obj, ctx));
        }
      }
      lastAction.data = result;
      if (ctx.shouldKeepHistory) {
        ctx.redoStack.push(lastAction);
      }
    }
  },
};

export default undoTool;
