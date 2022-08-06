import { CircleBoldIcon } from "@jzohdi/jsx-icons";
import React from "react";
import { CIRCLE_TOOL_ID } from "../../constants";
import { DrawingTools, ToolPropertiesMap } from "../../types";
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
  borderFromStyles,
  updateEleBackgroundColor,
  updateEleBorderColor,
} from "../../utils/updateStyles/color";
import { updateEleLineWidth } from "../../utils/updateStyles/linewidth";
import { updateEleOpacity } from "../../utils/updateStyles/opacity";
const circlTool: DrawingTools = {
  id: CIRCLE_TOOL_ID,
  tooltip: "Circle tool",
  icon: <CircleBoldIcon />,
  onDrawStart: (data) => {
    const newSquare = makeCircleDiv(data.style);
    data.containerDiv.appendChild(newSquare);
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
  undoHandlers: {
    create: undoCreate,
    delete: redoDelete,
    color: undoEleBorderColor,
    background: undoEleBackgroundColor,
    lineWidth: undoEleLineWidth,
    opacity: undoEleOpacity,
  },
  redoHandlers: {
    delete: redoDelete,
    create: undoCreate,
    color: undoEleBorderColor,
    background: undoEleBackgroundColor,
    lineWidth: undoEleLineWidth,
    opacity: undoEleOpacity,
  },
  styleHandlers: {
    color: (data, value, _ctx) => updateEleBorderColor(data, value),
    background: (data, value, _ctx) => updateEleBackgroundColor(data, value),
    lineWidth: (data, value, _ctx) => updateEleLineWidth(data, value),
    opacity: (data, value, _ctx) => updateEleOpacity(data, value),
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
  newDiv.style.opacity = styles.opacity;
  return newDiv;
}
