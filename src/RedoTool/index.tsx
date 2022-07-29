import React from "react";
import { ActionObject, ActionTools, ReactDrawContext } from "../types";
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
      return handleTopBarRedo(ctx, lastAction);
    }
    if (lastAction.toolType === "batch") {
      return handleBatchAction(ctx, lastAction);
    }
  },
};

export default redoTool;

function handleTopBarRedo(ctx: ReactDrawContext, action: ActionObject) {
  const toolId = action.toolId;
  const tool = getToolById(ctx.drawingTools, toolId);
  const handlers = tool.redoHandlers;
  const actionKey = action.action;
  if (!handlers) {
    console.error("tool:", tool, "does not implement undo functionality");
    return;
  }
  const handler = handlers[actionKey];
  if (!handler) {
    console.error("tool:", tool, "does not implement undo action:", actionKey);
  }
  const result = handler(action, ctx);
  if (ctx.shouldKeepHistory) {
    ctx.undoStack.push(result);
  }
}

function handleBatchAction(ctx: ReactDrawContext, action: ActionObject) {
  const data = action.data as ActionObject[];
  const result = [];
  for (const obj of data) {
    const toolId = obj.toolId;
    const tool = getToolById(ctx.drawingTools, toolId);
    const handlers = tool.redoHandlers;
    const actionKey = obj.action;
    if (!handlers) {
      console.error("tool:", tool, "does not implement undo functionality");
      return;
    }
    const handler = handlers[actionKey];
    if (!handler) {
      console.error("tool:", tool, "does not implement action:", actionKey);
      return;
    }
    result.push(handler(obj, ctx));
  }
  action.data = result;
  if (ctx.shouldKeepHistory) {
    ctx.undoStack.push(action);
  }
}
