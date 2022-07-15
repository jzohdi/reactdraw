import { SELECT_TOOL_ID } from "../SelectTool/constants";
import { SelectToolCustomState } from "../SelectTool/types";
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

export function deleteObjectAndNotify(objectId: string, ctx: ReactDrawContext) {
  const { objectsMap, viewContainer } = ctx;
  const object = ctx.objectsMap[objectId];
  const { div, id } = object.container;
  viewContainer.removeChild(div);
  delete objectsMap[id];
  const tool = getToolById(ctx.drawingTools, object.toolId);
  if (tool.onDeleteObject) {
    tool.onDeleteObject(object, changeCtxForTool(ctx, tool.id));
  }
  const selectToolState = ctx.fullState[
    SELECT_TOOL_ID
  ] as SelectToolCustomState;
  if (!selectToolState || !selectToolState.selectedIds) {
    return;
  }
  const indexOfId = selectToolState.selectedIds.indexOf(id);
  if (indexOfId < 0) {
    return;
  }
  selectToolState.selectedIds.splice(indexOfId, 1);
  //   console.log("removed id:", id, "from selected Ids");
}
