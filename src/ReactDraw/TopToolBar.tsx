import React from "react";
import ToolIconWrapper from "./ToolIconWrapper";
import styled from "styled-components";
import { COLORS } from "../constants";
import ToolTip from "../components/ToolTip";

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
          <ToolTip text={tooltip} {...getPosition(tool, i)} key={tool.id}>
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
