import React from "react";
import ToolIconWrapper from "./ToolIconWrapper";
import ToolTip from "../Alerts/ToolTip";
import { useStyles } from "../Styles/hooks";
import { TOP_BAR_CONTAINER_CLASSES } from "../constants";
import {
  ActionTools,
  DrawingTools,
  ReactDrawContext,
  isActionTool,
  isDrawingTool,
} from "../types";

type TopBarTool = {
  icon?: JSX.Element;
  id: string;
  tooltip?: string;
};

export type TopToolBarProps = {
  tools: TopBarTool[];
  onSelectDrawingTool: (drawingTool: DrawingTools) => void;
  onClickActionTool: (fn: (ctx: ReactDrawContext) => void) => void;
  currentTool: string;
};

export function TopToolBar({
  tools,
  onSelectDrawingTool,
  onClickActionTool,
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
                onSelect={() => {
                  if (isDrawingTool(tool)) {
                    return onSelectDrawingTool(tool);
                  } else if (isActionTool(tool)) {
                    return onClickActionTool(tool.handleContext);
                  }
                }}
              >
                {tool.icon}
              </ToolIconWrapper>
            </ToolTip>
          );
        })}
    </div>
  );
}
