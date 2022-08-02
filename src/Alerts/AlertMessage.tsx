import React from "react";
import styled, { css } from "styled-components";
import { useAlerts } from "./hooks";

type DialogProps = {
  open: boolean;
  position: "top" | "bottom";
};

const Dialog = styled.dialog<DialogProps>`
  position: absolute;
  /* top: 10px; */
  white-space: nowrap;
  text-align: center;
  border-radius: 6px;
  padding: 5px 10px;
  ${(props) => {
    return css`
      ${props.position}: 10px
    `;
  }}
`;

export default function AlertMessage() {
  const [state] = useAlerts();
  return (
    <Dialog
      style={{
        backgroundColor: state.color || "black",
        color: "white",
      }}
      position={state.position}
      open={state.message !== null}
    >
      {state.message}
    </Dialog>
  );
}
