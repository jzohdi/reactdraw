import { ALERT_MESSAGE_DIALOG_CLASSES } from "../../../constants";
import { StylesValue } from "../../types";

const styles: StylesValue = {
  position: "absolute",
  whiteSpace: "nowrap",
  textAlign: "center",
  borderRadius: 6,
  padding: "5px 10px",
  zIndex: 1001,
  color: "white",
};

export default {
  key: ALERT_MESSAGE_DIALOG_CLASSES,
  styles,
};
