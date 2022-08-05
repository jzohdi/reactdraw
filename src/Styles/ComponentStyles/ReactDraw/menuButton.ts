import { BPmd, COLORS, MENU_BUTTON_CLASSES } from "../../../constants";
import { StylesValue } from "../../types";
import { mediaQuery } from "../../utils";

const styles: StylesValue = {
  position: "relative",
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
  '&[data-open="true"]': {
    backgroundColor: `${COLORS.primary.main} !important`,
  },
  '&[data-open="true"] > svg path': {
    fill: "white",
    stroke: "white",
  },
};

export default {
  key: MENU_BUTTON_CLASSES,
  styles,
};
