import React from "react";
import ToolIconWrapper from "./ToolIconWrapper";
import styled from "styled-components";

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
