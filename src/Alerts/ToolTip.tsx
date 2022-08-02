import React, { useEffect, useRef } from "react";
// import { ReactChild } from "../types";
import { useAlerts } from "./hooks";

type ToolTipProps = {
  children: React.ReactElement<any, string | React.JSXElementConstructor<any>>;
  text?: string;
  position: "top" | "bottom";
  disabled?: boolean;
};

//TODO: make label on mobile?
export default function ToolTip({
  children,
  text,
  position,
  disabled,
}: ToolTipProps): JSX.Element {
  const [state, setState] = useAlerts();

  if (!children) {
    return <></>;
  }
  if (!text) {
    return <>{children}</>;
  }
  const handleMouseEnter = () => {
    if (!disabled && !isTouchDevice()) {
      setState({ ...state, message: text, position: position });
    }
  };
  const handleMouseLeave = () => {
    if (state.message !== null) {
      setState({ ...state, message: null });
    }
  };
  return (
    <span
      onMouseOver={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      aria-label={`label mouse listener ${text}`}
    >
      {children}
    </span>
  );
}

function isTouchDevice() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0;
}
