import { Story } from "@storybook/react";
import React, { ChangeEvent } from "react";
import {
  ReactDraw,
  selectTool,
  freeDrawTool,
  ClearAllButton,
  DrawingTools,
  MenuComponent,
  ReactDrawProps,
  COLORS,
  createNewObject,
  addObject,
  centerObject,
} from "../src";
import { PhotographBoldIcon } from "@jzohdi/jsx-icons";
import styled from "styled-components";

export default {
  title: "Customization Examples/Add Images To Canvas",
  //   component: ReactDraw,
};

const inputId = "my-button-id";
const imageToolId = "my-image-tool-id";

const imageTool: DrawingTools = {
  id: imageToolId,
  onDrawEnd() {},
  onDrawing() {},
  onDrawStart() {},
  onResize() {},
};

const topBarTools: DrawingTools[] = [selectTool, freeDrawTool, imageTool];

const maxWidth = 200;
const maxHeight = 200;

function getDimensions(img: HTMLImageElement) {
  const { naturalWidth, naturalHeight } = img;
  const ratio = naturalWidth / naturalHeight;
  if (naturalWidth > maxWidth) {
    return { width: maxWidth, height: maxWidth / ratio };
  }
  if (naturalHeight > maxHeight) {
    return { width: maxHeight * ratio, height: maxHeight };
  }
  return { width: naturalWidth, height: naturalHeight };
}

const StyledButton = styled.label`
  width: 180px;
  font-size: 16px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-radius: 5px;
  cursor: pointer;
  border: none;
  padding: 7px 10px;
  background-color: white;
  margin-bottom: 10px;
  box-sizing: border-box;
  border: 1px solid ${COLORS.primary.main};
  &:hover {
    background-color: ${COLORS.primary.light};
  }
`;
const AddImageMenuComponent: MenuComponent = ({ getContext }) => {
  const handleAddImage = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !files[0]) {
      return;
    }
    const ctx = getContext();
    const viewContainer = ctx.viewContainer;
    const { width, height } = viewContainer.getBoundingClientRect();
    const newData = createNewObject(ctx, [width / 2, height / 2], imageToolId);
    addObject(ctx, newData);
    const toUrl = URL.createObjectURL(files[0]);
    const img = new Image();
    img.style.width = "100%";
    img.style.height = "100%";
    img.onload = function () {
      newData.element = img;
      newData.container.div.appendChild(img);
      const { width, height } = getDimensions(img);
      centerObject(ctx, newData, width, height);
      if (ctx.shouldSelectAfterCreate) {
        ctx.selectObject(newData);
      }
    };
    img.src = toUrl;
  };
  return (
    <StyledButton htmlFor={inputId}>
      <div style={{ padding: "0px 10px 0px 5px", height: 20 }}>
        <PhotographBoldIcon height={15} width={20} />
      </div>
      <input
        id={inputId}
        style={{ display: "none" }}
        type="file"
        accept="jpg,png,jpeg"
        onChange={handleAddImage}
      />
      Add Image
    </StyledButton>
  );
};

const Template: Story<ReactDrawProps> = (args) => <ReactDraw {...args} />;

export const AddImagesToCanvas = Template.bind({});

AddImagesToCanvas.args = {
  topBarTools,
  shouldSelectAfterCreate: true,
  menuComponents: [AddImageMenuComponent, ClearAllButton],
  shouldKeepHistory: false,
};

AddImagesToCanvas.parameters = {
  docs: {
    source: {
      code: `
import {
	ReactDraw,
	selectTool,
	freeDrawTool,
	ClearAllButton,
	DrawingTools,
	MenuComponent,
	ReactDrawProps,
	COLORS,
	createNewObject,
	addObject,
	centerObject,
} from "@jzohdi/react-draw";
import { PhotographBoldIcon } from "@jzohdi/jsx-icons";
import styled from "styled-components";

const inputId = "my-button-id";
const imageToolId = "my-image-tool-id";

const imageTool: DrawingTools = {
  id: imageToolId,
  onDrawEnd() {},
  onDrawing() {},
  onDrawStart() {},
  onResize() {},
};

const topBarTools: DrawingTools[] = [selectTool, freeDrawTool, imageTool];

export default function ExampleProject() {

	return <ReactDraw 
		topBarTools={topBarTools}
		shouldSelectAfterCreate={true}
		menuComponents={[AddImageMenuComponent, ClearAllButton]}
		shouldKeepHistory={false}
		/>

}

function getDimensions(img: HTMLImageElement) {
  return { width: img.naturalWidth, height: img.naturalHeight };
}

const StyledButton = styled.label\`
  width: 180px;
  font-size: 16px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  border-radius: 5px;
  cursor: pointer;
  border: none;
  padding: 7px 10px;
  background-color: white;
  margin-bottom: 10px;
  box-sizing: border-box;
  border: 1px solid \${COLORS.primary.main};
  &:hover {
    background-color: \${COLORS.primary.light};
  }
\`;
const AddImageMenuComponent: MenuComponent = ({ getContext }) => {
  const handleAddImage = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || !files[0]) {
      return;
    }
    const ctx = getContext();
    const viewContainer = ctx.viewContainer;
    const { width, height } = viewContainer.getBoundingClientRect();
    const newData = createNewObject(ctx, [width / 2, height / 2], imageToolId);
    addObject(ctx, newData);
    const toUrl = URL.createObjectURL(files[0]);
    const img = new Image();
    img.style.width = "100%";
    img.style.height = "100%";
    img.onload = function () {
	  newData.element = img;
      newData.container.div.appendChild(img);
      const { width, height } = getDimensions(img);
      centerObject(ctx, newData, width, height);
      if (ctx.shouldSelectAfterCreate) {
          ctx.selectObject(newData);
      }
    };
    img.src = toUrl;
  };
  return (
    <StyledButton htmlFor={inputId}>
      <div style={{ padding: "0px 10px 0px 5px", height: 20 }}>
        <PhotographBoldIcon height={15} width={20} />
      </div>
      <input
        id={inputId}
        style={{ display: "none" }}
        type="file"
        accept="jpg,png,jpeg"
        onChange={handleAddImage}
      />
      Add Image
    </StyledButton>
  );
};	  
	 
	  `,
      language: "tsx",
      type: "auto",
    },
    description: {
      component: `In this example we create a menu component that can load an image to the canvas. 
	  First we create a new topBarTool with no icon. This is so that we can have a tool that will be responsible for the objects added to the canvas. 
	  The tool can not be selected as it will not be displayed on the top bar, but it is necessary if we wanted to handle things like updating the object's styles or 
	  handling undo/redo capabilities. In the \`handleAddImage\` function, we do a few things: 
	1. createNewObject which will create the DrawingData at the coordinate given. 
	2. addObject actually places the data onto the canvas (it will be an empty div element at the coords). 
	3. we load a new img element. 
	4. once the image is loaded, add it as a child of the wrapper div. 
	5. recenter the object to the middle of the canvas. 
	6. if the shouldSelectAfterCreate prop is set, select the newly added image object.  `,
    },
  },
};
