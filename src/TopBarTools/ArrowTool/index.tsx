import React from "react";
import { ArrowRightBoldIcon } from "@jzohdi/jsx-icons";
import { DrawingData, DrawingTools, Point } from "../../types";
import { ARROW_TOOL_ID } from "../../constants";
import { createCircle, createPathSvg, createSvg } from "../../utils/svgUtils";
import { getBoxSize, setContainerRect } from "../../utils";
import {
  redoDelete,
  saveCreateToUndoStack,
  undoCreate,
  undoEleOpacity,
  undoSvgPathColor,
  undoSvgPathWidth,
} from "../../utils/undo";
import {
  calcOrientation,
  getStartAndEndPoint,
  Orientation,
} from "../../utils/lines";
import { updateSvgPathStroke } from "../../utils/updateStyles/color";
import { updateSvgPathWidth } from "../../utils/updateStyles/linewidth";
import { updateEleOpacity } from "../../utils/updateStyles/opacity";

const ORIENT_KEY = "orientation";

const arrowTool: DrawingTools = {
  icon: <ArrowRightBoldIcon />,
  id: ARROW_TOOL_ID,
  tooltip: "Arrow Tool",
  onDrawStart: (data) => {
    const div = data.containerDiv;
    const lineWidth = parseInt(data.style.lineWidth);
    const newSvg = createSvg(lineWidth, lineWidth, data.style.opacity);
    const newPath = createCircle(lineWidth / 2, data.style.color);
    newSvg.appendChild(newPath);
    div.append(newSvg);
    data.element = newSvg;
  },
  onDrawing: (data, { viewContainer }) => {
    setContainerRect(data);
    const firstPoint = data.coords[0];
    const lastPoint = data.coords[data.coords.length - 1];
    const orientation = calcOrientation(firstPoint, lastPoint);
    data.customData.set(ORIENT_KEY, orientation);
    const newSvg = makeArrowSvg(data, orientation);
    const div = data.containerDiv;
    div.innerHTML = "";
    div.appendChild(newSvg);
    data.element = newSvg;
    data.coords.splice(1);
  },
  onDrawEnd: (data, ctx) => {
    if (ctx.shouldKeepHistory) {
      saveCreateToUndoStack(data, ctx);
    }
    if (ctx.shouldSelectAfterCreate) {
      ctx.selectObject(data);
    }
  },
  onResize(data, ctx) {
    const orientation = data.customData.get(ORIENT_KEY);
    if (!orientation) {
      throw new Error("orientation not set");
    }
    const newSvg = makeArrowSvg(data, orientation);
    const div = data.containerDiv;
    div.removeChild(data.element as SVGSVGElement);
    div.appendChild(newSvg);
    data.element = newSvg;
    data.coords.splice(1);
  },
  undoHandlers: {
    create: undoCreate,
    delete: redoDelete,
    color: undoSvgPathColor,
    lineWidth: undoSvgPathWidth,
    opacity: undoEleOpacity,
  },
  redoHandlers: {
    create: undoCreate,
    delete: redoDelete,
    color: undoSvgPathColor,
    lineWidth: undoSvgPathWidth,
    opacity: undoEleOpacity,
  },
  styleHandlers: {
    color: (data, value, _ctx) => updateSvgPathStroke(data, value),
    lineWidth: (data, value, _ctx) => updateSvgPathWidth(data, value),
    opacity: (data, value, _ctx) => updateEleOpacity(data, value),
  },
};

/**
 * <svg width="237" height="23" viewBox="0 0 237 23" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M236.028 13.0919C236.632 12.5239 236.66 11.5746 236.092 10.9715L226.836 1.14442C226.268 0.541381 225.318 0.512983 224.715 1.08099C224.112 1.649 224.084 2.59832 224.652 3.20136L232.88 11.9366L224.144 20.1643C223.541 20.7323 223.513 21.6817 224.081 22.2847C224.649 22.8877 225.598 22.9161 226.201 22.3481L236.028 13.0919ZM0.955148 6.49933L234.955 13.4993L235.045 10.5007L1.04485 3.50067L0.955148 6.49933Z" fill="black"/>
</svg>

 * 
 */

export default arrowTool;

function makeArrowSvg(
  data: DrawingData,
  orientation: Orientation
): SVGSVGElement {
  const lineWidth = parseInt(data.style.lineWidth);
  const { width, height } = getBoxSize(data);
  const [start, end] = getStartAndEndPoint(width, height, orientation);
  // const containerSvg = createSvg(width, )
  const newSvg = createSvg(
    width + lineWidth,
    height + lineWidth,
    data.style.opacity
  );
  newSvg.style.overflow = "visible";
  const arrowLine = makeArrowPath(data, start, end);
  newSvg.appendChild(arrowLine);
  return newSvg;
}

function makeArrowPath(data: DrawingData, pointA: Point, pointB: Point) {
  const [x1, y1] = pointA;
  const [x2, y2] = pointB;
  const arrow = createPathSvg(data.style);
  // do wing 1
  const D = [x1 - x2, y1 - y2];
  const [dx, dy] = D;
  const mag = Math.sqrt(dx * dx + dy * dy);
  const uD = [dx / mag, dy / mag];
  const [uDx, uDy] = uD;
  //   const [ax, ay, bx, by] = [0, 0, 0, 0];
  const axNormed = uDx * (Math.sqrt(3) / 2) - uDy * (1 / 2);
  const ayNormed = (uDx * 1) / 2 + uDy * (Math.sqrt(3) / 2);
  const bxNormed = uDx * (Math.sqrt(3) / 2) + uDy * (1 / 2);
  const byNormed = -uDx * (1 / 2) + uDy * (Math.sqrt(3) / 2);
  const lineLength = 20;
  const [ax, ay, bx, by] = [
    -axNormed * lineLength,
    -ayNormed * lineLength,
    -bxNormed * lineLength,
    -byNormed * lineLength,
  ];
  arrow.setAttribute(
    "d",
    `M ${x1} ${y1} L ${x2} ${y2} L ${x2 - ax} ${y2 - ay} L ${x2} ${y2} L ${
      x2 - bx
    } ${y2 - by}`
  );
  return arrow;
}
