import { COLORS } from "../constants";
import { DrawingData } from "../types";

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
  div.setAttribute("id", `select-frame-${eleId}`);
  div.style.width = "calc(100% + 12px)";
  div.style.height = "calc(100% + 12px)";
  div.style.position = "absolute";
  div.style.border = `2px dotted ${COLORS.primary.main}`;
  div.style.top = "-6px";
  div.style.left = "-6px";
  div.style.cursor = "all-scroll";
  div.style.pointerEvents = "all";
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
  const topLeftCorner = cornerButton(true, false, false, true);
  //   topLeftCorner.setAttribute("id", )
  topLeftCorner.style.cursor = "nw-resize";
  topLeftCorner.id = `button-tl-${eleId}`;
  // leftTopCorner.
  const topRightCorner = cornerButton(true, true);
  topRightCorner.id = `button-tr-${eleId}`;
  topRightCorner.style.cursor = "ne-resize";
  const bottomRightCorner = cornerButton(false, true, true);
  bottomRightCorner.id = `button-br-${eleId}`;
  bottomRightCorner.style.cursor = "se-resize";
  const bottomLeftCorner = cornerButton(false, false, true, true);
  bottomLeftCorner.style.cursor = "sw-resize";
  bottomLeftCorner.id = `button-bl-${eleId}`;
  div.appendChild(topLeftCorner);
  div.appendChild(topRightCorner);
  div.appendChild(bottomRightCorner);
  div.appendChild(bottomLeftCorner);

  const rotateButton = cornerButton();
  rotateButton.id = `button-rotate-${eleId}`;
  rotateButton.style.top = "-45px";
  rotateButton.style.cursor = "grab";
  rotateButton.style.left = "calc(50% - 8px)";
  const divLine = document.createElement("div");
  divLine.style.width = "0px";
  divLine.style.height = "35px";
  divLine.style.borderLeft = "2px dotted black";
  divLine.style.position = "absolute";
  divLine.style.left = "5px";
  rotateButton.appendChild(divLine);
  div.appendChild(rotateButton);
}

const CORNER_BUTTON_OFFSET = -12;

function cornerButton(
  top?: boolean,
  right?: boolean,
  bottom?: boolean,
  left?: boolean
): HTMLButtonElement {
  const button = document.createElement("button");
  button.style.position = "absolute";
  button.style.borderRadius = "50%";
  button.style.width = "16px";
  button.style.height = "16px";
  //   button.style.cursor = "pointer";
  if (top) {
    button.style.top = `${CORNER_BUTTON_OFFSET}px`;
  }
  if (right) {
    button.style.right = `${CORNER_BUTTON_OFFSET}px`;
  }
  if (bottom) {
    button.style.bottom = `${CORNER_BUTTON_OFFSET}px`;
  }
  if (left) {
    button.style.left = `${CORNER_BUTTON_OFFSET}px`;
  }
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
  return div.lastElementChild?.id.includes("select-frame");
}
