import {
  ActionObject,
  DrawingData,
  ToolPropertiesMap,
  ToolStylesMap,
} from "../../types";

export function updateSvgPathStroke(
  data: DrawingData,
  value: string
): ActionObject {
  const svg = data.element;
  if (!svg) {
    throw new Error();
  }
  let path = svg.querySelector("path");
  if (!path) {
    path = svg.querySelector("line");
  }
  if (!path) {
    throw new Error();
  }
  const currColor = data.style.color;
  path.style.stroke = value;
  data.style.color = value;
  return {
    objectId: data.container.id,
    action: "color",
    toolId: data.toolId,
    toolType: "top-bar-tool",
    data: currColor,
  };
}

export function updateEleBorderColor(
  data: DrawingData,
  value: string
): ActionObject {
  const ele = data.element;
  if (!ele) {
    throw new Error();
  }
  const currColor = data.style.color;
  data.style.color = value;
  ele.style.border = borderFromStyles(data.style);
  return {
    objectId: data.container.id,
    action: "color",
    toolId: data.toolId,
    toolType: "top-bar-tool",
    data: currColor,
  };
}

export function borderFromStyles(styles: ToolPropertiesMap): string {
  return `${styles.lineWidth}px solid ${styles.color}`;
}
