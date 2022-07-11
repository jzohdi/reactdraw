import React from "react";
import { DrawingData, DrawingTools, RectBounds } from "../types";

const textAreaTool: DrawingTools = {
  icon: (
    <span
      style={{ display: "inline-block", fontWeight: "bold", fontSize: "20px" }}
    >
      A
    </span>
  ),
  id: "react-draw-textarea-tool",
  onDrawStart: (data) => {
    setupContainer(data);
  },
  onDrawing(data, viewContainer) {},
  onDrawEnd(data, viewContainer) {
    // const { div, bounds } = data.container;
    // const { width, height } = div.getBoundingClientRect();
    // bounds.bottom = bounds.top + height;
    // bounds.right = bounds.left + width;
  },
  onResize(data, ctx) {},
  onSelect(data, ctx) {
    const textArea = data.element;
    if (!textArea) {
      return;
    }
    if (data.customData.handler) {
      textArea.removeEventListener("keypress", data.customData.handler);
      data.customData.handler = null;
    }
    placeCaretAtEnd(textArea as HTMLDivElement);
  },
  onAfterUpdate(data) {
    const textArea = data.element;
    if (!textArea) {
      return;
    }
    placeCaretAtEnd(textArea as HTMLDivElement);
  },
};

export default textAreaTool;

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

function setupContainer(data: DrawingData) {
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
  function setBoundsOnTyping() {
    const trueBounds = div.getBoundingClientRect();
    const { width, height } = trueBounds;
    bounds.bottom = bounds.top + height;
    bounds.right = bounds.left + width;
    console.log("setting bounds on typing");
  }
  data.customData = {
    handler: setBoundsOnTyping,
  };
  cursorDiv.addEventListener("keypress", setBoundsOnTyping);
  div.appendChild(cursorDiv);
  setBoundsFromDiv(div, bounds);
  cursorDiv.setAttribute("tabindex", "1");
  setTimeout(function () {
    cursorDiv.focus();
  }, 0);
  data.element = cursorDiv;
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
