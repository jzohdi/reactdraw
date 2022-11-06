import { getBoxSize, makeNewDiv } from ".";
import { FREE_DRAW_ORIGINAL_BOUNDS } from "../constants";
import { svgPathFromData } from "../TopBarTools/FreeDrawTool";
import { setDivToBounds } from "../TopBarTools/SelectTool/undo";
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
  return obj;
};

export const serializeCircle: SerializerFunction = (obj: DrawingData) => {
  return obj;
};

export const serializeDiamond: SerializerFunction = (obj: DrawingData) => {
  return obj;
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

export const serializeFreeDraw: SerializerFunction = (obj: DrawingData) => {
  const containerState = getContainerState(obj);
  containerState.scale = getScaleFromSvg(obj);
  // console.log("obj custom data", obj.customData);
  containerState.other["viewbox"] = obj.element?.getAttribute("viewbox");
  const customData = serializeCustomData(obj);
  // console.log("custom data", customData);
  const objectCopy = { ...obj, containerDiv: containerState, customData };
  // console.log({ ...objectCopy, coords: undefined });
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
  return obj;
};

export const serializeLine: SerializerFunction = (obj: DrawingData) => {
  return obj;
};

export const serializeText: SerializerFunction = (obj: DrawingData) => {
  return obj;
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

export const deserializeFreeDraw: DeserializerFunction = (
  obj: IntermediateStringableObject,
  ctx: ReactDrawContext,
  shouldAddToCanvas: boolean = true
) => {
  const freeDrawObj = obj as SerializedFreeDraw;
  const containerState = freeDrawObj.containerDiv;
  const customData = freeDrawObj.customData;
  const originalBounds = customData[FREE_DRAW_ORIGINAL_BOUNDS];

  const p = freeDrawObj.coords[0];
  const bbox = containerState.bbox;
  const lineWidth = parseInt(freeDrawObj.style.lineWidth);
  const { id, div } = makeNewDiv(p[0], p[1], lineWidth, freeDrawObj.toolId);
  const newDrwingData: DrawingData = {
    toolId: freeDrawObj.toolId,
    id,
    style: freeDrawObj.style,
    customData: deserializeCustomData(customData),
    containerDiv: div,
    element: null,
    coords: freeDrawObj.coords,
  };
  setDivToBounds(div, originalBounds);
	
  if (shouldAddToCanvas) {
    addObject(ctx, newDrwingData);
  }
  const newSvg = createSvg(
    originalBounds.width,
    originalBounds.height,
    freeDrawObj.style.opacity
  );

  newSvg.setAttribute("viewbox", containerState.other["viewbox"]);
  newSvg.style.overflow = "visible";
  newDrwingData.containerDiv.innerHTML = "";
  const newPath = svgPathFromData(newDrwingData, ctx.viewContainer);
  div.style.transform = `rotate(${containerState.rotation}deg)`;
  newPath.style.transform = `scale(${containerState.scale?.x}, ${containerState.scale?.y})`;
  newSvg.appendChild(newPath);
  newDrwingData.containerDiv.appendChild(newSvg);
  newDrwingData.element = newSvg;
  setDivToBounds(div, bbox);
  return newDrwingData;
};

function deserializeCustomData(customData: JsonAny): Map<string, any> {
  const data = new Map();
  for (const key in customData) {
    const value = customData[key];
    data.set(key, value);
  }
  return data;
}
