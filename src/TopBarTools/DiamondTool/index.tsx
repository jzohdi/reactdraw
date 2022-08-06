import { DiamondBoldIcon } from "@jzohdi/jsx-icons";
import React from "react";
import { DIAMOND_TOOL_ID } from "../../constants";
import {
  DrawingData,
  DrawingTools,
  RectBounds,
  ToolPropertiesMap,
} from "../../types";
import { getBoxSize, scaleSvg, setContainerRect } from "../../utils";
import { createPathSvg, createSvg } from "../../utils/svgUtils";
import {
  redoDelete,
  saveCreateToUndoStack,
  undoCreate,
  undoEleOpacity,
  undoSvgPathColor,
  undoSvgPathFill,
  undoSvgPathWidth,
} from "../../utils/undo";
import {
  updateSvgPathFill,
  updateSvgPathStroke,
} from "../../utils/updateStyles/color";
import { updateSvgPathWidth } from "../../utils/updateStyles/linewidth";
import { updateEleOpacity } from "../../utils/updateStyles/opacity";

const diamondTool: DrawingTools = {
  id: DIAMOND_TOOL_ID,
  tooltip: "Diamond tool",
  icon: <DiamondBoldIcon />,
  onDrawStart: (data) => {
    const div = data.containerDiv;
    const newSvg = makeDiamondSvg(data);
    div.appendChild(newSvg);
  },
  onDrawing: (data) => {
    setContainerRect(data);
    const div = data.containerDiv;
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
    scaleSvg(data.element as SVGSVGElement, getBoxSize(data));
  },
  undoHandlers: {
    create: undoCreate,
    delete: redoDelete,
    color: undoSvgPathColor,
    background: undoSvgPathFill,
    lineWidth: undoSvgPathWidth,
    opacity: undoEleOpacity,
  },
  redoHandlers: {
    create: undoCreate,
    delete: redoDelete,
    color: undoSvgPathColor,
    background: undoSvgPathFill,
    lineWidth: undoSvgPathWidth,
    opacity: undoEleOpacity,
  },
  styleHandlers: {
    color: updateSvgPathStroke,
    background: updateSvgPathFill,
    lineWidth: updateSvgPathWidth,
    opacity: updateEleOpacity,
  },
};

export default diamondTool;

function makeDiamondSvg(data: DrawingData): SVGSVGElement {
  const lineWidth = parseInt(data.style.lineWidth);
  const bounds = getBoxSize(data);
  const { width, height } = bounds;

  const newSvg = createSvg(
    width + lineWidth,
    height + lineWidth,
    data.style.opacity
  );
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
