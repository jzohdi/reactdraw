import { PartialCSS } from "./types";

//============== TOOL IDS =========================
export const CURSOR_ID = "react-draw-cursor";
export const SQUARE_TOOL_ID = "react-draw-square-tool";
export const CIRCLE_TOOL_ID = "react-draw-circle-tool";

//============== TOOL IDS =========================
export const ROTATE_BUTTON_PRE = "button-rotate";
export const SELECT_FRAME_PRE = "select-frame";
export const CORNER_BUTTON_PRE = "corner-button";

//============== STYLES =========================
// break point medium
export const BPmd = 450;
// max distnace for a select click stop - end to be considered a click
export const SELECT_TOOL_DRAG_MIN_DISTANCE = 75;
export const COLORS = {
  primary: {
    light: "#bddefb",
    main: "#228be6",
  },
  grey: {
    light: "#ececec",
  },
};
export const SELECT_FRAME_DIV_STYLES: PartialCSS = {
  width: "calc(100% + 16px)",
  height: "calc(100% + 16px)",
  position: "absolute",
  border: `2px dotted ${COLORS.primary.main}`,
  top: "-6px",
  left: "-6px",
  cursor: "all-scroll",
  pointerEvents: "all",
};

export const ROTATE_BUTTON_STYLES: PartialCSS = {
  top: "-45px",
  cursor: "grab",
  left: "calc(50% - 8px)",
};

export const ROTATE_DOTTED_LINE_STYLES: PartialCSS = {
  width: "0px",
  height: "35px",
  borderLeft: "2px dotted black",
  position: "absolute",
  left: "5px",
  pointerEvents: "none",
};

export const SELECTED_CORNER_BUTTON: PartialCSS = {
  position: "absolute",
  borderRadius: "50%",
  width: "16px",
  height: "16px",
};
//============== STYLES =========================
