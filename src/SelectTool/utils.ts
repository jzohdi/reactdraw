import { DrawingData, DrawingTools, ReactDrawContext } from "../types";
import { resizeNE, resizeNW, resizeSE, resizeSW } from "../utils/resizeObject";
import { changeCtxForTool, getToolById, setStyles } from "../utils/utils";
import {
  CORNER_BUTTON_PRE,
  ROTATE_BUTTON_PRE,
  ROTATE_BUTTON_STYLES,
  ROTATE_DOTTED_LINE_STYLES,
  SELECTED_CORNER_BUTTON,
  SELECT_FRAME_DIV_STYLES,
  SELECT_FRAME_PRE,
  SELECT_TOOL_ID,
} from "./constants";
import addHandlersToSelectFrame from "./dragHandler";
import { getSelectedDrawingObjects } from "./getSelectedDrawingObjects";
import addHandlersToCornerButton from "./resizeHandler";
import addHandlersToRotateButton from "./rotateHandler";
import { SelectToolCustomState } from "./types";
import { unselectElement } from "./unselectElement";

export function selectManyElements(
  selectObjects: DrawingData[],
  ctx: ReactDrawContext
): void {
  for (const data of selectObjects) {
    const selectFrame = makeSelectFrameDiv(data);
    if (selectFrame) {
      addHandlersToSelectFrame(selectFrame, data.container.id, ctx);
      data.container.div.appendChild(selectFrame);
    }
  }
}

function makeSelectFrameDiv(data: DrawingData) {
  const containerDiv = data.container.div;
  const eleId = data.container.id;
  if (isElementSelected(containerDiv)) {
    return null;
  }
  const div = document.createElement("div");
  div.setAttribute("id", `${SELECT_FRAME_PRE}-${eleId}`);
  //   div.setAttribute("draggable", "true");
  setStyles(div, SELECT_FRAME_DIV_STYLES);
  return div;
}

function isElementSelected(div: HTMLDivElement) {
  return div.querySelector('[id^="select-frame"') !== null;
}

export function unselectEverythingAndReturnPrevious(ctx: ReactDrawContext) {
  const selectedIds = [
    ...((ctx.customState as SelectToolCustomState).selectedIds || []),
  ];
  const { objectsMap, prevMousePosition } = ctx;
  const objects = getSelectedDrawingObjects(selectedIds, objectsMap);
  unselectAll(objects, ctx);
  if (objects.length === 1) {
    const tool = getToolById(ctx.drawingTools, objects[0].toolId);
    if (tool && ctx && tool.onUnSelect) {
      tool.onUnSelect(objects[0], changeCtxForTool(ctx, tool.id));
    }
  }
  prevMousePosition.current = null;
  const prevIds = selectedIds.splice(0, selectedIds.length);
  return { ids: prevIds, objects };
}

export function notifyTool(
  tools: DrawingTools[],
  data: DrawingData,
  ctx: ReactDrawContext
) {
  const tool = getToolById(tools, data.toolId);
  if (!tool || !ctx || !tool.onSelect) {
    return;
  }
  tool.onSelect(data, changeCtxForTool(ctx, tool.id));
}

export function unselectAll(
  selectedObjects: DrawingData[],
  ctx: ReactDrawContext
): void {
  for (const obj of selectedObjects) {
    unselectElement(obj, ctx);
  }
}

export function selectElement(data: DrawingData, ctx: ReactDrawContext): void {
  const selectFrame = makeSelectFrameDiv(data);
  if (selectFrame) {
    addHandlersToSelectFrame(selectFrame, data.container.id, ctx);
    addToolsToSelectionDiv(selectFrame, data, ctx);
    data.container.div.appendChild(selectFrame);
  }
}

function addToolsToSelectionDiv(
  div: HTMLDivElement,
  data: DrawingData,
  ctx: ReactDrawContext
): void {
  const eleId = data.container.id;
  // corner buttons
  const topLeftCorner = cornerButton(eleId, true, false, false, true);
  addHandlersToCornerButton(topLeftCorner, eleId, ctx, resizeNW);
  const topRightCorner = cornerButton(eleId, true, true);
  addHandlersToCornerButton(topRightCorner, eleId, ctx, resizeNE);
  const bottomRightCorner = cornerButton(eleId, false, true, true);
  addHandlersToCornerButton(bottomRightCorner, eleId, ctx, resizeSE);
  const bottomLeftCorner = cornerButton(eleId, false, false, true, true);
  addHandlersToCornerButton(bottomLeftCorner, eleId, ctx, resizeSW);

  div.appendChild(topLeftCorner);
  div.appendChild(topRightCorner);
  div.appendChild(bottomRightCorner);
  div.appendChild(bottomLeftCorner);

  // rotate button
  const rotateButton = cornerButton(eleId);
  rotateButton.id = `${ROTATE_BUTTON_PRE}-${eleId}`;
  setStyles(rotateButton, ROTATE_BUTTON_STYLES);
  addHandlersToRotateButton(rotateButton, eleId, ctx);

  // connecting line
  const divLine = document.createElement("div");
  setStyles(divLine, ROTATE_DOTTED_LINE_STYLES);
  divLine.id = `line-div-${eleId}`;
  rotateButton.appendChild(divLine);

  // final
  div.appendChild(rotateButton);
}

const CORNER_BUTTON_OFFSET = -12;

function cornerButton(
  eleId: string,
  top?: boolean,
  right?: boolean,
  bottom?: boolean,
  left?: boolean
): HTMLButtonElement {
  const button = document.createElement("button");
  setStyles(button, SELECTED_CORNER_BUTTON);
  let buttonId = "";
  if (top) {
    button.style.top = `${CORNER_BUTTON_OFFSET}px`;
    buttonId += "n";
  } else if (bottom) {
    button.style.bottom = `${CORNER_BUTTON_OFFSET}px`;
    buttonId += "s";
  }
  if (right) {
    button.style.right = `${CORNER_BUTTON_OFFSET}px`;
    buttonId += "e";
  } else if (left) {
    button.style.left = `${CORNER_BUTTON_OFFSET}px`;
    buttonId += "w";
  }
  button.id = `${CORNER_BUTTON_PRE}-${buttonId}-${eleId}`;
  button.style.cursor = `${buttonId}-resize`;
  return button;
}

export function getSelectedIdsFromFullState(ctx: ReactDrawContext): string[] {
  const selectState = ctx.fullState.get(
    SELECT_TOOL_ID
  ) as SelectToolCustomState;
  if (!selectState) {
    throw new Error("no select state present");
  }
  return [...selectState.selectedIds];
}
