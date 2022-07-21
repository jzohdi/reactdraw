import React from "react";
import { SQUARE_TOOL_ID } from "../constants";
import { DrawingTools, ToolPropertiesMap } from "../types";
import { SquareBoldIcon } from "@jzohdi/jsx-icons";
import { setContainerRect } from "../utils";
import {
  redoDelete,
  saveCreateToUndoStack,
  undoCreate,
  undoEleBackgroundColor,
  undoEleBorderColor,
} from "../utils/undo";
import {
  updateEleBackgroundColor,
  updateEleBorderColor,
} from "../utils/updateStyles/color";

const squareTool: DrawingTools = {
  id: SQUARE_TOOL_ID,
  tooltip: "Square Tool",
  icon: <SquareBoldIcon />,
  getEditableStyles() {
    return ["color", "background", "lineWidth"];
  },
  onDrawStart: (data) => {
    const newSquare = makeSquareDiv(data.style);
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
  onResize(data, ctx) {},
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

export default squareTool;

function makeSquareDiv(style: ToolPropertiesMap): HTMLDivElement {
  const div = document.createElement("div");
  div.style.width = "100%";
  div.style.height = "100%";
  div.style.border = `${style.lineWidth}px solid ${style.color}`;
  div.style.borderRadius = "2px";
  div.style.boxSizing = "border-box";
  return div;
}
