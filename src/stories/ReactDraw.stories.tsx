import React from "react";
import { Story } from "@storybook/react";
import ReactDraw from "../ReactDraw";
import { DrawingTools, ReactDrawProps } from "../types";

import {
  circleTool,
  squareTool,
  selectTool,
  freeDrawTool,
  diamondTool,
  straightLineTool,
  //   arrowTool,
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
];

export const DefaultLayoutWithoutChildren = Template.bind({});

DefaultLayoutWithoutChildren.args = {
  topBarTools,
};

export const HideTopBar = Template.bind({});
HideTopBar.args = {
  topBarTools: [freeDrawTool],
  hideTopBar: true,
};

export const DefaultLayoutWithChildren = Template.bind({});

DefaultLayoutWithChildren.args = {
  topBarTools,
  children: (
    <div>
      <p> hello world</p>
    </div>
  ),
};

export const FitLayoutWithChildren = Template.bind({});

FitLayoutWithChildren.args = {
  topBarTools,
  children: (
    <div>
      <p> hello world</p>
    </div>
  ),
  layout: "fit",
};
