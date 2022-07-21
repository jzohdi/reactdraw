import { ActionObject, DrawingData } from "../../types";

export function actionObjToSave(
  data: DrawingData,
  action: string,
  saveValue: string
): ActionObject {
  const obj: ActionObject = {
    objectId: data.container.id,
    toolId: data.toolId,
    toolType: "top-bar-tool",
    action: action,
    data: saveValue,
  };
  return obj;
}

export function getInnerEleFromSvg(data: DrawingData) {
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
  return path;
}
