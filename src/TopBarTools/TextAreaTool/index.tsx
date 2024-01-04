import React from "react";
import {
  ActionObject,
  DrawingData,
  DrawingTools,
  ReactDrawContext,
  RectBounds,
  ToolPropertiesMap,
} from "../../types";
import {
  redoDelete,
  saveCreateToUndoStack,
  undoCreate,
  undoEleOpacity,
} from "../../utils/undo";
import { pushActionToStack } from "../../utils/pushActionToStack";
import {
  updateTextBackgroundColor,
  updateTextColor,
} from "../../utils/updateStyles/color";
import { updateEleOpacity } from "../../utils/updateStyles/opacity";
import { getObjectFromMap } from "../../utils/utils";
import {
  actionObjToSave,
  setContainerStyles,
} from "../../utils/updateStyles/utils";
import { getBoxSize } from "../../utils";
import { TEXT_AREA_TOOL_ID } from "../../constants";

const textAreaTool: DrawingTools = {
  icon: (
    <span
      style={{ display: "inline-block", fontWeight: "bold", fontSize: "20px" }}
    >
      A
    </span>
  ),
  id: TEXT_AREA_TOOL_ID,
  tooltip: "Textarea Tool",
  cursor: "text",
  onDrawStart: (data, ctx) => {
    setupTextAreaDiv(data, ctx);
  },
  onDrawing(data, viewContainer) {},
  onDrawEnd(data, ctx) {
    saveCreateToUndoStack(data, ctx);
    if (ctx.shouldSelectAfterCreate) {
      ctx.selectObject(data);
    }
  },
  onResize(data, ctx) {
    cleanHandlers(data, false);
    placeCaretAtEnd(data.element as HTMLDivElement);
  },
  onSelect(data, ctx) {
    cleanHandlers(data, false);
    placeCaretAtEnd(data.element as HTMLDivElement);
  },
  onUnSelect(data) {
    cleanHandlers(data, false);
    setBoundsFromDiv(data.containerDiv, getBoxSize(data));
  },
  onAfterUpdate(data, ctx) {
    cleanHandlers(data, false);
    placeCaretAtEnd(data.element as HTMLDivElement);
  },
  undoHandlers: {
    create: undoCreate,
    delete: redoDelete,
    input: undoTextAreaInput,
    color: undoTextAreaColor,
    background: undoTextAreaBackground,
    opacity: undoEleOpacity,
    fontSize: undoFontSize,
  },
  redoHandlers: {
    create: undoCreate,
    delete: redoDelete,
    input: undoTextAreaInput,
    color: undoTextAreaColor,
    background: undoTextAreaBackground,
    opacity: undoEleOpacity,
    fontSize: undoFontSize,
  },
  onDeleteObject(data, ctx) {
    cleanHandlers(data, true);
  },
  styleHandlers: {
    color: updateTextColor,
    background: updateTextBackgroundColor,
    opacity: updateEleOpacity,
    fontSize: updateTextAreaFontSize,
  },
};

function updateTextAreaFontSize(
  data: DrawingData,
  value: string
): ActionObject {
  const curr = data.style.fontSize;
  data.style.fontSize = value;
  data.containerDiv.style.fontSize = value + "px";
  setBoundsFromDiv(data.containerDiv, getBoxSize(data));
  return actionObjToSave(data, "fontSize", curr);
}

export default textAreaTool;

function undoFontSize(
  action: ActionObject,
  ctx: ReactDrawContext
): ActionObject {
  const object = getObjectFromMap(ctx.objectsMap, action.objectId);
  const curr = object.style.fontSize;
  const styleToSave = action.data;
  object.style.fontSize = styleToSave;
  object.containerDiv.style.fontSize = styleToSave + "px";
  action.data = curr;
  return action;
}

function undoTextAreaInput(
  action: ActionObject,
  ctx: ReactDrawContext
): ActionObject {
  const drawingObj = getObjectFromMap(ctx.objectsMap, action.objectId);
  const ele = drawingObj.element as HTMLDivElement;
  if (!ele) {
    throw new Error("tried to undo text but no ele found");
  }
  const currentInput = ele.innerHTML;
  const undoInput = action.data as string;
  ele.innerHTML = undoInput;
  action.data = currentInput;
  return action;
}

function undoTextAreaColor(
  action: ActionObject,
  ctx: ReactDrawContext
): ActionObject {
  return undoTextAreaStyle(action, ctx, "color", "color");
}

function undoTextAreaBackground(action: ActionObject, ctx: ReactDrawContext) {
  return undoTextAreaStyle(action, ctx, "background", "backgroundColor");
}

function undoTextAreaStyle(
  action: ActionObject,
  ctx: ReactDrawContext,
  dataKey: keyof ToolPropertiesMap,
  divKey: string
) {
  const object = getObjectFromMap(ctx.objectsMap, action.objectId);
  const currColor = object.style[dataKey];
  const colorTo = action.data;
  object.style[dataKey] = colorTo;
  (object.containerDiv.style as any)[divKey] = colorTo;
  action.data = currColor;
  return action;
}

function cleanHandlers(data: DrawingData, deleteCapture: boolean) {
  const textArea = data.element;
  if (!textArea) {
    return;
  }
  const handler = data.customData.get("handler");
  if (handler) {
    textArea.removeEventListener("keypress", handler);
    data.customData.delete("handler");
  }
  const capture = data.customData.get("capture");
  if (deleteCapture && !!capture) {
    textArea.removeEventListener("input", capture);
    data.customData.delete("capture");
  }
}

export function setBoundsFromDiv(div: HTMLDivElement, bounds: RectBounds) {
  const trueBounds = div.getBoundingClientRect();
  const { width, height } = trueBounds;
  bounds.bottom = bounds.top + height;
  bounds.right = bounds.left + width;
}

export function placeCaretAtEnd(el: HTMLDivElement) {
  el.focus();
  if (
    typeof window.getSelection !== "undefined" &&
    typeof document.createRange !== "undefined"
  ) {
    var range = document.createRange();
    range.selectNodeContents(el);
    range.collapse(false);
    const sel = window.getSelection();
    if (sel) {
      sel.removeAllRanges();
      sel.addRange(range);
      return true;
    }
  }
  console.error("cannot place caret at end");
  return false;
}

export function setTextContainerStyles(data: DrawingData) {
  const padding = 5;
  const div = data.containerDiv;
  div.style.padding = padding + "px";
  div.style.borderRadius = "2px";
  div.style.boxSizing = "border-box";
  const styleTag = document.createElement("style");
  styleTag.innerHTML = `
	.react-draw-cursor {
		outline: none;		
		height: 100%;
	}`;
  div.appendChild(styleTag);
  return data;
}

export function setTextToolStyles(data: DrawingData) {
  const fontSize = parseInt(data.style.fontSize);
  const padding = 5;
  const div = data.containerDiv;
  const bounds = getBoxSize(data);
  const bottom = bounds.top + fontSize + padding;
  div.style.height = "";
  div.style.minHeight = bottom - bounds.top + "px";
  div.style.minWidth = div.style.width;
  div.style.width = "";
  div.style.border = "1px solid black";
  return data;
}

export function setupTextAreaDiv(data: DrawingData, ctx: ReactDrawContext) {
  const div = data.containerDiv;
  const bounds = getBoxSize(data);

  setContainerStyles(data);
  setTextToolStyles(data);
  setTextContainerStyles(data);

  const cursorDiv = makeCursorDiv();
  cursorDiv.style.opacity = data.style.opacity;
  data.element = cursorDiv;

  div.appendChild(cursorDiv);
  setBoundsFromDiv(div, bounds);

  cursorDiv.setAttribute("tabindex", "1");
  addCaptureHandler(data, ctx);

  setTimeout(function () {
    cursorDiv.focus();
  }, 0);
  return cursorDiv;
}

export function addCaptureHandler(data: DrawingData, ctx: ReactDrawContext) {
  const div = data.element as HTMLDivElement;
  const customData = data.customData;
  function captureDidType(e: Event) {
    const currentMS = new Date().getTime();
    const lastCaptureMS = customData.get("lastCapture");
    if (!lastCaptureMS) {
      const action: ActionObject = {
        toolId: data.toolId,
        action: "input",
        data: "",
        toolType: "top-bar-tool",
        objectId: data.id,
      };
      pushActionToStack(action, ctx);
    } else if (currentMS - lastCaptureMS > 1000 * 5) {
      const target = e.target as HTMLInputElement;
      const action: ActionObject = {
        toolId: data.toolId,
        action: "input",
        data: target.innerHTML,
        toolType: "top-bar-tool",
        objectId: data.id,
      };
      pushActionToStack(action, ctx);
    }
    customData.set("lastCapture", currentMS);
  }
  div.addEventListener("input", captureDidType);
  customData.set("capture", captureDidType);
}

function makeCursorDiv() {
  const div = document.createElement("div");
  div.setAttribute("contenteditable", "true");
  div.style.minWidth = "1px";
  div.style.height = "100%";
  div.className = "react-draw-cursor";
  return div;
}
