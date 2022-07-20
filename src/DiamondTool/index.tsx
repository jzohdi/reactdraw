import { DiamondBoldIcon } from "@jzohdi/jsx-icons";
import React from "react";
import { DIAMOND_TOOL_ID } from "../constants";
import {
  DrawingData,
  DrawingTools,
  RectBounds,
  ToolPropertiesMap,
} from "../types";
import { scaleSvg, setContainerRect } from "../utils";
import { createPathSvg, createSvg } from "../utils/svgUtils";
import { redoDelete, saveCreateToUndoStack, undoCreate } from "../utils/undo";
import { updateSvgPathStroke } from "../utils/updateStyles/color";

const diamondTool: DrawingTools = {
  id: DIAMOND_TOOL_ID,
  tooltip: "Diamond tool",
  icon: <DiamondBoldIcon />,
  getEditableStyles() {
    return ["color", "background", "lineWidth"];
  },
  onDrawStart: (data) => {
    const div = data.container.div;
    const newSvg = makeDiamondSvg(data);
    div.appendChild(newSvg);
  },
  onDrawing: (data) => {
    setContainerRect(data);
    const div = data.container.div;
    const newSvg = makeDiamondSvg(data);
    div.innerHTML = "";
    div.appendChild(newSvg);
    data.element = newSvg;
    data.coords.splice(1);
  },
  onDrawEnd(data, ctx) {
    saveCreateToUndoStack(data, ctx);
    if (ctx.shouldSelectAfterCreate) {
      ctx.selectObject(data);
    }
  },
  onResize(data, ctx) {
    scaleSvg(data.element as SVGSVGElement, data.container.bounds);
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
    console.error("Unsupported action: ", action);
    throw new Error();
  },
  onUpdateStyle(data, ctx, key, value) {
    if (key === "color") {
      return updateSvgPathStroke(data, value);
    }
    console.log(key, value, data);
    throw new Error("unknown update style action");
  },
};

export default diamondTool;

function makeDiamondSvg(data: DrawingData): SVGSVGElement {
  const lineWidth = parseInt(data.style.lineWidth);
  const { bounds } = data.container;
  // const width = bounds
  const width = bounds.right - bounds.left;
  const height = bounds.bottom - bounds.top;
  const newSvg = createSvg(width + lineWidth, height + lineWidth);
  const path = drawDiamondInBounds(bounds, data.style);
  newSvg.appendChild(path);
  return newSvg;
}

function drawDiamondInBounds(
  bounds: RectBounds,
  style: ToolPropertiesMap
): SVGPathElement {
  const newPath = createPathSvg(style);
  const lineWidth = parseInt(style.lineWidth);
  newPath.setAttribute("d", getPathDiamondString(bounds, lineWidth));
  return newPath;
}

function getPathDiamondString(bounds: RectBounds, lineWidth: number): string {
  const height = bounds.bottom - bounds.top;
  const width = bounds.right - bounds.left;
  // left corner -> top -> right -> bottom -> left
  const leftCorner = `${lineWidth / 2} ${height / 2}`;
  const topCorner = `L ${width / 2} ${lineWidth / 2}`;
  const rightCorner = `L ${width - lineWidth / 2} ${height / 2}`;
  const bottomCorner = `L ${width / 2} ${height - lineWidth / 2}`;
  return `M ${leftCorner} ${topCorner} ${rightCorner} ${bottomCorner} L ${leftCorner}`;
}
