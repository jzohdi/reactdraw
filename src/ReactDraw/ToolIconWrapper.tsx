import React from "react";
import { ReactChild } from "../types";
import { useStyles } from "../Styles/hooks";
import { TOOL_ICON_WRAPPER_CLASSES } from "../constants";

type ToolIconWrapper = {
  children: ReactChild;
  selected?: boolean;
  onSelect?: () => void;
};

export default function ToolIconWrapper({
  children,
  selected,
  onSelect,
}: ToolIconWrapper): JSX.Element {
  const classes = useStyles(TOOL_ICON_WRAPPER_CLASSES);
  return (
    <button data-selected={selected} className={classes} onClick={onSelect}>
      {children}
    </button>
  );
}
