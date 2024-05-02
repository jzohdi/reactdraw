import { DrawingData } from "../types";
import { getInnerEleFromSvg } from "./updateStyles/utils";

const scaleRegex = /\d+\.*\d*/g;

export function getScaleFromSvg(data: DrawingData) {
  const svgEle = getInnerEleFromSvg(data);
  const scale = svgEle.style.transform.match(scaleRegex);
  if (!scale) {
    // if scale is not set, this is basically having scale of 1
    return { x: "1", y: "1" };
  }
  return { x: scale[0], y: scale[1] };
}

export function getZindexFromDiv(div: HTMLDivElement) {
  return div.style.zIndex === undefined ? 0 : parseInt(div.style.zIndex);
}
