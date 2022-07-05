import { COLORS } from "../constants";
import { CurrentDrawingData } from "../types";

export function selectElement(data: CurrentDrawingData): void {
  const containerDiv = data.container.div;
  const eleId = data.container.id;
  if (isElementSelected(containerDiv)) {
    return;
  }
  const div = document.createElement("div");
  div.setAttribute("id", `select-frame-${data.container.id}`);
  div.style.width = "calc(100% + 12px)";
  div.style.height = "calc(100% + 12px)";
  div.style.position = "absolute";
  div.style.border = `2px dotted ${COLORS.primary.main}`;
  div.style.top = "-6px";
  div.style.left = "-6px";
  div.style.cursor = "all-scroll";
  addToolsToSelectionDiv(div, eleId);
  containerDiv.appendChild(div);
}

function addToolsToSelectionDiv(div: HTMLDivElement, eleId: string): void {
  const topLeftCorner = cornerButton(true, false, false, true);
  //   topLeftCorner.setAttribute("id", )
  topLeftCorner.style.cursor = "nw-resize";
  // leftTopCorner.
  const topRightCorner = cornerButton(true, true);
  topRightCorner.style.cursor = "ne-resize";
  const bottomRightCorner = cornerButton(false, true, true);
  bottomRightCorner.style.cursor = "se-resize";
  const bottomLeftCorner = cornerButton(false, false, true, true);
  bottomLeftCorner.style.cursor = "sw-resize";
  div.appendChild(topLeftCorner);
  div.appendChild(topRightCorner);
  div.appendChild(bottomRightCorner);
  div.appendChild(bottomLeftCorner);

  const rotateButton = cornerButton();
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
export function unselectElement(data: CurrentDrawingData): void {
  const { div, id } = data.container;
  if (isElementSelected(div) && div.lastElementChild) {
    // div.lastElementChild.removeEventListener()
    div.removeChild(div.lastElementChild);
  }
}

function isElementSelected(div: HTMLDivElement) {
  return div.lastElementChild?.id.includes("select-frame");
}
