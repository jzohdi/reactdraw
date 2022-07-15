import { SELECT_TOOL_ID } from "../SelectTool/constants";
import { unselectElement } from "../SelectTool/unselectElement";
import {
  DrawingData,
  DrawingDataMap,
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

// TODO: verify this isn't a problem
export function changeCtxForTool(
  ctx: ReactDrawContext,
  toolId: string
): ReactDrawContext {
  return { ...ctx, customState: ctx.fullState.get(toolId) };
}

export function deleteObjectAndNotify(objectId: string, ctx: ReactDrawContext) {
  const { objectsMap, viewContainer } = ctx;
  const object = getObjectFromMap(ctx.objectsMap, objectId);

  // if deleting a selected element, remove select
  unselectElement(object, changeCtxForTool(ctx, SELECT_TOOL_ID));

  const { div, id } = object.container;
  viewContainer.removeChild(div);
  objectsMap.delete(id);
  const tool = getToolById(ctx.drawingTools, object.toolId);
  if (tool.onDeleteObject) {
    tool.onDeleteObject(object, changeCtxForTool(ctx, tool.id));
  }
}

export function getObjectFromMap(
  map: DrawingDataMap,
  objectId: string
): DrawingData {
  const object = map.get(objectId);
  if (!object) {
    throw new Error("could not get object from map");
  }
  return object;
}
