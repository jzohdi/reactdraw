import React, { useEffect, useRef } from "react";
import { Story } from "@storybook/react";
import ReactDraw from "../src/ReactDraw";
import {
  ActionTools,
  Deserializers,
  DrawingTools,
  MenuComponent,
  ReactDrawInnerProps,
  ReactDrawProps,
  Serializers,
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
  COLORS,
  serializeFreeDraw,
  deserializeFreeDraw,
  serializeObjects,
  deserializeData,
  useStyles,
} from "../src";
import { DownloadIcon } from "@jzohdi/jsx-icons";

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
DefaultLayoutAllTools.parameters = {
  docs: {
    source: {
      code: `
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
		eraseTool,		
	]}
	bottomBarTools={[
		undoTool,
		redoTool,
		trashTool,
		duplicateTool,
		bringBackTool,
		bringForwardTool,		
	]}
  shouldSelectAfterCreate={true}
  styleComponents={{
    color: { order: 3, component: ColorStyle },
    background: { order: 4, component: BackgroundStyle },
    lineWidth: { order: 1, component: LineWidthStyle },
    opacity: { order: 0, component: OpacityStyle },
    fontSize: { order: 2, component: FontSizeStyle },
  }}
  menuComponents={[ClearAllButton]}	
/>			
			`,
      language: "tsx",
      type: "auto",
    },
  },
};

export const FreeDrawOnly = Template.bind({});
FreeDrawOnly.args = {
  topBarTools: [freeDrawTool],
  // bottomBarTools: [],
  hideTopBar: true,
  hideBottomBar: true,
  shouldSelectAfterCreate: false,
  shouldKeepHistory: false,
};
FreeDrawOnly.parameters = {
  docs: {
    source: {
      code: `
<ReactDraw 
	topBarTools={[
		freeDrawTool
	]}
	shouldSelectAfterCreate={false}
	hideTopBar: true,
	hideBottomBar: true,
	shouldSelectAfterCreate: false,
	shouldKeepHistory: false,
/>
			`,
      language: "tsx",
      type: "auto",
    },
  },
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

DefaultLayoutWithChildren.parameters = {
  docs: {
    source: {
      code: `
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
		eraseTool,		
	]}
	bottomBarTools={[
		undoTool,
		redoTool,
		trashTool,
		duplicateTool,
		bringBackTool,
		bringForwardTool,		
	]}
	shouldSelectAfterCreate={true}
>
	<div>
		<p> hello world</p>
	</div>
</ReactDraw>				
			`,
      language: "tsx",
      type: "auto",
    },
  },
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

FitLayoutWithChildren.parameters = {
  docs: {
    source: {
      code: `
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
		eraseTool,		
	]}
	bottomBarTools={[
		undoTool,
		redoTool,
		trashTool,
		duplicateTool,
		bringBackTool,
		bringForwardTool,		
	]}
	shouldSelectAfterCreate={true}
	layout="fit"
>
	<div>
		<p> hello world</p>
	</div>
</ReactDraw>					
			`,
      language: "tsx",
      type: "auto",
    },
  },
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
      language: "tsx",
      type: "auto",
    },
  },
};

const inputId = "my-id";

const SaveCanvas: MenuComponent = ({ getContext }) => {
  const classes = useStyles("saveCanvasComponent");
  const ref = useRef<HTMLButtonElement>(null);

  // could also do a loading state
  useEffect(() => {
    const savedData = localStorage.getItem("react-draw-saved-data");
    if (savedData) {
      const ctx = getContext();
      deserializeData(savedData, deserializers, ctx);
    }
  }, []);

  const handleSaveCanvas = () => {
    const ctx = getContext();
    // collected serialization of each drowing object on the canvas
    const data = serializeObjects(serializers, ctx);
    // save the data where ever you'd like
    if (window) {
      window.localStorage.setItem("react-draw-saved-data", data);
    }
  };
  return (
    <button
      className={classes}
      id={inputId}
      onClick={handleSaveCanvas}
      ref={ref}
    >
      <div style={{ padding: "0px 5px", height: 15 }}>
        <DownloadIcon height={15} width={20} />
      </div>
      <label
        htmlFor={inputId}
        style={{ padding: "0px 10px", pointerEvents: "none" }}
      >
        Save Canvas
      </label>
    </button>
  );
};

export const SaveAndLoadJson = Template.bind({});

const serializers: Serializers = {
  [freeDrawTool.id]: serializeFreeDraw,
};

const deserializers: Deserializers = {
  [freeDrawTool.id]: deserializeFreeDraw,
};

SaveAndLoadJson.args = {
  topBarTools,
  shouldSelectAfterCreate: true,
  menuComponents: [SaveCanvas, ClearAllButton],
  shouldKeepHistory: false,
  styleComponents: {
    color: { order: 3, component: ColorStyle },
    background: { order: 4, component: BackgroundStyle },
    lineWidth: { order: 1, component: LineWidthStyle },
    opacity: { order: 0, component: OpacityStyle },
    fontSize: { order: 2, component: FontSizeStyle },
  },
  styles: {
    saveCanvasComponent: {
      width: 180,
      fontSize: 16,
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      borderRadius: 5,
      cursor: "pointer",
      padding: "7px 10px",
      backgroundColor: "white",
      marginBottom: 10,
      boxSizing: "border-box",
      border: `1px solid ${COLORS.primary.main}`,
      "&:hover": {
        backgroundColor: COLORS.primary.light,
      },
    },
  },
};

SaveAndLoadJson.parameters = {
  docs: {
    source: {
      code: ``,
    },
  },
};
