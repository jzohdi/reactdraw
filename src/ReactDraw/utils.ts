import {
  CORNER_BUTTON_PRE,
  ROTATE_BUTTON_PRE,
  ROTATE_BUTTON_STYLES,
  ROTATE_DOTTED_LINE_STYLES,
  SELECTED_CORNER_BUTTON,
  SELECT_FRAME_DIV_STYLES,
  SELECT_FRAME_PRE,
} from "../constants";
import { DrawingData, PartialCSS, SelectMode } from "../types";

export function unselectAll(selectedObjects: DrawingData[]): void {
  for (const obj of selectedObjects) {
    unselectElement(obj);
  }
}

export function selectManyElements(selectObjects: DrawingData[]): void {
  for (const data of selectObjects) {
    const selectFrame = makeSelectFrameDiv(data);
    if (selectFrame) {
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
  setStyles(div, SELECT_FRAME_DIV_STYLES);
  return div;
}
export function selectElement(data: DrawingData): void {
  const selectFrame = makeSelectFrameDiv(data);
  if (selectFrame) {
    addToolsToSelectionDiv(selectFrame, data.container.id);
    data.container.div.appendChild(selectFrame);
  }
}

function addToolsToSelectionDiv(div: HTMLDivElement, eleId: string): void {
  const topLeftCorner = cornerButton(eleId, true, false, false, true);
  const topRightCorner = cornerButton(eleId, true, true);
  const bottomRightCorner = cornerButton(eleId, false, true, true);
  const bottomLeftCorner = cornerButton(eleId, false, false, true, true);

  div.appendChild(topLeftCorner);
  div.appendChild(topRightCorner);
  div.appendChild(bottomRightCorner);
  div.appendChild(bottomLeftCorner);

  const rotateButton = cornerButton(eleId);
  rotateButton.id = `${ROTATE_BUTTON_PRE}-${eleId}`;
  setStyles(rotateButton, ROTATE_BUTTON_STYLES);
  const divLine = document.createElement("div");
  setStyles(divLine, ROTATE_DOTTED_LINE_STYLES);
  rotateButton.appendChild(divLine);
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
export function unselectElement(data: DrawingData): void {
  const { div, id } = data.container;
  if (isElementSelected(div) && div.lastElementChild) {
    // div.lastElementChild.removeEventListener()
    div.removeChild(div.lastElementChild);
  }
}

function isElementSelected(div: HTMLDivElement) {
  return div.lastElementChild?.id.includes(SELECT_FRAME_PRE);
}

export function setStyles(div: HTMLElement, styles: PartialCSS): HTMLElement {
  for (const key in styles) {
    (<any>div.style)[key] = styles[key];
  }
  return div;
}

export function getCornerMode(id: string): SelectMode {
  const direction = id.split("-")[2];
  if (direction === "sw") {
    return "resize-sw";
  }
  if (direction === "nw") {
    return "resize-nw";
  }
  if (direction === "se") {
    return "resize-se";
  }
  if (direction === "ne") {
    return "resize-ne";
  }
  throw new Error("corner mode id not valid");
}
