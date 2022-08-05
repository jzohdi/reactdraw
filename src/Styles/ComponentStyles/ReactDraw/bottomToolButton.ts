import { BOTTOM_TOOL_BUTTON_CLASSES, BPmd, COLORS } from "../../../constants";
import { StylesValue } from "../../types";
import { mediaQuery } from "../../utils";

const styles: StylesValue = {
  display: "flex",
  cursor: "pointer",
  justifyContent: "center",
  alignItems: "center",
  border: "none",
  backgroundColor: "transparent",
  borderRadius: 2,
  transition: "background-color 150ms ease-in-out",
  [mediaQuery.applyAbove(BPmd)]: {
    width: 40,
    height: 40,
  },
  [mediaQuery.applyBelow(BPmd)]: {
    width: 30,
    height: 30,
  },
  '&[data-mode="hide"]': {
    display: "none",
  },
  '&[data-disabled="true"]': {
    cursor: "not-allowed",
    backgroundColor: "white",
  },
  '&[data-disabled="true"] > svg path': {
    fill: "lightgrey",
    stroke: "lightgrey",
  },
  '&[data-disabled="false"]:hover': {
    backgroundColor: COLORS.grey.light,
  },
  '&[data-disabled="false"]': {
    display: "inline-block",
  },
};

export default {
  key: BOTTOM_TOOL_BUTTON_CLASSES,
  styles,
};
