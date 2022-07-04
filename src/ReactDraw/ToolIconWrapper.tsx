import React from "react";
import { ReactChild } from "./types";
import styled, { css } from "styled-components";
import { BPmd } from "../constants";

type ToolIconWrapper = {
  children: ReactChild;
  selected?: boolean;
  onSelect: () => void;
};

const Wrapper = styled.button<ToolIconWrapper>`
  display: flex;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  border: none;
  background-color: transparent;
  border-radius: 2px;
  transition: background-color 150ms ease-in-out;
  @media only screen and (min-width: ${BPmd}px) {
    width: 40px;
    height: 40px;
  }
  @media only screen and (max-width: ${BPmd}px) {
    width: 30px;
    height: 30px;
  }
  &:hover {
    background-color: #ececec;
  }
  ${(props) =>
    props.selected &&
    css`
      background-color: #228be6 !important;
      > svg path {
        fill: white;
      }
    `}
`;

export default function ToolIconWrapper({
  children,
  selected,
  onSelect,
}: ToolIconWrapper): JSX.Element {
  return (
    <Wrapper selected={selected} onSelect={onSelect}>
      {children}
    </Wrapper>
  );
}
