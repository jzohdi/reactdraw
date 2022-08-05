import React from "react";
import ToolIconWrapper from "./ToolIconWrapper";
import ToolTip from "../Alerts/ToolTip";
import { useStyles } from "../Styles/hooks";
import { TOP_BAR_CONTAINER_CLASSES } from "../constants";

type TopBarTool = {
  icon?: JSX.Element;
  id: string;
  tooltip?: string;
};

export type TopToolBarProps = {
  tools: TopBarTool[];
  onSelectTool: (id: string) => void;
  currentTool: string;
};

export function TopToolBar({
  tools,
  onSelectTool,
  currentTool,
}: TopToolBarProps) {
  const classes = useStyles(TOP_BAR_CONTAINER_CLASSES);

  return (
    <div className={classes}>
      {tools
        .filter((tool) => !!tool.icon)
        .map((tool, i) => {
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
    </div>
  );
}
