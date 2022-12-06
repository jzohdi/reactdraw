import React, { useRef } from "react";
import { Story } from "@storybook/react";
import ReactDraw from "../src/ReactDraw";
import {
  ActionTools,
  Deserializers,
  DrawingTools,
  MenuComponent,
  ReactDrawContext,
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
  serializeSquare,
  deserializeSquare,
  serializeCircle,
  deserializeCircle,
  serializeDiamond,
  deserializeDiamond,
  serializeLine,
  deserializeLine,
  serializeText,
  deserializeTextArea,
  serializeArrow,
  deserializeArrow,
  getViewCenterPoint,
  createCircle,
  createImage,
  selectAll,
  duplicateSelectedObjects,
  bringSelectedBack,
  moveSelectedForward,
  deletedSelected,
  getSelectedObjects,
} from "../src";
import { DownloadIcon } from "@jzohdi/jsx-icons";
import { useState } from "react";

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

const circleToolCopy = Object.assign({}, circleTool);
delete circleTool.icon;
const imageToolId = "my-image-tool-id";
const selectToolCopy = Object.assign({}, selectTool);
const imageTool: DrawingTools = {
  id: imageToolId,
  onDrawEnd() {},
  onDrawing() {},
  onDrawStart() {},
  onResize() {},
};

function ControlFromExternalWrapper({ ...args }: any) {
  const contextGetterRef = useRef<() => ReactDrawContext>();
  const [numSelected, setNumeSelected] = useState(0);

  const setContextGetter = (contextGetter: () => ReactDrawContext) => {
    contextGetterRef.current = contextGetter;
  };

  const handleGetCtx = () => {
    const ctxGetter = contextGetterRef.current;
    if (!ctxGetter) {
      throw new Error("Ctx getter not set");
    }
    return ctxGetter();
  };

  const handleSelectedToolEvent = (event: string) => {
    console.log(event);
    const ctx = handleGetCtx();
    const selectedObjects = getSelectedObjects(ctx);
    setNumeSelected(selectedObjects.length);
  };

  const handleClickAddCircle = () => {
    const ctx = handleGetCtx();
    const centerPoint = getViewCenterPoint(ctx);
    createCircle(ctx, {
      pointA: centerPoint,
      pointB: [centerPoint[0] + 100, centerPoint[1] + 100],
      toolId: circleTool.id,
    });
  };

  const handleClickAddImage = () => {
    const ctx = handleGetCtx();
    const centerPoint = getViewCenterPoint(ctx);
    const loadingEle = document.createElement("p");
    loadingEle.innerHTML = " loading...";
    createImage(ctx, {
      pointA: centerPoint,
      pointB: [centerPoint[0] + 100, centerPoint[1] + 100],
      toolId: imageTool.id,
      url: "https://picsum.photos/200",
      showLoading: true,
      loadingElement: loadingEle,
    });
  };

  const handleSelectAll = () => {
    const ctx = handleGetCtx();
    selectAll(ctx);
  };

  const duplicateSelected = () => {
    const ctx = handleGetCtx();
    duplicateSelectedObjects(ctx);
  };

  const moveSelectedBack = () => {
    const ctx = handleGetCtx();
    bringSelectedBack(ctx);
  };

  const moveForward = () => {
    const ctx = handleGetCtx();
    moveSelectedForward(ctx);
  };

  const handleDelete = () => {
    const ctx = handleGetCtx();
    deletedSelected(ctx);
  };

  if (selectToolCopy.subscribe) {
    selectToolCopy.subscribe(handleSelectedToolEvent);
  }

  return (
    <div>
      <p>
        You can control the react draw context from outside of the ReactDraw
        component
      </p>
      <div style={{ display: "flex", gap: 10 }}>
        <div
          style={{ paddingTop: 10, display: "flex", flexDirection: "column" }}
        >
          <div>Num Selected Items: {numSelected}</div>
          <button onClick={handleClickAddCircle}>Add Circle</button>
          <button onClick={handleClickAddImage}>Add Picture</button>
          <button onClick={handleSelectAll}>Select All</button>
          <button onClick={duplicateSelected}>Duplicate Selected</button>
          <button onClick={moveSelectedBack}>Move Selected Back</button>
          <button onClick={moveForward}>Move Selected Forward</button>
          <button onClick={handleDelete}>Delete Selected</button>
        </div>
        <ReactDraw {...args} contextGetter={setContextGetter} />
      </div>
    </div>
  );
}

const ExternalControlsTemplate: Story<ReactDrawProps> = (args) => (
  <ControlFromExternalWrapper {...args} />
);

export const ExternalControls = ExternalControlsTemplate.bind({});

ExternalControls.args = {
  topBarTools: [selectTool, circleToolCopy, imageTool],
  shouldKeepHistory: false,
  shouldSelectAfterCreate: true,
  hideTopBar: true,
};

ExternalControls.parameters = {
  docs: {
    source: {
      code: `
const circleToolCopy = Object.assign({}, circleTool);
delete circleTool.icon;
const imageToolId = "my-image-tool-id";

const imageTool: DrawingTools = {
	id: imageToolId,
	onDrawEnd() {},
	onDrawing() {},
	onDrawStart() {},
	onResize() {},
};

function ControlFromExternalWrapper({ ...args }: any) {
	const contextGetterRef = useRef<() => ReactDrawContext>();

	const setContextGetter = (contextGetter: () => ReactDrawContext) => {
		contextGetterRef.current = contextGetter;
	};

	const handleClickAddCircle = () => {
		const ctxGetter = contextGetterRef.current;
		if (!ctxGetter) {
			throw new Error("Ctx getter not set");
		}
		const ctx = ctxGetter();
		const centerPoint = getViewCenterPoint(ctx);
		createCircle(ctx, {
			pointA: centerPoint,
			pointB: [centerPoint[0] + 100, centerPoint[1] + 100],
			toolId: circleTool.id,
		});
	};

	const handleClickAddImage = () => {
		const ctxGetter = contextGetterRef.current;
		if (!ctxGetter) {
			throw new Error("Ctx getter not set");
		}
		const ctx = ctxGetter();
		const centerPoint = getViewCenterPoint(ctx);
		const loadingEle = document.createElement("p");
		loadingEle.innerHTML = " loading...";
		createImage(ctx, {
			pointA: centerPoint,
			pointB: [centerPoint[0] + 100, centerPoint[1] + 100],
			toolId: imageTool.id,
			url: "https://picsum.photos/200",
			showLoading: true,
			loadingElement: loadingEle,
		});
	};

  const handleSelectAll = () => {
    const ctxGetter = contextGetterRef.current;
    if (!ctxGetter) {
      throw new Error("Ctx getter not set");
    }
    const ctx = ctxGetter();
    selectAll(ctx);
  };

  const duplicateSelected = () => {
    const ctxGetter = contextGetterRef.current;
    if (!ctxGetter) {
      throw new Error("Ctx getter not set");
    }
    const ctx = ctxGetter();
    duplicateSelectedObjects(ctx);
  };

  const moveSelectedBack = () => {
    const ctxGetter = contextGetterRef.current;
    if (!ctxGetter) {
      throw new Error("Ctx getter not set");
    }
    const ctx = ctxGetter();
    bringSelectedBack(ctx);
  };

  const moveForward = () => {
    const ctxGetter = contextGetterRef.current;
    if (!ctxGetter) {
      throw new Error("Ctx getter not set");
    }
    const ctx = ctxGetter();
    moveSelectedForward(ctx);
  };

  const handleDelete = () => {
    const ctxGetter = contextGetterRef.current;
    if (!ctxGetter) {
      throw new Error("Ctx getter not set");
    }
    const ctx = ctxGetter();
    deletedSelected(ctx);
  };

  return (
    <div>
      <p>
        You can control the react draw context from outside of the ReactDraw
        component
      </p>
      <div style={{ display: "flex", gap: 10 }}>
        <div
          style={{ paddingTop: 10, display: "flex", flexDirection: "column" }}
        >
          <button onClick={handleClickAddCircle}>Add Circle</button>
          <button onClick={handleClickAddImage}>Add Picture</button>
          <button onClick={handleSelectAll}>Select All</button>
          <button onClick={duplicateSelected}>Duplicate Selected</button>
          <button onClick={moveSelectedBack}>Move Selected Back</button>
          <button onClick={moveForward}>Move Selected Forward</button>
          <button onClick={handleDelete}>Delete Selected</button>
        </div>
        <ReactDraw {...args} contextGetter={setContextGetter} />
      </div>
    </div>
  );
}	
			`,
    },
    language: "tsx",
    type: "auto",
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

const serializers: Serializers = {
  [freeDrawTool.id]: serializeFreeDraw,
  [squareTool.id]: serializeSquare,
  [circleTool.id]: serializeCircle,
  [diamondTool.id]: serializeDiamond,
  [straightLineTool.id]: serializeLine,
  [textAreaTool.id]: serializeText,
  [arrowTool.id]: serializeArrow,
};

const deserializers: Deserializers = {
  [freeDrawTool.id]: deserializeFreeDraw,
  [squareTool.id]: deserializeSquare,
  [circleTool.id]: deserializeCircle,
  [diamondTool.id]: deserializeDiamond,
  [straightLineTool.id]: deserializeLine,
  [textAreaTool.id]: deserializeTextArea,
  [arrowTool.id]: deserializeArrow,
};

const inputId = "my-id";

const SaveCanvas: MenuComponent = ({ getContext }) => {
  const classes = useStyles("saveCanvasComponent");
  const ref = useRef<HTMLButtonElement>(null);

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

SaveAndLoadJson.args = {
  topBarTools,
  shouldSelectAfterCreate: true,
  menuComponents: [SaveCanvas, ClearAllButton],
  shouldKeepHistory: false,
  onLoad(ctx) {
    const savedData = localStorage.getItem("react-draw-saved-data");
    if (savedData) {
      deserializeData(savedData, deserializers, ctx);
    }
  },
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
	serializeSquare,
	deserializeSquare,
	serializeCircle,
	deserializeCircle,
	serializeDiamond,
	deserializeDiamond,
	serializeLine,
	deserializeLine,
	serializeText,
	deserializeTextArea,
	serializeArrow,
	deserializeArrow,
} from "../src";
import { DownloadIcon } from "@jzohdi/jsx-icons";

const serializers: Serializers = {
	[freeDrawTool.id]: serializeFreeDraw,
	[squareTool.id]: serializeSquare,
	[circleTool.id]: serializeCircle,
	[diamondTool.id]: serializeDiamond,
	[straightLineTool.id]: serializeLine,
	[textAreaTool.id]: serializeText,
	[arrowTool.id]: serializeArrow
};

const deserializers: Deserializers = {
	[freeDrawTool.id]: deserializeFreeDraw,
	[squareTool.id]: deserializeSquare,
	[circleTool.id]: deserializeCircle,
	[diamondTool.id]: deserializeDiamond,
	[straightLineTool.id]: deserializeLine,
	[textAreaTool.id]: deserializeTextArea,
	[arrowTool.id]: deserializeArrow
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


function MyComponent() {
	return <ReactDraw 
			topBarTools={topBarTools}
			shouldSelectAfterCreate={true}
			menuComponents={[SaveCanvas, ClearAllButton]}
			shouldKeepHistory={false}
			styleComponents={{
				color: { order: 3, component: ColorStyle },
				background: { order: 4, component: BackgroundStyle },
				lineWidth: { order: 1, component: LineWidthStyle },
				opacity: { order: 0, component: OpacityStyle },
				fontSize: { order: 2, component: FontSizeStyle },
			}}
			styles={{
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
					border: \`1px solid \${COLORS.primary.main}\`,
					"&:hover": {
						backgroundColor: COLORS.primary.light,
					},
				}}
		/>
}
			`,
    },
  },
};
