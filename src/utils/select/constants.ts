import { COLORS } from "../../constants";
import { PartialCSS } from "../../types";

//============== BUTTON ID PREFIX ================
export const ROTATE_BUTTON_PRE = "button-rotate";
export const SELECT_FRAME_PRE = "select-frame";
export const CORNER_BUTTON_PRE = "corner-button";

export const ROTATE_BUTTON_STYLES: PartialCSS = {
  top: "-45px",
  cursor: "grab",
  left: "calc(50% - 8px)",
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
  boxSizing: "border-box",
};

export const ROTATE_DOTTED_LINE_STYLES: PartialCSS = {
  width: "0px",
  height: "35px",
  borderLeft: "2px dotted black",
  position: "absolute",
  left: "5px",
  pointerEvents: "none",
};

export const SELECTED_BUTTON_WIDTH = 16;
export const SELECTED_BUTTON_HEIGHT = 16;
export const SELECTED_CORNER_BUTTON: PartialCSS = {
  position: "absolute",
  borderRadius: "50%",
  width: `${SELECTED_BUTTON_WIDTH}px`,
  height: `${SELECTED_BUTTON_HEIGHT}px`,
};
