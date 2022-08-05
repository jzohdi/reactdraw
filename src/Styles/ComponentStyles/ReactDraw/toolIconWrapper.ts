import { BPmd, COLORS, TOOL_ICON_WRAPPER_CLASSES } from "../../../constants";
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
  "&:hover": {
    backgroundColor: COLORS.grey.light,
  },
  '&[data-selected="true"]': {
    backgroundColor: `${COLORS.primary.main} !important`,
  },
  '&[data-selected="true"] > svg path': {
    fill: "white",
  },
};

export default {
  key: TOOL_ICON_WRAPPER_CLASSES,
  styles,
};
