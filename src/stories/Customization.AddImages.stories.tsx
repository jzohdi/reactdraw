import React, { useRef } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  ReactDraw,
  getViewCenterPoint,
  createImage,
  selectTool,
  textAreaTool,
  circleTool,
  freeDrawTool,
} from "../index";
import type { DrawingTools, ReactDrawContext, ReactDrawProps } from "../types";

const imageToolId = "custom-image-tool";
const imageTool: DrawingTools = {
  id: imageToolId,
  onDrawStart() {},
  onDrawing() {},
  onDrawEnd() {},
  onResize() {},
};

const meta: Meta<typeof ReactDraw> = {
  title: "Customization Examples/Add Images To Canvas",
  component: ReactDraw,
};
export default meta;

function Wrapper(args: ReactDrawProps) {
  const contextGetterRef = useRef<() => ReactDrawContext>();
  const setContextGetter = (getCtx: () => ReactDrawContext) => {
    contextGetterRef.current = getCtx;
  };
  const handleAddImage = async () => {
    const getter = contextGetterRef.current;
    if (!getter) throw new Error("Ctx getter not set");
    const ctx = getter();
    const center = getViewCenterPoint(ctx);
    const loading = document.createElement("p");
    loading.innerHTML = " loading...";
    await createImage(ctx, {
      pointA: center,
      pointB: [center[0] + 160, center[1] + 120],
      toolId: imageTool.id,
      url: "https://picsum.photos/320/240",
      showLoading: true,
      loadingElement: loading,
    });
  };
  return (
    <div style={{ display: "flex", gap: 10 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <button onClick={handleAddImage}>Add Random Image</button>
      </div>
      <ReactDraw
        {...args}
        contextGetter={setContextGetter}
        drawingTools={[
          selectTool,
          imageTool,
          freeDrawTool,
          circleTool,
          textAreaTool,
        ]}
        hideTopBar={false}
      />
    </div>
  );
}

export const AddImages: StoryObj<typeof ReactDraw> = {
  render: (args) => <Wrapper {...args} />,
};
