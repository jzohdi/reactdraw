import React from "react";
import { Story } from "@storybook/react";
import ReactDraw from "../src/ReactDraw";
import {
  ActionTools,
  DrawingTools,
  ReactDrawInnerProps,
  ReactDrawProps,
} from "../src/types";

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
  ClearAllButton,
  FontSizeStyle,
} from "../src";

const AbsoluteLayout = { width: 500, height: 500 };
const layoutOptions = {
  fit: "fit",
  default: "default",
  AbsoluteLayout,
};
export default {
  title: "ReactDraw",
  component: ReactDraw,
  argTypes: {
    topBarTools: {
      type: { name: "object", required: true },
      defaultValue: null,
      description:
        "Drawing tools that will be displayed at the top of the canvas and can be selected if they have an icon property. These tools are of type `DrawingTools`. Not implementing an icon on the tool can be useful if you want a tool in the background that can still handle object updates.",
      control: {
        type: "object",
      },
    },
    layout: {
      options: Object.keys(layoutOptions),
      mapping: layoutOptions,
      description:
        "if default sets absolute size of width: 500, height: 500. fit will simply wrap the children to <ReactDraw>{children}</ReactDraw>. layout can also be passed an object of { width: number, height: number }",
      defaultValue: "default",
      control: {
        type: "select",
        labels: {
          default: "default",
          fit: "fit",
          AbsoluteLayout: "{ width: 500, height: 500 }",
        },
      },
    },
  },
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

export const DefaultLayoutAllTools = Template.bind({});

DefaultLayoutAllTools.args = {
  topBarTools,
  bottomBarTools,
  shouldSelectAfterCreate: true,
  styleComponents: {
    color: { order: 3, component: ColorStyle },
    background: { order: 4, component: BackgroundStyle },
    lineWidth: { order: 1, component: LineWidthStyle },
    opacity: { order: 0, component: OpacityStyle },
    fontSize: { order: 2, component: FontSizeStyle },
  },
  menuComponents: [ClearAllButton],
};

export const FreeDrawOnly = Template.bind({});
FreeDrawOnly.args = {
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

export const CustomizeStyles = Template.bind({});

CustomizeStyles.args = {
  topBarTools,
  bottomBarTools,
  shouldKeepHistory: true,
  shouldSelectAfterCreate: true,
  styles: {
    toolIconWrapper: {
      "&:hover": {
        backgroundColor: "red",
      },
    },
    bottomToolButton: {
      '&[data-disabled="false"]:hover': {
        backgroundColor: "black",
      },
      '&[data-disabled="false"]:hover > svg path': {
        fill: "white",
        stroke: "white",
      },
    },
  },
};

CustomizeStyles.parameters = {
  docs: {
    source: {
      code: `
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
	ClearAllButton,
	FontSizeStyle,
} from "../src";

export default function ReactDrawWithCustomStyles() {
	return (
		<ReactDraw
			topBarTools={[ 
				selectTool,
				freeDrawTool,
				squareTool,
				circleTool,
				diamondTool,
				straightLineTool,
				textAreaTool,
				arrowTool,
				eraseTool
			]}
			bottomBarTools={[
				undoTool,
				redoTool,
				trashTool,
				duplicateTool,
				bringBackTool,
				bringForwardTool
			]}
			shouldKeepHistory={true}
			shouldSelectAfterCreate={true}
			styles={{
				toolIconWrapper: {
					"&:hover": {
					backgroundColor: "red",
					},
				},
				bottomToolButton: {
					'&[data-disabled="false"]:hover': {
						backgroundColor: "black",
					},
					'&[data-disabled="false"]:hover > svg path': {
						fill: "white",
						stroke: "white",
					},
				},				
			}}
		/> 
	)
}
`,
    },
    language: "tsx",
    type: "auto",
  },
};
