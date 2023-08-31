import React, {
  CSSProperties,
  DetailedHTMLProps,
  HTMLAttributes,
  forwardRef,
} from "react";
import { LayoutOption, ReactChild } from "../types";

export type ReactDrawContainerProps = {
  children: ReactChild;
  layout: LayoutOption;
  style?: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
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
  return {
    width: layout.width,
    height: layout.width,
  };
}

const defaultStyles: CSSProperties = {
  boxShadow: "#000000 0px 1px 3px 0px",
  borderRadius: 4,
  //   overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  position: "relative",
  fontFamily: "sans-serif",
};

export default forwardRef<HTMLDivElement, ReactDrawContainerProps>(
  function Container({ children, layout, style }, ref) {
    const styles = getStyles(layout);
    let combinedStyles: CSSProperties = {
      ...defaultStyles,
      ...styles,
    };
    if (style !== undefined) {
      combinedStyles = {
        ...combinedStyles,
        ...style,
      };
    }
    return (
      <div
        style={
          combinedStyles as DetailedHTMLProps<
            HTMLAttributes<HTMLDivElement>,
            HTMLDivElement
          >
        }
        ref={ref}
      >
        {children}
      </div>
    );
  }
);
