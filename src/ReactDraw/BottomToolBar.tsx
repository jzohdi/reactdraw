import { MenuIcon, PaletteBoldIcon } from "@jzohdi/jsx-icons";
import React, { useState } from "react";
import styled, { css } from "styled-components";
import ToolTip from "../components/ToolTip";
import { BPmd, COLORS } from "../constants";
import {
  ActionTools,
  BottomToolDisplayMap,
  DisplayMode,
  MenuComponent,
  ReactChild,
  ReactDrawContext,
  StringObject,
  StyleComponents,
  UpdateStyleFn,
} from "../types";
import StylesMenu from "./StylesMenu";

export type BottomToolBarProps = {
  tools: ActionTools[];
  displayMap: BottomToolDisplayMap;
  dispatch: (fn: (ctx: ReactDrawContext) => void) => void;
  stylesMenu: {
    getEditProps: () => StringObject;
    styleComponents?: StyleComponents;
    onUpdateStyle: UpdateStyleFn;
  };
  children: ReactChild;
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
  position: relative;
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
          stroke: white;
        }
      `;
    }
    return css``;
  }}
`;

const MenuContainer = styled.div`
  position: absolute;
  left: 0;
  padding: 15px;
  border: 1px solid ${COLORS.primary.main};
  z-index: 1000;
  background-color: white;
  border-radius: 0px 5px 0px 0px;
  @media only screen and (min-width: ${BPmd}px) {
    bottom: 40px;
  }
  @media only screen and (max-width: ${BPmd}px) {
    bottom: 30px;
  }
`;

type MenuKeys = "styles" | "menu" | null;

export function BottomToolBar({
  tools,
  displayMap,
  dispatch,
  stylesMenu,
  children,
}: BottomToolBarProps) {
  //   console.log(displayMap);
  const [menuOpen, setMenuOpen] = useState<MenuKeys>(null);

  const handleToggleMenu = (key: MenuKeys) => {
    if (key === menuOpen) {
      return setMenuOpen(null);
    }
    return setMenuOpen(key);
  };

  const getPosition = (tool: ActionTools, index: number) => {
    if (!tool.tooltip) {
      return { top: "", left: "" };
    }
    if (index <= tools.length / 2) {
      return { top: "-35px", left: "0" };
    }
    return { top: "-35px", left: `-${tool.tooltip.length * 3}px` };
  };

  const hasStyleMenu =
    !!stylesMenu.styleComponents && !isObjEmpty(stylesMenu.styleComponents);
  const hasMenu = !!children && React.Children.count(children) > 0;

  return (
    <>
      {menuOpen === "styles" && (
        <MenuContainer>
          <StylesMenu {...stylesMenu} />
        </MenuContainer>
      )}
      {menuOpen === "menu" && <MenuContainer>{children}</MenuContainer>}
      <BottomBarContainer>
        {hasMenu && (
          <ToolTip text="Menu" top="-40px" left="10px">
            <MenuButton
              onClick={() => handleToggleMenu("menu")}
              open={menuOpen === "menu"}
            >
              <MenuIcon size={20} />
            </MenuButton>
          </ToolTip>
        )}
        {hasStyleMenu && (
          <ToolTip text="Styles" top="-40px" left="10px">
            <MenuButton
              onClick={() => handleToggleMenu("styles")}
              open={menuOpen === "styles"}
            >
              <PaletteBoldIcon size={20} />
            </MenuButton>
          </ToolTip>
        )}
        {tools.map((tool, i) => {
          const toolId = tool.id;
          const toolDisplayMode = displayMap.get(toolId) || "hide";
          return (
            <ToolTip
              key={tool.id}
              text={tool.tooltip}
              {...getPosition(tool, i)}
              disabled={toolDisplayMode === "disabled"}
            >
              <BottomToolButton
                disabled={toolDisplayMode === "disabled"}
                mode={toolDisplayMode}
                onClick={() => dispatch(tool.handleContext)}
              >
                {tool.icon}
              </BottomToolButton>
            </ToolTip>
          );
        })}
      </BottomBarContainer>
    </>
  );
}
function isObjEmpty(obj: { [key: string]: any }): boolean {
  for (var _x in obj) {
    return false;
  }
  return true;
}
