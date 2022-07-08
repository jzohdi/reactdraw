import React from "react";
import { CursorClickIcon } from "@jzohdi/jsx-icons";
import { DrawingTools } from "../types";
import { COLORS, CURSOR_ID } from "../constants";
import { setContainerRect } from "../utils";

const selectTool: DrawingTools = {
  icon: <CursorClickIcon style={{ transform: "translate(-2px, -1px)" }} />,
  id: CURSOR_ID,
  onDrawStart: (data) => {
    data.container.div.style.border = `1px solid ${COLORS.primary.main}`;
    data.container.div.style.backgroundColor = COLORS.primary.light + "4d";
  },
  onDrawing: (data) => {
    setContainerRect(data);
    data.coords.splice(1);
  },
  onDrawEnd: (data) => {
    const div = data.container.div;
    div.style.border = "none";
    div.style.backgroundColor = "transparent";
    div.parentElement?.removeChild(div);
    console.log("select tool end");
    const ele = document.getElementById(data.container.id);
    if (ele) {
      ele.remove();
    }
  },
  onUpdate: (data) => {},
};

export default selectTool;
