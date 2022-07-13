import { DrawingTools, PartialCSS, SelectMode } from "../types";

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
