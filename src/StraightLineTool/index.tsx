import React from "react";
import { STRAIGHT_LINE_TOOL_ID } from "../constants";
import { DrawingData, DrawingTools, Point } from "../types";
import { setContainerRect } from "../utils";
import { drawLineFromStartToEnd } from "../utils/onDrawingUtils";
import { createCircle, createLineSvg, createSvg } from "../utils/svgUtils";
import { HorizontalLineIcon } from "@jzohdi/jsx-icons";
import {
  redoDelete,
  saveCreateToUndoStack,
  undoCreate,
  undoEleOpacity,
  undoSvgPathColor,
  undoSvgPathWidth,
} from "../utils/undo";
import { updateSvgPathStroke } from "../utils/updateStyles/color";
import { updateSvgPathWidth } from "../utils/updateStyles/linewidth";
import { updateEleOpacity } from "../utils/updateStyles/opacity";
import {
  calcOrientation,
  getStartAndEndPoint,
  Orientation,
} from "../utils/lines";

const ORIENT_KEY = "orientation";

const straightLineTool: DrawingTools = {
  id: STRAIGHT_LINE_TOOL_ID,
  tooltip: "Straight Line Tool",
  icon: <HorizontalLineIcon />,
  getEditableStyles() {
    return ["color", "lineWidth", "opacity"];
  },
  onDrawStart: (data) => {
    const div = data.container.div;
    const lineWidth = parseInt(data.style.lineWidth);
    const newSvg = createSvg(lineWidth, lineWidth, data.style.opacity);
    const newPath = createCircle(lineWidth / 2, data.style.color);
    newSvg.appendChild(newPath);
    div.append(newSvg);
    data.element = newSvg;
  },
  onDrawing: (data, viewContainer) => {
    setContainerRect(data);
    const firstPoint = data.coords[0];
    const lastPoint = data.coords[data.coords.length - 1];
    const orientation = calcOrientation(firstPoint, lastPoint);
    data.customData.set(ORIENT_KEY, orientation);
    const newSvg = makeLineInOrientation(data, orientation);
    const div = data.container.div;
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
    const orientation = data.customData.get(ORIENT_KEY);
    if (!orientation) {
      throw new Error("orientation not set");
    }
    const newSvg = makeLineInOrientation(data, orientation);
    const div = data.container.div;
    div.removeChild(data.element as SVGSVGElement);
    div.appendChild(newSvg);
    data.element = newSvg;
    data.coords.splice(1);
  },
  onUndo(action, ctx) {
    if (action.action === "create") {
      return undoCreate(action, ctx);
    }
    if (action.action === "color") {
      return undoSvgPathColor(action, ctx);
    }
    if (action.action === "lineWidth") {
      return undoSvgPathWidth(action, ctx);
    }
    if (action.action === "opacity") {
      return undoEleOpacity(action, ctx);
    }
    console.error("Unsupported action: ", action);
    throw new Error();
  },
  onRedo(action, ctx) {
    if (action.action === "delete") {
      return redoDelete(action, ctx);
    }
    if (action.action === "color") {
      return undoSvgPathColor(action, ctx);
    }
    if (action.action === "lineWidth") {
      return undoSvgPathWidth(action, ctx);
    }
    if (action.action === "opacity") {
      return undoEleOpacity(action, ctx);
    }
    console.error("unsupported action:", action);
    throw new Error();
  },
  onUpdateStyle(data, ctx, key, value) {
    if (key === "color") {
      return updateSvgPathStroke(data, value);
    }
    if (key === "lineWidth") {
      return updateSvgPathWidth(data, value);
    }
    if (key === "opacity") {
      return updateEleOpacity(data, value);
    }
    console.log(key, value, data);
    throw new Error("unknown update style action");
  },
};

export default straightLineTool;

function makeLineInOrientation(
  data: DrawingData,
  orientation: Orientation
): SVGSVGElement {
  const { bounds } = data.container;
  const width = bounds.right - bounds.left;
  const height = bounds.bottom - bounds.top;
  const newSvg = createSvg(width, height, data.style.opacity);
  newSvg.style.overflow = "visible";
  const [start, end] = getStartAndEndPoint(width, height, orientation);
  const lineSvg = createLineSvg(data.style);
  lineSvg.setAttribute("x1", start[0].toString());
  lineSvg.setAttribute("y1", start[1].toString());
  lineSvg.setAttribute("x2", end[0].toString());
  lineSvg.setAttribute("y2", end[1].toString());
  newSvg.appendChild(lineSvg);
  return newSvg;
}
