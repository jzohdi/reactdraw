import React from "react";
import { Story } from "@storybook/react";
import ReactDraw from "../ReactDraw";
import { ActionTools, DrawingTools, ReactDrawProps } from "../types";

import {
  circleTool,
  squareTool,
  selectTool,
  freeDrawTool,
  diamondTool,
  straightLineTool,
  //   arrowTool,
  textAreaTool,
  eraseTool,
  undoTool,
  redoTool,
} from "../../src";

export default {
  title: "ReactDraw",
  component: ReactDraw,
};

const Template: Story<ReactDrawProps> = (args) => <ReactDraw {...args} />;

const topBarTools: DrawingTools[] = [
  selectTool,
  freeDrawTool,
  squareTool,
  circleTool,
  diamondTool,
  straightLineTool,
  //   arrowTool,
  textAreaTool,
  eraseTool,
];

const bottomBarTools: ActionTools[] = [undoTool, redoTool];

export const DefaultLayoutWithoutChildren = Template.bind({});

DefaultLayoutWithoutChildren.args = {
  topBarTools,
  bottomBarTools,
};

export const HideTopAndBottomBar = Template.bind({});
HideTopAndBottomBar.args = {
  topBarTools: [freeDrawTool],
  hideTopBar: true,
  bottomBarTools: [],
  hideBottomBar: true,
};

export const DefaultLayoutWithChildren = Template.bind({});

DefaultLayoutWithChildren.args = {
  topBarTools,
  bottomBarTools,
  children: (
    <div>
      <p> hello world</p>
    </div>
  ),
};

export const FitLayoutWithChildren = Template.bind({});

FitLayoutWithChildren.args = {
  topBarTools,
  bottomBarTools,
  children: (
    <div>
      <p> hello world</p>
    </div>
  ),
  layout: "fit",
};
