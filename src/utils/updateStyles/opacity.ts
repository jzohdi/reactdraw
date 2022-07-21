import { ActionObject, DrawingData } from "../../types";
import { actionObjToSave } from "./utils";

const opacityRegex = /^(0(\.\d+)?|1(\.0+)?)$/;

export function updateEleOpacity(
  data: DrawingData,
  value: string
): ActionObject | undefined {
  if (!value.match(opacityRegex)) {
    return undefined;
  }
  const ele = data.element;
  if (!ele) {
    throw new Error();
  }
  const curr = data.style.opacity;
  data.style.opacity = value;
  ele.style.opacity = value;
  return actionObjToSave(data, "opacity", curr);
}
