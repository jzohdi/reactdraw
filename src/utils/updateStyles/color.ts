import { ActionObject, DrawingData, ToolPropertiesMap } from "../../types";
import { actionObjToSave, getInnerEleFromSvg } from "./utils";

const colorRegex = /^(#([0-9A-F]{3}){1,2}|transparent)$/i;

function updateSvgStyle(
  data: DrawingData,
  dataKey: keyof ToolPropertiesMap,
  svgKey: string,
  value: string
) {
  if (!value.match(colorRegex)) {
    return undefined;
  }
  const path = getInnerEleFromSvg(data);
  const currColor = data.style[dataKey];
  (<any>path.style)[svgKey] = value;
  //   console.log(path, svgKey, value);
  data.style[dataKey] = value;
  return actionObjToSave(data, dataKey as string, currColor);
}

export function updateSvgPathStroke(
  data: DrawingData,
  value: string
): ActionObject | undefined {
  return updateSvgStyle(data, "color", "stroke", value);
}

export function updateSvgPathFill(
  data: DrawingData,
  value: string
): ActionObject | undefined {
  return updateSvgStyle(data, "background", "fill", value);
}
export function updateEleBackgroundColor(
  data: DrawingData,
  value: string
): ActionObject | undefined {
  const { ele, action } = updateEleStyle(data, value, "background");
  if (!action) {
    return action;
  }
  ele.style.backgroundColor = value;
  return action;
}

function updateEleStyle(data: DrawingData, value: string, key: string) {
  const ele = data.element;
  if (!ele) {
    throw new Error();
  }
  if (!value.match(colorRegex)) {
    return { ele, action: undefined };
  }
  const currColor = data.style[key];
  data.style[key] = value;
  const action = actionObjToSave(data, key, currColor);
  return {
    ele,
    action,
  };
}

export function updateEleBorderColor(
  data: DrawingData,
  value: string
): ActionObject | undefined {
  const { ele, action } = updateEleStyle(data, value, "color");
  if (!action) {
    return action;
  }
  ele.style.border = borderFromStyles(data.style);
  return action;
}

export function borderFromStyles(styles: ToolPropertiesMap): string {
  return `${styles.lineWidth}px solid ${styles.color}`;
}

export function updateTextColor(
  data: DrawingData,
  value: string
): ActionObject | undefined {
  return updateTextStyle(data, "color", "color", value);
}

export function updateTextBackgroundColor(data: DrawingData, value: string) {
  return updateTextStyle(data, "background", "backgroundColor", value);
}

function updateTextStyle(
  data: DrawingData,
  dataKey: keyof ToolPropertiesMap,
  divKey: string,
  value: string
) {
  if (!value.match(colorRegex)) {
    return undefined;
  }
  const currColor = data.style[dataKey];
  data.style[dataKey] = value;
  (<any>data.container.div.style)[divKey] = value;
  return actionObjToSave(data, dataKey as string, currColor);
}
