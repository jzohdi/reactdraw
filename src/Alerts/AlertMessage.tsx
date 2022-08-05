import React from "react";
import { ALERT_MESSAGE_DIALOG_CLASSES } from "../constants";
import { useStyles } from "../Styles/hooks";
import { useAlerts } from "./hooks";

export default function AlertMessage() {
  const [state] = useAlerts();
  const classes = useStyles(ALERT_MESSAGE_DIALOG_CLASSES);
  return (
    <dialog
      className={classes}
      style={{
        backgroundColor: state.color || "black",
        [state.position]: 10,
      }}
      open={state.message !== null}
    >
      {state.message}
    </dialog>
  );
}
