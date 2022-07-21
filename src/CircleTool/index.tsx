import { CircleBoldIcon } from "@jzohdi/jsx-icons";
import React from "react";
import { CIRCLE_TOOL_ID } from "../constants";
import { DrawingTools, ToolPropertiesMap } from "../types";
import { setContainerRect } from "../utils";
import {
  redoDelete,
  saveCreateToUndoStack,
  undoCreate,
  undoEleBackgroundColor,
  undoEleBorderColor,
} from "../utils/undo";
import {
  borderFromStyles,
  updateEleBackgroundColor,
  updateEleBorderColor,
} from "../utils/updateStyles/color";
const circlTool: DrawingTools = {
  id: CIRCLE_TOOL_ID,
  tooltip: "Circle tool",
  icon: <CircleBoldIcon />,
  getEditableStyles() {
    return ["color", "background", "lineWidth"];
  },
  onDrawStart: (data) => {
    const newSquare = makeCircleDiv(data.style);
    data.container.div.appendChild(newSquare);
    data.element = newSquare;
  },
  onDrawing: (data) => {
    setContainerRect(data);
    data.coords.splice(1);
  },
  onDrawEnd(data, ctx) {
    saveCreateToUndoStack(data, ctx);
    if (ctx.shouldSelectAfterCreate) {
      ctx.selectObject(data);
    }
  },
  onResize(data, ctx) {},
  onUndo(action, ctx) {
    if (action.action === "create") {
      return undoCreate(action, ctx);
    }
    if (action.action === "color") {
      return undoEleBorderColor(action, ctx);
    }
    if (action.action === "background") {
      return undoEleBackgroundColor(action, ctx);
    }
    console.error("Unsupported action: ", action);
    throw new Error();
  },
  onRedo(action, ctx) {
    if (action.action === "delete") {
      return redoDelete(action, ctx);
    }
    if (action.action === "color") {
      return undoEleBorderColor(action, ctx);
    }
    if (action.action === "background") {
      return undoEleBackgroundColor(action, ctx);
    }
    console.error("unsupported action:", action);
    throw new Error();
  },
  onUpdateStyle(data, ctx, key, value) {
    if (key === "color") {
      return updateEleBorderColor(data, value);
    }
    if (key === "background") {
      return updateEleBackgroundColor(data, value);
    }
    console.log(key, value, data);
    throw new Error("unknown update style action");
  },
};

export default circlTool;

function makeCircleDiv(styles: ToolPropertiesMap): HTMLDivElement {
  const newDiv = document.createElement("div");
  newDiv.style.width = "100%";
  newDiv.style.height = "100%";
  newDiv.style.border = borderFromStyles(styles);
  newDiv.style.backgroundColor = styles.background;
  newDiv.style.borderRadius = "50%";
  newDiv.style.boxSizing = "border-box";
  return newDiv;
}
