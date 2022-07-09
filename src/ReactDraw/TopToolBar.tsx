import React from "react";
import ToolIconWrapper from "./ToolIconWrapper";
import styled from "styled-components";
import { COLORS } from "../constants";

type TopBarTool = {
  icon: JSX.Element;
  id: string;
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
  return (
    <TopBarContainer>
      {tools.map((tool) => {
        return (
          <ToolIconWrapper
            key={tool.id}
            selected={tool.id === currentTool}
            onSelect={() => onSelectTool(tool.id)}
          >
            {tool.icon}
          </ToolIconWrapper>
        );
      })}
    </TopBarContainer>
  );
}
