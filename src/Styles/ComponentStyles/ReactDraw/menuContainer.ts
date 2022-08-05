import { BPmd, COLORS, MENU_CONTAINER_CLASSES } from "../../../constants";
import { StylesValue } from "../../types";
import { mediaQuery } from "../../utils";

const styles: StylesValue = {
  position: "absolute",
  left: 0,
  padding: 15,
  border: `1px solid ${COLORS.primary.main}`,
  zIndex: 1000,
  backgroundColor: "white",
  borderRadius: "0px 5px 0px 0px",
  maxHeight: "calc(100% - 80px)",
  maxWidth: "100%",
  overflow: "auto",
  boxSizing: "border-box",
  [mediaQuery.applyAbove(BPmd)]: {
    bottom: 40,
  },
  [mediaQuery.applyBelow(BPmd)]: {
    bottom: 30,
  },
  /* Firefox */
  "*": {
    scrollbarWidth: "none",
    scrollbarColor: `${COLORS.primary.main} #e2ecf5`,
  },

  /* Chrome, Edge, and Safari */
  "&::-webkit-scrollbar": {
    width: 8,
  },
  "&::-webkit-scrollbar-track": {
    background: "#e2ecf5",
  },

  "&::-webkit-scrollbar-thumb": {
    backgroundColor: COLORS.primary.main,
    borderRadius: 8,
    border: "3px none #ffffff",
  },
};

export default {
  key: MENU_CONTAINER_CLASSES,
  styles,
};
