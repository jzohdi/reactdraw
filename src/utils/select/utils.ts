import { SELECT_TOOL_ID } from "../../constants";
import {
  DrawingData,
  DrawingTools,
  IntRange,
  ReactDrawContext,
} from "../../types";
import { resizeN } from "../resizeObjects/resizeN";
import { resizeW } from "../resizeObjects/resizeW";
import { resizeSW } from "../resizeObjects/resizeSW";
import { resizeS } from "../resizeObjects/resizeS";
import { resizeSE } from "../resizeObjects/resizeSE";
import { resizeNW } from "../resizeObjects/resizeNW";
import { resizeNE } from "../resizeObjects/resizeNE";
import { resizeE } from "../resizeObjects/resizeE";
import { getToolById, setStyles } from "../utils";
import {
  CORNER_BUTTON_PRE,
  ROTATE_BUTTON_PRE,
  ROTATE_BUTTON_STYLES,
  ROTATE_DOTTED_LINE_STYLES,
  SELECTED_BUTTON_HEIGHT,
  SELECTED_BUTTON_WIDTH,
  SELECTED_CORNER_BUTTON,
  SELECT_FRAME_DIV_STYLES,
  SELECT_FRAME_PRE,
} from "./constants";
import addHandlersToSelectFrame from "./dragHandler";
import { getSelectedDrawingObjects } from "./getSelectedDrawingObjects";
import addHandlersToCornerButton from "./resizeHandler";
import addHandlersToRotateButton from "./rotateHandler";
import { unselectElement } from "./unselectElement";

export function selectManyElements(
  selectObjects: DrawingData[],
  ctx: ReactDrawContext
): void {
  for (const data of selectObjects) {
    const selectFrame = makeSelectFrameDiv(data);
    if (selectFrame) {
      addHandlersToSelectFrame(selectFrame, data.id, ctx);
      data.containerDiv.appendChild(selectFrame);
    }
  }
}

function makeSelectFrameDiv(data: DrawingData) {
  const containerDiv = data.containerDiv;
  const objectId = data.id;
  if (isElementSelected(containerDiv)) {
    return null;
  }
  const div = document.createElement("div");
  div.setAttribute("id", `${SELECT_FRAME_PRE}-${objectId}`);
  //   div.setAttribute("draggable", "true");
  setStyles(div, SELECT_FRAME_DIV_STYLES);
  return div;
}

function isElementSelected(div: HTMLDivElement) {
  return div.querySelector('[id^="select-frame"') !== null;
}

export function unselectEverythingAndReturnPrevious(ctx: ReactDrawContext) {
  const selectedIds = [...ctx.fullState[SELECT_TOOL_ID].selectedIds];
  const { objectsMap, prevMousePosition } = ctx;
  const objects = getSelectedDrawingObjects(selectedIds, objectsMap);
  unselectAll(objects, ctx);
  if (objects.length === 1) {
    const tool = getToolById(ctx.drawingTools, objects[0].toolId);
    if (tool && ctx && tool.onUnSelect) {
      tool.onUnSelect(objects[0], ctx);
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
  tool.onSelect(data, ctx);
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
  //   console.log(ctx);
  if (selectFrame) {
    addHandlersToSelectFrame(selectFrame, data.id, ctx);
    addToolsToSelectionDiv(selectFrame, data, ctx);
    data.containerDiv.appendChild(selectFrame);
  }
}

function addToolsToSelectionDiv(
  div: HTMLDivElement,
  data: DrawingData,
  ctx: ReactDrawContext
): void {
  const eleId = data.id;
  // corner/side buttons
  const topLeftCorner = createButtonWithOffsets(eleId, 2, 0, 0, 2);
  addHandlersToCornerButton(topLeftCorner, eleId, ctx, resizeNW);
  const topButton = createButtonWithOffsets(eleId, 2, 1);
  addHandlersToCornerButton(topButton, eleId, ctx, resizeN);
  const topRightCorner = createButtonWithOffsets(eleId, 2, 2);
  addHandlersToCornerButton(topRightCorner, eleId, ctx, resizeNE);
  const rightButton = createButtonWithOffsets(eleId, 0, 2, 1);
  addHandlersToCornerButton(rightButton, eleId, ctx, resizeE);
  const bottomRightCorner = createButtonWithOffsets(eleId, 0, 2, 2);
  addHandlersToCornerButton(bottomRightCorner, eleId, ctx, resizeSE);
  const bottomButton = createButtonWithOffsets(eleId, 0, 1, 2);
  addHandlersToCornerButton(bottomButton, eleId, ctx, resizeS);
  const bottomLeftCorner = createButtonWithOffsets(eleId, 0, 0, 2, 2);
  addHandlersToCornerButton(bottomLeftCorner, eleId, ctx, resizeSW);
  const leftButton = createButtonWithOffsets(eleId, 0, 0, 1, 2);
  addHandlersToCornerButton(leftButton, eleId, ctx, resizeW);

  div.appendChild(topLeftCorner);
  div.appendChild(topButton);
  div.appendChild(topRightCorner);
  div.appendChild(rightButton);
  div.appendChild(bottomRightCorner);
  div.appendChild(bottomButton);
  div.appendChild(bottomLeftCorner);
  div.appendChild(leftButton);

  // rotate button
  const rotateButton = createButtonWithOffsets(eleId);
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

// function createButtonWithOffsets(
//   eleId: string,
//   top?: boolean,
//   right?: boolean,
//   bottom?: boolean,
//   left?: boolean
// ): HTMLButtonElement {
//   const button = document.createElement("button");
//   setStyles(button, SELECTED_CORNER_BUTTON);
//   let buttonId = "";
//   if (top) {
//     button.style.top = `${CORNER_BUTTON_OFFSET}px`;
//     buttonId += "n";
//   } else if (bottom) {
//     button.style.bottom = `${CORNER_BUTTON_OFFSET}px`;
//     buttonId += "s";
//   }
//   if (right) {
//     button.style.right = `${CORNER_BUTTON_OFFSET}px`;
//     buttonId += "e";
//   } else if (left) {
//     button.style.left = `${CORNER_BUTTON_OFFSET}px`;
//     buttonId += "w";
//   }
//   button.id = `${CORNER_BUTTON_PRE}-${buttonId}-${eleId}`;
//   button.style.cursor = `${buttonId}-resize`;
//   return button;
// }

// each can be in a range of [0, 3) (3 exclusive)
function createButtonWithOffsets(
  eleId: string,
  top: IntRange<0, 3> = 0,
  right: IntRange<0, 3> = 0,
  bottom: IntRange<0, 3> = 0,
  left: IntRange<0, 3> = 0
): HTMLButtonElement {
  const button = document.createElement("button");
  setStyles(button, SELECTED_CORNER_BUTTON);
  let buttonId = "";
  if (top === 2) {
    button.style.top = `${CORNER_BUTTON_OFFSET}px`;
    buttonId += "n";
  }
  if (bottom === 2) {
    button.style.bottom = `${CORNER_BUTTON_OFFSET}px`;
    buttonId += "s";
  } else if (bottom === 1) {
    button.style.bottom = `calc(50% - ${SELECTED_BUTTON_HEIGHT / 2}px)`;
  }
  if (right === 2) {
    button.style.right = `${CORNER_BUTTON_OFFSET}px`;
    buttonId += "e";
  } else if (right === 1) {
    button.style.right = `calc(50% - ${SELECTED_BUTTON_WIDTH / 2}px)`;
  }
  if (left === 2) {
    button.style.left = `${CORNER_BUTTON_OFFSET}px`;
    buttonId += "w";
  }

  button.id = `${CORNER_BUTTON_PRE}-${buttonId}-${eleId}`;
  button.style.cursor = `${buttonId}-resize`;
  return button;
}

export function getSelectedIdsFromFullState(ctx: ReactDrawContext): string[] {
  const selectState = ctx.fullState[SELECT_TOOL_ID];
  if (!selectState) {
    throw new Error("no select state present");
  }
  return [...selectState.selectedIds];
}
