import { MutableRefObject } from "react";

export type ReactChild = React.ReactNode | React.ReactElement | JSX.Element;
export type LayoutAbsolute = {
  width: number | string;
  height: number | string;
};

export type LayoutOption = "default" | LayoutAbsolute | "fit";

export type OnResizeContext = {
  viewContainer: HTMLDivElement;
  previousPoint: Point;
  newPoint: Point;
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
  fullState: CustomState;
  undoStack: ActionObject[];
  redoStack: ActionObject[];
  shouldKeepHistory: boolean;
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
  onDrawStart: (data: DrawingData, ctx: ReactDrawContext) => void;
  onDrawing: (data: DrawingData, ctx: ReactDrawContext) => void;
  onDrawEnd: (data: DrawingData, ctx: ReactDrawContext) => void;
  doResize?: (data: DrawingData, ctx: OnResizeContext) => void;
  onResize: (data: DrawingData, ctx: OnResizeContext) => void;
  onSelect?: (data: DrawingData, ctx: ReactDrawContext) => void;
  onAfterUpdate?: (data: DrawingData, ctx: ReactDrawContext) => void;
  onUnSelect?: (data: DrawingData, ctx: ReactDrawContext) => void;
  onDeleteObject?: (data: DrawingData, ctx: ReactDrawContext) => void;
  onKeyPress?: (event: KeyboardEvent, ctx: ReactDrawContext) => void;
  onUnMount?: (ctx: ReactDrawContext) => void;
  onUndo?: (action: ActionObject, ctx: ReactDrawContext) => ActionObject;
  onRedo?: (action: ActionObject, ctx: ReactDrawContext) => ActionObject;
  cursor?: string;
};

export type ActionType = "top-bar-tool" | "bottom-bar-tool" | "menu-tool";

export type ActionObject = {
  toolType: ActionType;
  toolId: string;
  objectId: string;
  action: string;
  data: any;
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

export type DisplayMode = "disabled" | "hide" | "show";

export type ActionTools = {
  icon: JSX.Element;
  id: string;
  getDisplayMode: (ctx: ReactDrawContext) => DisplayMode;
  handleContext: (ctx: ReactDrawContext) => void;
};

export type BottomToolDisplayMap = {
  [id: string]: DisplayMode;
};

export type ReactDrawProps = {
  children?: ReactChild;
  layout?: LayoutOption;
  topBarTools: DrawingTools[];
  hideTopBar?: boolean;
  bottomBarTools: ActionTools[];
  hideBottomBar?: boolean;
  shouldKeepHistory?: boolean;
  id: string;
};

export type PartialCSS = Partial<CSSStyleDeclaration>;
export type SelectMode =
  | "drag"
  | "rotate"
  | "resize-nw"
  | "resize-ne"
  | "resize-se"
  | "resize-sw";
export type HTMLEvent = keyof HTMLElementEventMap;
