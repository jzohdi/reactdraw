import React from "react";
import { SQUARE_TOOL_ID } from "../../constants";
import { DrawingTools, ToolPropertiesMap } from "../../types";
import { SquareBoldIcon } from "@jzohdi/jsx-icons";
import { setContainerRect } from "../../utils";
import {
  redoDelete,
  saveCreateToUndoStack,
  undoCreate,
  undoEleBackgroundColor,
  undoEleBorderColor,
  undoEleLineWidth,
  undoEleOpacity,
} from "../../utils/undo";
import {
  updateEleBackgroundColor,
  updateEleBorderColor,
} from "../../utils/updateStyles/color";
import { updateEleLineWidth } from "../../utils/updateStyles/linewidth";
import { updateEleOpacity } from "../../utils/updateStyles/opacity";

const squareTool: DrawingTools = {
  id: SQUARE_TOOL_ID,
  tooltip: "Square Tool",
  icon: <SquareBoldIcon />,
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
  undoHandlers: {
    create: undoCreate,
    delete: redoDelete,
    color: undoEleBorderColor,
    background: undoEleBackgroundColor,
    lineWidth: undoEleLineWidth,
    opacity: undoEleOpacity,
  },
  redoHandlers: {
    create: undoCreate,
    delete: redoDelete,
    color: undoEleBorderColor,
    background: undoEleBackgroundColor,
    lineWidth: undoEleLineWidth,
    opacity: undoEleOpacity,
  },
  onResize(data, ctx) {},
  styleHandlers: {
    color: updateEleBorderColor,
    background: updateEleBackgroundColor,
    lineWidth: updateEleLineWidth,
    opacity: updateEleOpacity,
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
  div.style.backgroundColor = style.background;
  div.style.opacity = style.opacity;
  return div;
}
