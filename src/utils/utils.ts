import {
  DrawingData,
  DrawingTools,
  PartialCSS,
  ReactDrawContext,
  SelectMode,
} from "../types";

export function setStyles(div: HTMLElement, styles: PartialCSS): HTMLElement {
  for (const key in styles) {
    (<any>div.style)[key] = styles[key];
  }
  return div;
}

export function getCornerMode(id: string): SelectMode {
  const direction = id.split("-")[2];
  if (direction === "sw") {
    return "resize-sw";
  }
  if (direction === "nw") {
    return "resize-nw";
  }
  if (direction === "se") {
    return "resize-se";
  }
  if (direction === "ne") {
    return "resize-ne";
  }
  throw new Error("corner mode id not valid");
}

export function getToolById(tools: DrawingTools[], toolId: string) {
  const tool = tools.find((t) => t.id === toolId);
  if (!tool) {
    throw new Error("could not find the used tool");
  }
  return tool;
}

export function alertAfterUpdate(data: DrawingData, ctx: ReactDrawContext) {
  const toolId = data.toolId;
  const tool = ctx.drawingTools.find((t) => t.id === toolId);
  if (!tool || !tool.onAfterUpdate) {
    return;
  }
  tool.onAfterUpdate(data, changeCtxForTool(ctx, toolId));
}

// TODO: verify this isn't a problem
export function changeCtxForTool(
  ctx: ReactDrawContext,
  toolId: string
): ReactDrawContext {
  return { ...ctx, customState: ctx.fullState[toolId] };
}
