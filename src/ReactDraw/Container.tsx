import React, { CSSProperties } from "react";
import { LayoutOption, ReactChild } from "../types";

export type ReactDrawContainerProps = {
  children: ReactChild;
  layout: LayoutOption;
};

const defaultWidth = 500;
const defaultHeight = 500;

function getStyles(layout: LayoutOption) {
  if (layout === "default") {
    return { width: defaultWidth, height: defaultHeight, maxWidth: "100%" };
  }
  if (layout === "fit") {
    return { maxWidth: "100%" };
  }
}

const defaultStyles: CSSProperties = {
  boxShadow: "#000000 0px 1px 3px 0px",
  borderRadius: 4,
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
};

export default function Container({
  children,
  layout,
}: ReactDrawContainerProps) {
  const styles = getStyles(layout);
  return <div style={{ ...defaultStyles, ...styles }}>{children}</div>;
}
