import { getBoxSize, makeNewDiv } from ".";
import {
  CUSTOM_DATA_ORIENT_KEY,
  CUSTOM_DATA_ORIGINAL_BOUNDS,
} from "../constants";
import { makeArrowSvg } from "../TopBarTools/ArrowTool";
import { makeCircleDiv } from "../TopBarTools/CircleTool";
import { makeDiamondSvg } from "../TopBarTools/DiamondTool";
import { svgPathFromData } from "../TopBarTools/FreeDrawTool";
import { setDivToBounds } from "../TopBarTools/SelectTool/undo";
import { makeSquareDiv } from "../TopBarTools/SquareTool";
import { makeLineInOrientation } from "../TopBarTools/StraightLineTool";
import { setupTextAreaDiv } from "../TopBarTools/TextAreaTool";
import {
  ContainerState,
  DeserializerFunction,
  Deserializers,
  DrawingData,
  IntermediateStringableObject,
  Point,
  ReactDrawContext,
  SerializerFunction,
  Serializers,
  ToolPropertiesMap,
} from "../types";
import { getScaleFromSvg } from "./readStyles";
import { getRotateFromDiv } from "./select/getRotateFromDiv";
import { createSvg } from "./svgUtils";
import { addObject } from "./utils";

/**
 * Using each serializer which is mapped to the correct DrawingData object
 * by "toolId" property, add each resulting serialized object to an array
 * and return the result of JSON.stringify(array). Each resulting object
 * should also have "toolId" property so that it can be properly mapped
 * to the later deserializer function.
 * @param serializers
 * @param ctx
 * @returns
 */
export function serializeObjects(
  serializers: Serializers,
  ctx: ReactDrawContext
): string {
  const serializedObjects: IntermediateStringableObject[] = [];
  for (const drawingObject of ctx.objectsMap.values()) {
    const toolId = drawingObject.toolId;
    const serializerFunc = serializers[toolId];
    if (serializerFunc === undefined) {
      return toolNotFoundError(drawingObject, serializers);
    }
    serializedObjects.push(serializerFunc(drawingObject));
  }
  return JSON.stringify(serializedObjects);
}

export const serializeArrow: SerializerFunction = (obj: DrawingData) => {
  const { containerState, customData } = serializeSvgSetup(obj);
  const objectCopy = { ...obj, containerDiv: containerState, customData };
  return objectCopy;
};

export const serializeCircle: SerializerFunction = (obj: DrawingData) => {
  const containerState = getContainerState(obj);
  const customData = serializeCustomData(obj);
  const objectCopy = { ...obj, containerDiv: containerState, customData };
  return objectCopy;
};

export const serializeDiamond: SerializerFunction = (obj: DrawingData) => {
  const { containerState, customData } = serializeSvgSetup(obj);
  const objectCopy = { ...obj, containerDiv: containerState, customData };
  return objectCopy;
};

function getContainerState(obj: DrawingData): ContainerState {
  const state: ContainerState = {
    rotation: getRotateFromDiv(obj.containerDiv),
    bbox: getBoxSize(obj),
    scale: null,
    other: {},
  };
  return state;
}

export type JsonAny = {
  [key: string]: any;
};

export type SerializedFreeDraw = {
  toolId: string;
  id: string;
  coords: Point[];
  style: ToolPropertiesMap;
  containerDiv: ContainerState;
  element: {};
  customData: JsonAny;
};

export function serializeSvgSetup(obj: DrawingData) {
  const containerState = getContainerState(obj);
  containerState.scale = getScaleFromSvg(obj);
  containerState.other["viewbox"] = obj.element?.getAttribute("viewbox");
  const customData = serializeCustomData(obj);
  return { containerState, customData };
}

export function serializeDomSetup(obj: DrawingData) {
  const containerState = getContainerState(obj);
  const customData = serializeCustomData(obj);
  return { containerState, customData };
}

export const serializeFreeDraw: SerializerFunction = (obj: DrawingData) => {
  const { containerState, customData } = serializeSvgSetup(obj);
  const objectCopy = { ...obj, containerDiv: containerState, customData };
  return objectCopy;
};

export const serializeCustomData = (obj: DrawingData): JsonAny => {
  const customData: JsonAny = {};
  for (const key of obj.customData.keys()) {
    customData[key] = obj.customData.get(key);
  }
  return customData;
};

export const serializeSquare: SerializerFunction = (obj: DrawingData) => {
  const { containerState, customData } = serializeDomSetup(obj);
  const objectCopy = { ...obj, containerDiv: containerState, customData };
  return objectCopy;
};

export const serializeLine: SerializerFunction = (obj: DrawingData) => {
  const { containerState, customData } = serializeSvgSetup(obj);
  const objectCopy = { ...obj, containerDiv: containerState, customData };
  return objectCopy;
};

export const serializeText: SerializerFunction = (obj: DrawingData) => {
  const { containerState, customData } = serializeDomSetup(obj);
  containerState.other["text"] = obj.containerDiv.innerText;
  const objectCopy = { ...obj, containerDiv: containerState, customData };
  return objectCopy;
};

/**
 * Expects that the data is in the form of a stringified array of serialized objects.
 * example "[serializedArrowObj, serialziedFreeDrawObj1, serializedFreeDrawObj2, etc..]"
 * Also expects each object to have a key "toolId" so that it can map the object to the
 * deserializer function that handles.
 *
 * Sometimes you may want to not automatically add the resulting DrawingData objects
 * to the canvas. Use the third optional arguement  "shouldAddToCanvas" for this case
 * (default true)
 *
 * @param stringifiedData
 * @param ctx
 */
export function deserializeData(
  stringifiedData: string,
  deserializers: Deserializers,
  ctx: ReactDrawContext,
  shouldAddToCanvas: boolean = true
): DrawingData[] {
  const toArray: IntermediateStringableObject[] = JSON.parse(stringifiedData);
  const results: DrawingData[] = [];
  for (const obj of toArray) {
    const deserializerFunction = deserializers[obj.toolId];
    if (deserializerFunction === undefined) {
      return toolNotFoundError(obj, deserializers);
    }
    const drawingDataObject = deserializerFunction(obj, ctx, shouldAddToCanvas);
    results.push(drawingDataObject);
  }
  return results;
}

function toolNotFoundError(object: any, serializers: any): any {
  throw new Error(
    "toolid not function in serializers. id: " +
      object.toolId +
      " .options: " +
      Object.keys(serializers) +
      " . object: " +
      JSON.stringify(object)
  );
}

export function deserializationSetup(obj: IntermediateStringableObject) {
  const freeDrawObj = obj as SerializedFreeDraw;
  const containerState = freeDrawObj.containerDiv;
  const customData = freeDrawObj.customData;
  const p = freeDrawObj.coords[0];
  const lineWidth = parseInt(freeDrawObj.style.lineWidth);
  const { id, div } = makeNewDiv(p[0], p[1], lineWidth, freeDrawObj.toolId);
  const drawingData: DrawingData = {
    toolId: freeDrawObj.toolId,
    id,
    style: freeDrawObj.style,
    customData: deserializeCustomData(customData),
    containerDiv: div,
    element: null,
    coords: freeDrawObj.coords,
  };
  return { drawingData, div, containerState };
}

function addToContainer(
  data: DrawingData,
  ele: HTMLElement | SVGSVGElement
): void {
  data.containerDiv.innerHTML = "";
  data.containerDiv.appendChild(ele);
  data.element = ele;
}

function applyRotation(
  ele: HTMLElement | SVGSVGElement,
  containerState: ContainerState
): void {
  ele.style.transform = `rotate(${containerState.rotation}deg)`;
}

export const deserializeFreeDraw: DeserializerFunction = (
  obj: IntermediateStringableObject,
  ctx: ReactDrawContext,
  shouldAddToCanvas: boolean = true
) => {
  const { drawingData, div, containerState } = deserializationSetup(obj);
  const originalBounds = drawingData.customData.get(
    CUSTOM_DATA_ORIGINAL_BOUNDS
  );
  const bbox = containerState.bbox;

  setDivToBounds(div, originalBounds);

  if (shouldAddToCanvas) {
    addObject(ctx, drawingData);
  }
  const newSvg = createSvg(
    originalBounds.width,
    originalBounds.height,
    drawingData.style.opacity
  );

  newSvg.setAttribute("viewbox", containerState.other["viewbox"]);
  newSvg.style.overflow = "visible";
  const newPath = svgPathFromData(drawingData, ctx.viewContainer);
  newPath.style.transform = `scale(${containerState.scale?.x}, ${containerState.scale?.y})`;
  newSvg.appendChild(newPath);
  addToContainer(drawingData, newSvg);
  applyRotation(newSvg, containerState);
  setDivToBounds(div, bbox);
  return drawingData;
};

export const deserializeSquare: DeserializerFunction = (
  intermedObj,
  ctx,
  shouldAddToCanvas
) => {
  const { drawingData, containerState, div } =
    deserializationSetup(intermedObj);
  const newSquare = makeSquareDiv(intermedObj.style);
  addToContainer(drawingData, newSquare);
  applyRotation(div, containerState);
  setDivToBounds(div, containerState.bbox);
  if (shouldAddToCanvas) {
    addObject(ctx, drawingData);
  }
  return drawingData;
};

export const deserializeCircle: DeserializerFunction = (
  obj,
  ctx,
  shouldAddToCanvas
) => {
  const { drawingData, containerState, div } = deserializationSetup(obj);
  setDivToBounds(div, containerState.bbox);
  const newCircle = makeCircleDiv(drawingData.style);
  addToContainer(drawingData, newCircle);
  applyRotation(div, containerState);
  if (shouldAddToCanvas) {
    addObject(ctx, drawingData);
  }
  return drawingData;
};

export const deserializeDiamond: DeserializerFunction = (
  obj,
  ctx,
  shouldAdd
) => {
  const { drawingData, div, containerState } = deserializationSetup(obj);
  const originalBounds = drawingData.customData.get(
    CUSTOM_DATA_ORIGINAL_BOUNDS
  );
  const bbox = containerState.bbox;

  setDivToBounds(div, originalBounds);
  if (shouldAdd) {
    addObject(ctx, drawingData);
  }
  const newSvg = makeDiamondSvg(drawingData);
  newSvg.setAttribute("viewbox", containerState.other["viewbox"]);
  newSvg.style.overflow = "visible";
  const innerPath = newSvg.getElementsByTagName("path")[0];
  if (innerPath) {
    innerPath.style.transform = `scale(${containerState.scale?.x}, ${containerState.scale?.y})`;
  }
  addToContainer(drawingData, newSvg);
  applyRotation(newSvg, containerState);
  setDivToBounds(div, bbox);
  return drawingData;
};

export const deserializeLine: DeserializerFunction = (obj, ctx, shouldAdd) => {
  const { drawingData, div, containerState } = deserializationSetup(obj);
  const orientation = drawingData.customData.get(CUSTOM_DATA_ORIENT_KEY);
  const bbox = containerState.bbox;
  setDivToBounds(div, bbox);
  if (shouldAdd) {
    addObject(ctx, drawingData);
  }
  const newSvg = makeLineInOrientation(drawingData, orientation);
  newSvg.setAttribute("viewbox", containerState.other["viewbox"]);
  newSvg.style.overflow = "visible";
  addToContainer(drawingData, newSvg);
  applyRotation(newSvg, containerState);
  return drawingData;
};

export const deserializeTextArea: DeserializerFunction = (
  obj,
  ctx,
  shouldAdd
) => {
  const { drawingData, containerState, div } = deserializationSetup(obj);
  setupTextAreaDiv(drawingData, ctx);
  div.innerHTML = containerState.other["text"];
  setDivToBounds(div, containerState.bbox);
  applyRotation(div, containerState);
  if (shouldAdd) {
    addObject(ctx, drawingData);
  }
  return drawingData;
};

export const deserializeArrow: DeserializerFunction = (obj, ctx, shouldAdd) => {
  const { drawingData, div, containerState } = deserializationSetup(obj);
  const orientation = drawingData.customData.get(CUSTOM_DATA_ORIENT_KEY);
  const bbox = containerState.bbox;
  setDivToBounds(div, bbox);
  if (shouldAdd) {
    addObject(ctx, drawingData);
  }
  const newSvg = makeArrowSvg(drawingData, orientation);
  newSvg.setAttribute("viewbox", containerState.other["viewbox"]);
  newSvg.style.overflow = "visible";
  addToContainer(drawingData, newSvg);
  applyRotation(newSvg, containerState);
  return drawingData;
};

function deserializeCustomData(customData: JsonAny): Map<string, any> {
  const data = new Map();
  for (const key in customData) {
    const value = customData[key];
    data.set(key, value);
  }
  return data;
}
