import React from "react";
import {
  ActionObject,
  DrawingData,
  DrawingTools,
  ReactDrawContext,
  RectBounds,
} from "../types";
import {
  pushActionToStack,
  redoDelete,
  saveCreateToUndoStack,
  undoCreate,
} from "../utils/undo";
import { getObjectFromMap } from "../utils/utils";

const textAreaTool: DrawingTools = {
  icon: (
    <span
      style={{ display: "inline-block", fontWeight: "bold", fontSize: "20px" }}
    >
      A
    </span>
  ),
  id: "react-draw-textarea-tool",
  cursor: "text",
  onDrawStart: (data, ctx) => {
    setupContainer(data, ctx);
  },
  onDrawing(data, viewContainer) {},
  onDrawEnd: saveCreateToUndoStack,
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
    setBoundsFromDiv(data.container.div, data.container.bounds);
  },
  onAfterUpdate(data, ctx) {
    cleanHandlers(data, false);
    placeCaretAtEnd(data.element as HTMLDivElement);
  },
  onUndo(action, ctx) {
    if (action.action === "create") {
      return undoCreate(action, ctx);
    } else if (action.action === "input") {
      return undoTextAreaInput(action, ctx);
    }
    console.error("Unsupported action: ", action);
    throw new Error();
  },
  onRedo(action, ctx) {
    if (action.action === "delete") {
      return redoDelete(action, ctx);
    } else if (action.action === "input") {
      return undoTextAreaInput(action, ctx);
    }
    console.error("unsupported action:", action);
    throw new Error();
  },
  onDeleteObject(data, ctx) {
    cleanHandlers(data, true);
  },
};

export default textAreaTool;

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

function setBoundsFromDiv(div: HTMLDivElement, bounds: RectBounds) {
  const trueBounds = div.getBoundingClientRect();
  const { width, height } = trueBounds;
  bounds.bottom = bounds.top + height;
  bounds.right = bounds.left + width;
}

function placeCaretAtEnd(el: HTMLDivElement) {
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

function setupContainer(data: DrawingData, ctx: ReactDrawContext) {
  const fontSize = 12;
  const padding = 5;
  const { div, bounds } = data.container;
  bounds.bottom = bounds.top + fontSize + padding;
  div.style.height = "";
  div.style.minHeight = bounds.bottom - bounds.top + "px";
  div.style.minWidth = div.style.width;
  div.style.width = "";
  div.style.border = "1px solid black";
  div.style.padding = padding + "px";
  div.style.borderRadius = "2px";
  const styleTag = document.createElement("style");
  styleTag.innerHTML = `
	.react-draw-cursor {
		outline: none;		
		height: 100%;
	}`;

  div.appendChild(styleTag);

  const cursorDiv = makeCursorDiv();
  data.element = cursorDiv;

  function setBoundsOnTyping() {
    const trueBounds = div.getBoundingClientRect();
    const { width, height } = trueBounds;
    bounds.bottom = bounds.top + height;
    bounds.right = bounds.left + width;
    // console.log("setting bounds on typing");
  }
  data.customData.set("handler", setBoundsOnTyping);
  // TODO: verify this is not leaked
  cursorDiv.addEventListener("keypress", setBoundsOnTyping);
  div.appendChild(cursorDiv);
  setBoundsFromDiv(div, bounds);

  cursorDiv.setAttribute("tabindex", "1");
  addCaptureHandler(data, ctx);

  setTimeout(function () {
    cursorDiv.focus();
  }, 0);
}

type TextAreaCustomData = {
  handler: (() => void) | null;
  capture: ((...args: any) => void) | null;
  lastCapture: number | null;
};
function addCaptureHandler(data: DrawingData, ctx: ReactDrawContext) {
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
        objectId: data.container.id,
      };
      pushActionToStack(action, ctx);
    } else if (currentMS - lastCaptureMS > 1000 * 5) {
      const target = e.target as HTMLInputElement;
      const action: ActionObject = {
        toolId: data.toolId,
        action: "input",
        data: target.innerHTML,
        toolType: "top-bar-tool",
        objectId: data.container.id,
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
  div.style.fontSize = "14px";
  div.setAttribute("contenteditable", "true");
  div.style.minWidth = "1px";
  div.style.height = "100%";
  div.className = "react-draw-cursor";
  return div;
}
