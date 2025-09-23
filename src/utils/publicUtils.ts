/**

	This file contains util functions that are useful only for
	user and are not used inside of react draw components.

*/

import { setContainerRect } from "./index";
import { makeCircleDiv } from "../TopBarTools/CircleTool";
import {
  DrawingData,
  Point,
  ReactDrawContext,
  ToolPropertiesMap,
} from "../types";
import {
  addObject,
  createNewObject,
  deleteObjectAndNotify,
  getToolById,
  getViewCenterPoint,
} from "./utils";
import { SELECT_TOOL_ID } from "../constants";
import { getSelectedDrawingObjects } from "./select/getSelectedDrawingObjects";
import {
  getSelectedIdsFromFullState,
  notifyTool,
  selectElement,
  selectManyElements,
  unselectAll,
} from "./select/utils";
import { deletedSelected } from "../TopBarTools/SelectTool";
import textAreaTool, {
  addCaptureHandler,
  placeCaretAtEnd,
  setupTextAreaDiv,
} from "../TopBarTools/TextAreaTool";
import { setContainerStyles } from "./updateStyles/utils";
export { deletedSelected };
export { getToolById } from "./utils";
// re-exports
export {
  notifyTool,
  selectElement,
  selectManyElements,
  unselectAll,
} from "./select/utils";
export { makeNewDiv, setContainerRect } from "./index";
export {
  addObject,
  centerObject,
  createNewObject,
  getViewCenterPoint,
} from "./utils";
export { unselectElement } from "./select/unselectElement";

export type CreateTextOptions = {
  toolId: string;
  text: string;
  viewLocation?: Point;
  editable?: boolean;
  useTextToolDefaults?: boolean;
};

/**
 * options:
 * <ul>
 * 	<li>toolId: the id for the tool that owns this object. needs to map to a top-bar-tool</li>
 * 	<li>text: the data to add to screen</li>
 * 	<li>viewLocation (optional): where to instantiate the text. if not given, will create at center</li>
 * <li>useTextToolDefaults (optional): if true, will setup the text as if created by the react draw textAreaTool</li>
 * </ul>
 * @param ctx
 * @param options
 */
export function createText(
  ctx: ReactDrawContext,
  options: CreateTextOptions,
): DrawingData {
  const { toolId, text, viewLocation, editable, useTextToolDefaults } = options;
  const location = viewLocation ?? getViewCenterPoint(ctx);
  const newDrawingData = createNewObject(ctx, location, toolId);
  if (useTextToolDefaults) {
    const textCursor = setupTextAreaDiv(newDrawingData, ctx);
    textCursor.innerHTML = text;
    addObject(ctx, newDrawingData);
    placeCaretAtEnd(textCursor);
    return newDrawingData;
  }
  const textWrapper = document.createElement("div");
  textWrapper.style.width = "fit-content";
  textWrapper.innerText = text;
  const containerDiv = newDrawingData.containerDiv;
  containerDiv.appendChild(textWrapper);
  newDrawingData.element = textWrapper;
  addObject(ctx, newDrawingData);
  const boundOfText = textWrapper.getBoundingClientRect();
  containerDiv.style.width = boundOfText.width + "px";
  containerDiv.style.height = boundOfText.height + "px";
  containerDiv.style.display = "flex";
  containerDiv.style.justifyContent = "center";
  containerDiv.style.alignItems = "center";
  setContainerStyles(newDrawingData);
  if (!editable) {
    textWrapper.contentEditable = "false";
    return newDrawingData;
  }
  textWrapper.setAttribute("tabindex", "1");
  textWrapper.contentEditable = "true";
  if (toolId === textAreaTool.id) {
    addCaptureHandler(newDrawingData, ctx);
  }
  return newDrawingData;
}

/**
 * @param ctx
 * @param id the id of the object
 */
export function deleteObject(ctx: ReactDrawContext, id: string) {
  deleteObjectAndNotify(id, ctx);
}

/**
 * Works by first selecting all objects and then calling
 * deleteSelected.
 */
export function deleteAll(ctx: ReactDrawContext) {
  selectAll(ctx);
  deletedSelected(ctx);
}

export function updateSelectedObjectsStyle(
  ctx: ReactDrawContext,
  key: keyof ToolPropertiesMap,
  value: string,
) {
  const selectedObjects = getSelectedObjects(ctx);
  for (const object of selectedObjects) {
    const tool = getToolById(ctx.drawingTools, object.toolId);
    if (tool.styleHandlers && tool.styleHandlers[key]) {
      tool.styleHandlers[key](object, value, ctx);
    }
  }
}

export function* yieldSelectedObjects(ctx: ReactDrawContext) {
  const selectedObjects = getSelectedObjects(ctx);
  for (const object of selectedObjects) {
    yield object;
  }
}

export type CreateObjectOptions = {
  pointA: Point;
  pointB: Point;
  toolId: string;
};

/**
 * creates a new circle and adds it to thew view.
 * returns the resulting DrawingDataObject
 */
export function createCircle(
  ctx: ReactDrawContext,
  options: CreateObjectOptions,
): DrawingData {
  const newDrawingObject = createNewObject(ctx, options.pointA, options.toolId);
  const newCircle = makeCircleDiv(ctx.globalStyles);
  newDrawingObject.containerDiv.appendChild(newCircle);
  newDrawingObject.element = newCircle;
  // expand point
  newDrawingObject.coords.push(options.pointB);
  setContainerRect(newDrawingObject);
  addObject(ctx, newDrawingObject);
  ctx.selectObject(newDrawingObject);
  return newDrawingObject;
}

export type CreateImageOptions = CreateObjectOptions & {
  url?: string;
  showLoading?: boolean;
  image?: HTMLImageElement;
  loadingElement?: Element;
};

function getLoadingPlaceholder(): HTMLDivElement {
  const styleEle = document.createElement("style");
  styleEle.innerHTML = `.skeleton-loader {
					width: 100%;
					height: 100%;
					display: block;
					border-radius: 10px;
					background: linear-gradient(
							to right,
							rgba(255, 255, 255, 0),
							rgba(255, 255, 255, 0.5) 50%,
							rgba(255, 255, 255, 0) 80%
						),
						lightgray;
					background-repeat: repeat-y;
					background-size: 50px 500px;
					background-position: 0 0;
					animation: shine 1s infinite;
				}
				@keyframes shine {
					to {
						background-position: 100% 0, /* move highlight to right */ 0 0;
					}
				}`;
  const loadingEle = document.createElement("div");
  loadingEle.appendChild(styleEle);
  loadingEle.style.width = "100%";
  loadingEle.style.height = "100%";
  const innerEle = document.createElement("span");
  innerEle.className = "skeleton-loader";
  loadingEle.appendChild(innerEle);
  return loadingEle;
}

export async function createImage(
  ctx: ReactDrawContext,
  options: CreateImageOptions,
): Promise<DrawingData> {
  const newData = createNewObject(ctx, options.pointA, options.toolId);
  addObject(ctx, newData);
  newData.coords.push(options.pointB);
  setContainerRect(newData);
  const imageUrl = options.url;
  return new Promise((resolve, reject) => {
    const handleImageLoaded = (img: HTMLImageElement) => {
      newData.element = img;
      newData.containerDiv.innerHTML = "";
      newData.containerDiv.appendChild(img);
      if (ctx.shouldSelectAfterCreate) {
        ctx.selectObject(newData);
      }
      resolve(newData);
    };
    if (imageUrl) {
      if (options.showLoading) {
        const loadingEle = options.loadingElement ?? getLoadingPlaceholder();
        newData.containerDiv.appendChild(loadingEle);
      }
      const img = new Image();
      img.style.width = "100%";
      img.style.height = "100%";
      img.crossOrigin = "anonymous";
      img.onload = function () {
        handleImageLoaded(img);
      };
      img.onerror = () => {
        reject(null);
      };
      img.src = imageUrl;
      return newData;
    }
    const htmlImage = options.image;
    if (!htmlImage) {
      throw new Error(
        "createImage must be given either url (string) or image (HTMLImageElement) options. Neither provided.",
      );
    }
    handleImageLoaded(htmlImage);
  });
}

export function selectAll(ctx: ReactDrawContext): void {
  const selectedIds = getSelectedIdsFromFullState(ctx);
  const currentlySelected = getSelectedDrawingObjects(
    selectedIds,
    ctx.objectsMap,
  );
  if (currentlySelected.length > 0) {
    unselectAll(currentlySelected, ctx);
  }
  const idsToSelect = Array.from(ctx.objectsMap.keys());
  ctx.fullState[SELECT_TOOL_ID].selectedIds = idsToSelect;
  const objectsToSelect = Array.from(ctx.objectsMap.values());
  if (objectsToSelect.length === 1) {
    notifyTool(ctx.drawingTools, objectsToSelect[0], ctx);
    return selectElement(objectsToSelect[0], ctx);
  }
  if (objectsToSelect.length > 1) {
    return selectManyElements(objectsToSelect, ctx);
  }
}

export function getSelectedObjects(ctx: ReactDrawContext): DrawingData[] {
  const selectedIds = getSelectedIdsFromFullState(ctx);
  const currentlySelected = getSelectedDrawingObjects(
    selectedIds,
    ctx.objectsMap,
  );
  return currentlySelected;
}
