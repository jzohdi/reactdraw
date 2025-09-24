import React, { useRef } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ReactDraw, selectTool, freeDrawTool, circleTool } from "../index";
import type { ReactDrawContext, ReactDrawProps } from "../types";

const meta: Meta<typeof ReactDraw> = {
  title: "Customization Examples/Save Canvas As Image",
  component: ReactDraw,
};
export default meta;

function Wrapper(args: ReactDrawProps) {
  const contextGetterRef = useRef<() => ReactDrawContext>();
  const setContextGetter = (getCtx: () => ReactDrawContext) => {
    contextGetterRef.current = getCtx;
  };

  const handleDownload = () => {
    const getter = contextGetterRef.current;
    if (!getter) throw new Error("Ctx getter not set");
    const ctx = getter();
    // naive image capture: HTML to canvas via foreignObject (works best in modern browsers)
    const node = ctx.viewContainer;
    const svg = new XMLSerializer().serializeToString(
      node.cloneNode(true) as Node
    );
    const blob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "reactdraw-canvas.svg";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ display: "flex", gap: 10 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <button onClick={handleDownload}>Download as SVG</button>
      </div>
      <ReactDraw
        {...args}
        contextGetter={setContextGetter}
        drawingTools={[selectTool, freeDrawTool, circleTool]}
      />
    </div>
  );
}

export const SaveCanvasAsImage: StoryObj<typeof ReactDraw> = {
  render: (args) => <Wrapper {...args} />,
};
