import React from "react";
import ToolIconWrapper from "./ToolIconWrapper";
import styled from "styled-components";
import { COLORS } from "../constants";
// import ToolTip from "../components/ToolTip";
import ToolTip from "../Alerts/ToolTip";

type TopBarTool = {
  icon: JSX.Element;
  id: string;
  tooltip?: string;
};

export type TopToolBarProps = {
  tools: TopBarTool[];
  onSelectTool: (id: string) => void;
  currentTool: string;
};

const TopBarContainer = styled.div`
  display: flex;
  background-color: ${COLORS.primary.light};
  z-index: 1000;
  width: 100%;
  overflow-x: auto;
  /* Firefox */
  * {
    scrollbar-width: none;
    scrollbar-color: ${COLORS.primary.main} #e2ecf5;
  }

  /* Chrome, Edge, and Safari */
  &::-webkit-scrollbar {
    height: 10px;
  }

  &::-webkit-scrollbar-track {
    background: #e2ecf5;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #035195;
    border-radius: 10px;
    border: 3px none #ffffff;
  }
  &::-webkit-scrollbar-thumb:hover {
    background-color: #00294d;
  }
`;

export function TopToolBar({
  tools,
  onSelectTool,
  currentTool,
}: TopToolBarProps) {
  const getPosition = (tool: TopBarTool, index: number) => {
    if (!tool.tooltip) {
      return { top: "", left: "" };
    }
    if (index <= tools.length / 2) {
      return { top: "50px", left: "0" };
    }
    return { top: "50px", left: `-${tool.tooltip.length * 3}px` };
  };
  return (
    <TopBarContainer>
      {tools.map((tool, i) => {
        const tooltip = tool.tooltip;
        return (
          <ToolTip text={tooltip} position="top" key={tool.id}>
            <ToolIconWrapper
              selected={tool.id === currentTool}
              onSelect={() => onSelectTool(tool.id)}
            >
              {tool.icon}
            </ToolIconWrapper>
          </ToolTip>
        );
      })}
    </TopBarContainer>
  );
}
