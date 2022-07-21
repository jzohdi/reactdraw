import { ActionObject, DrawingData } from "../../types";
import { borderFromStyles } from "./color";
import { actionObjToSave, getInnerEleFromSvg } from "./utils";

const lineWidthRegex = /^[0-9]+$/g;

export function updateEleLineWidth(
  data: DrawingData,
  value: string
): ActionObject | undefined {
  const ele = data.element;
  if (!ele) {
    throw new Error();
  }
  if (!value.match(lineWidthRegex)) {
    return undefined;
  }
  const curr = data.style.lineWidth;
  data.style.lineWidth = value;
  ele.style.border = borderFromStyles(data.style);
  const action = actionObjToSave(data, "lineWidth", curr);
  return action;
}

export function updateSvgPathWidth(
  data: DrawingData,
  value: string
): ActionObject | undefined {
  const valuePx = value.includes("px") ? value : value + "px";
  const path = getInnerEleFromSvg(data);
  const dataKey = "lineWidth";
  const currColor = data.style[dataKey];
  path.style.strokeWidth = valuePx;
  data.style[dataKey] = value;
  return actionObjToSave(data, dataKey as string, currColor);
}
