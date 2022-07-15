import React from "react";
import { SQUARE_TOOL_ID } from "../constants";
import { DrawingTools } from "../types";
import { SquareBoldIcon } from "@jzohdi/jsx-icons";
import { setContainerRect } from "../utils";
import { redoDelete, saveCreateToUndoStack, undoCreate } from "../utils/undo";

const squareTool: DrawingTools = {
  id: SQUARE_TOOL_ID,
  icon: <SquareBoldIcon />,
  onDrawStart: (data) => {
    const lineWidth = data.style.lineWidth;
    const newSquare = makeSquareDiv(lineWidth);
    data.container.div.appendChild(newSquare);
    data.element = newSquare;
  },
  onDrawing: (data) => {
    setContainerRect(data);
    data.coords.splice(1);
  },
  onDrawEnd(data, ctx) {
    saveCreateToUndoStack(data, ctx);
  },
  onUndo(action, ctx) {
    if (action.action === "create") {
      return undoCreate(action, ctx);
    }
    console.error("Unsupported action: ", action);
    throw new Error();
  },
  onRedo(action, ctx) {
    if (action.action === "delete") {
      return redoDelete(action, ctx);
    }
    console.error("unsupported action:", action);
    throw new Error();
  },
  onResize(data, ctx) {},
};

export default squareTool;

function makeSquareDiv(lineWidth: number): HTMLDivElement {
  const div = document.createElement("div");
  div.style.width = "100%";
  div.style.height = "100%";
  div.style.border = `${lineWidth}px solid black`;
  div.style.borderRadius = "2px";
  return div;
}
