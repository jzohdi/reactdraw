import React from "react";
import { Story } from "@storybook/react";
import ReactDraw from "../src/ReactDraw";
import { ActionTools, DrawingTools, ReactDrawProps } from "../src/types";

import {
  circleTool,
  squareTool,
  selectTool,
  freeDrawTool,
  diamondTool,
  straightLineTool,
  textAreaTool,
  eraseTool,
  undoTool,
  redoTool,
  trashTool,
  duplicateTool,
  bringBackTool,
  bringForwardTool,
  ColorStyle,
  BackgroundStyle,
  LineWidthStyle,
  OpacityStyle,
  arrowTool,
} from "../src";

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
  textAreaTool,
  arrowTool,
  eraseTool,
];

const bottomBarTools: ActionTools[] = [
  undoTool,
  redoTool,
  trashTool,
  duplicateTool,
  bringBackTool,
  bringForwardTool,
];

export const DefaultLayoutWithoutChildren = Template.bind({});

DefaultLayoutWithoutChildren.args = {
  topBarTools,
  bottomBarTools,
  shouldSelectAfterCreate: true,
  styleComponents: {
    color: { order: 2, component: ColorStyle },
    background: { order: 3, component: BackgroundStyle },
    lineWidth: { order: 1, component: LineWidthStyle },
    opacity: { order: 0, component: OpacityStyle },
  },
};

export const HideTopAndBottomBar = Template.bind({});
HideTopAndBottomBar.args = {
  topBarTools: [freeDrawTool],
  hideTopBar: true,
  bottomBarTools: [],
  hideBottomBar: true,
  shouldSelectAfterCreate: false,
  shouldKeepHistory: false,
};

export const DefaultLayoutWithChildren = Template.bind({});

DefaultLayoutWithChildren.args = {
  topBarTools,
  bottomBarTools,
  shouldSelectAfterCreate: true,
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
  shouldSelectAfterCreate: true,
  children: (
    <div>
      <p> hello world</p>
    </div>
  ),
  layout: "fit",
};
