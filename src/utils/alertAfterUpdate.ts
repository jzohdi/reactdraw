import { DrawingData, ReactDrawContext } from "../types";

export function alertAfterUpdate(data: DrawingData, ctx: ReactDrawContext) {
  const toolId = data.toolId;
  const tool = ctx.drawingTools.find((t) => t.id === toolId);
  if (!tool || !tool.onAfterUpdate) {
    return;
  }
  tool.onAfterUpdate(data, ctx);
}
