import React from "react";
import { SQUARE_TOOL_ID } from "../constants";
import { DrawingTools } from "../types";
import { SquareBoldIcon } from "@jzohdi/jsx-icons";
import { setContainerRect } from "../utils";

const squareTool: DrawingTools = {
  id: SQUARE_TOOL_ID,
  icon: <SquareBoldIcon />,
  onDrawStart: (data) => {
    const lineWidth = data.style.lineWidth;
    const newSquare = makeSquareDiv(lineWidth);
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

export default squareTool;

function makeSquareDiv(lineWidth: number): HTMLDivElement {
  const div = document.createElement("div");
  div.style.width = "100%";
  div.style.height = "100%";
  div.style.border = `${lineWidth}px solid black`;
  div.style.borderRadius = "2px";
  return div;
}
