import React from "react";
import { Story } from "@storybook/react";
import ReactDraw from "../ReactDraw";
import { DrawingTools, ReactDrawProps } from "../types";
import freeDrawTool from "../FreeDrawTool";
import selectTool from "../SelectTool";
export default {
  title: "Example/ReactDraw",
  component: ReactDraw,
};

const Template: Story<ReactDrawProps> = (args) => <ReactDraw {...args} />;

const topBarTools: DrawingTools[] = [selectTool, freeDrawTool];

export const DefaultLayoutWithoutChildren = Template.bind({});

DefaultLayoutWithoutChildren.args = {
  topBarTools,
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
