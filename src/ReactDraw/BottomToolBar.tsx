import { MenuIcon } from "@jzohdi/jsx-icons";
import React, { useState } from "react";
import styled, { css } from "styled-components";
import { BPmd, COLORS } from "../constants";
import {
  ActionTools,
  BottomToolDisplayMap,
  DisplayMode,
  ReactChild,
  ReactDrawContext,
} from "../types";

export type BottomToolBarProps = {
  tools: ActionTools[];
  displayMap: BottomToolDisplayMap;
  children: ReactChild;
  dispatch: (fn: (ctx: ReactDrawContext) => void) => void;
};

const BottomBarContainer = styled.div`
  display: flex;
  background-color: ${COLORS.primary.light};
  z-index: 1000;
`;

type BottomToolButtonProps = {
  mode: DisplayMode;
};
const BottomToolButton = styled.button<BottomToolButtonProps>`
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
  ${(props) => {
    if (props.mode === "hide") {
      return css`
        display: none;
      `;
    }
    if (props.disabled) {
      return css`
        cursor: not-allowed;
        background-color: white;
        > svg path {
          fill: lightgrey;
          stroke: lightgrey;
        }
      `;
    }
    return css`
      &:hover {
        background-color: ${COLORS.grey.light};
      }
      display: inline-block;
    `;
  }}
`;

type MenuButtonProps = { open: boolean };

const MenuButton = styled.button<MenuButtonProps>`
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
    background-color: ${COLORS.grey.light};
  }
  ${(props) => {
    if (props.open) {
      return css`
        background-color: ${COLORS.primary.main} !important;
        > svg path {
          fill: white;
        }
      `;
    }
    return css``;
  }}
`;

export function BottomToolBar({
  tools,
  displayMap,
  dispatch,
  children,
}: BottomToolBarProps) {
  const [showMenu, setShowMenu] = useState(false);
  return (
    <BottomBarContainer>
      <MenuButton onClick={() => setShowMenu(!showMenu)} open={showMenu}>
        <MenuIcon size={30} />
      </MenuButton>
      {tools.map((tool) => {
        const toolId = tool.id;
        const toolDisplayMode = displayMap.get(toolId) || "hide";
        return (
          <BottomToolButton
            disabled={toolDisplayMode === "disabled"}
            key={tool.id}
            mode={toolDisplayMode}
            onClick={() => dispatch(tool.handleContext)}
          >
            {tool.icon}
          </BottomToolButton>
        );
      })}
    </BottomBarContainer>
  );
}
