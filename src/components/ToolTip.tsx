import React, { useState, useEffect, useRef } from "react";
import styled, { css } from "styled-components";
import { ReactChild } from "../types";

type ToolTipProps = {
  children: ReactChild;
  text?: string;
  top: string;
  left: string;
  disabled?: boolean;
};

const ToolTipContainer = styled.span`
  position: relative;
  display: inline-block;
`;

const ToolTipText = styled.span<ToolTipStyledProps>`
  visibility: hidden;
  /* min-width: 120px; */
  white-space: nowrap;
  background-color: black;
  color: #fff;
  text-align: center;
  border-radius: 6px;
  padding: 5px 10px;
  position: absolute;
  z-index: 1000;
  ${(props) => {
    console.log(props.open && !props.disabled);
    if (props.open && !props.disabled) {
      return css`
        visibility: visible;
        top: ${props.top};
        left: ${props.left};
      `;
    }
    return css`
      visibility: hidden;
      top: ${props.top};
      left: ${props.left};
    `;
  }}
`;

type ToolTipStyledProps = {
  open: boolean;
  disabled?: boolean;
  top: string;
  left: string;
};

export default function ToolTip({
  children,
  text,
  top,
  left,
  disabled,
}: ToolTipProps): JSX.Element {
  const [open, setOpen] = useState<boolean>(false);
  const containerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      return;
    }
    function showToolTip() {
      setOpen(true);
    }
    function hideToolTip() {
      setOpen(false);
    }
    // function showTouchTip() {
    //   setOpen(true);
    //   setTimeout(() => {
    //     setOpen(false);
    //   }, 1000);
    // }
    container.addEventListener("mouseover", showToolTip);
    container.addEventListener("mouseleave", hideToolTip);
    // container.addEventListener("touchstart", showTouchTip);
    return () => {
      container.removeEventListener("mouseover", showToolTip);
      container.removeEventListener("mouseleave", hideToolTip);
      //   container.removeEventListener("touchstart", showTouchTip);
    };
  }, []);

  if (!text) {
    return <>{children}</>;
  }
  return (
    <ToolTipContainer ref={containerRef}>
      <ToolTipText open={open} left={left} top={top} disabled={disabled}>
        {text}
      </ToolTipText>
      {children}
    </ToolTipContainer>
  );
}
