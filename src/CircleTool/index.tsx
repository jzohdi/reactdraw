import { CircleBoldIcon } from "@jzohdi/jsx-icons";
import React from "react";
import { CIRCLE_TOOL_ID } from "../constants";
import { DrawingTools } from "../types";
import { setContainerRect } from "../utils";
const circlTool: DrawingTools = {
  id: CIRCLE_TOOL_ID,
  icon: <CircleBoldIcon />,
  onDrawStart: (data) => {
    const lineWidth = data.style.lineWidth;
    const newSquare = makeCircleDiv(lineWidth);
    data.container.div.appendChild(newSquare);
    data.element = newSquare;
  },
  onDrawing: (data) => {
    setContainerRect(data);
    data.coords.splice(1);
  },
  onDrawEnd: (data) => {},
  onUpdate(data, ctx) {},
};

export default circlTool;

function makeCircleDiv(lineWidth: number): HTMLDivElement {
  const newDiv = document.createElement("div");
  newDiv.style.width = "100%";
  newDiv.style.height = "100%";
  newDiv.style.border = `${lineWidth}px solid black`;
  newDiv.style.borderRadius = "50%";
  return newDiv;
}
