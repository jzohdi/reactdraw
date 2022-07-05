import React from "react";
import { CusorClickIcon } from "@jzohdi/jsx-icons";
import { DrawingToolsWithId } from "../types";
import { COLORS, CURSOR_ID } from "../constants";
import { setContainerRect } from "../utils";

const SelectTool: DrawingToolsWithId = {
  icon: <CusorClickIcon style={{ transform: "translate(-2px, -1px)" }} />,
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
  },
};

export default SelectTool;
