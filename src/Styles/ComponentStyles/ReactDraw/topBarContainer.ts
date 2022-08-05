import { COLORS, TOP_BAR_CONTAINER_CLASSES } from "../../../constants";
import { StylesValue } from "../../types";

const styles: StylesValue = {
  display: "flex",
  backgroundColor: COLORS.primary.light,
  zIndex: 1000,
  width: "100%",
  overflowX: "auto",
  /* Firefox */
  "*": {
    scrollbarWidth: "none",
    scrollbarColor: `${COLORS.primary.main} #e2ecf5`,
  },
  /* Chrome, Edge, and Safari */
  "&::-webkit-scrollbar": {
    height: 10,
  },
  "&::-webkit-scrollbar-track": {
    background: "#e2ecf5",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: "#035195",
    borderRadius: 10,
    border: "3px none #ffffff",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    backgroundColor: "#00294d",
  },
};

export default {
  key: TOP_BAR_CONTAINER_CLASSES,
  styles,
};
