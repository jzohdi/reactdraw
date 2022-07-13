import { MutableRefObject } from "react";

export type ReactChild = React.ReactNode | React.ReactElement | JSX.Element;
export type LayoutAbsolute = {
  width: number | string;
  height: number | string;
};

export type LayoutOption = "default" | LayoutAbsolute | "fit";

export type onResizeContext = {
  viewContainer: HTMLDivElement;
  previousPoint: Point;
  newPoint: Point;
  mode: SelectMode;
};
export type DrawingDataMap = {
  [id: string]: DrawingData;
};

export type CapturedEvent = MouseEvent | TouchEvent | null;

export type DrawingToolCustomState = {
  [stateKey: string]: any;
};

export type CustomState = {
  [toolId: string]: DrawingToolCustomState;
};
export type ReactDrawContext = {
  viewContainer: HTMLDivElement;
  objectsMap: DrawingDataMap;
  lastEvent: CapturedEvent;
  prevMousePosition: MutableRefObject<Point | null>;
  drawingTools: DrawingTools[];
  customState: DrawingToolCustomState;
};
/**
 * icon: the icon to be displayed in the top bar tools
 * id: required so that react draw can identify objects created by this id.
 * cursor: sets the the cursor of the mouse while over the viewContainer
 * ----
 */
export type DrawingTools = {
  icon: JSX.Element;
  id: string;
  setupCustomState?: (state: CustomState) => any;
  onPickTool?: (ctx: ReactDrawContext) => void;
  onUnPickTool?: (ctx: ReactDrawContext) => void;
  onDrawStart: (data: DrawingData, viewContainer: HTMLDivElement) => void;
  onDrawing: (data: DrawingData, ctx: ReactDrawContext) => void;
  onDrawEnd: (data: DrawingData, ctx: ReactDrawContext) => void;
  doResize?: (data: DrawingData, ctx: onResizeContext) => void;
  onResize: (data: DrawingData, ctx: onResizeContext) => void;
  onSelect?: (data: DrawingData, ctx: ReactDrawContext) => void;
  onAfterUpdate?: (data: DrawingData, ctx: ReactDrawContext) => void;
  onUnSelect?: (data: DrawingData, ctx: ReactDrawContext) => void;
  onDeleteObject?: (data: DrawingData, ctx: ReactDrawContext) => void;
  cursor?: string;
};

export type Point = [number, number];
export type RectBounds = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};
export type DrawingContainer = {
  div: HTMLDivElement;
  id: string;
  bounds: RectBounds;
};
export type DrawingData = {
  coords: Point[];
  container: DrawingContainer;
  element: HTMLElement | SVGSVGElement | null;
  style: {
    lineWidth: number;
    zIndex: number;
  };
  toolId: string;
  customData: {
    [key: string]: any;
  };
};

export type ReactDrawProps = {
  children?: ReactChild;
  layout?: LayoutOption;
  topBarTools: DrawingTools[];
  hideTopBar?: boolean;
};

export type PartialCSS = Partial<CSSStyleDeclaration>;
export type SelectMode =
  | "drag"
  | "rotate"
  | "resize-nw"
  | "resize-ne"
  | "resize-se"
  | "resize-sw";
