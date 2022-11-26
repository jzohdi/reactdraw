import { MutableRefObject } from "react";
import {
  ERASE_TOOL_ID,
  SELECT_TOOL_ID,
  ALERT_MESSAGE_DIALOG_CLASSES,
  BOTTOM_BAR_CONTAINER_CLASSES,
  BOTTOM_TOOL_BUTTON_CLASSES,
  CLEAR_ALL_BUTTON_CLASSES,
  MENU_BUTTON_CLASSES,
  MENU_CONTAINER_CLASSES,
  TOOL_ICON_WRAPPER_CLASSES,
  FREE_DRAW_TOOL_ID,
  ARROW_TOOL_ID,
  CIRCLE_TOOL_ID,
  DIAMOND_TOOL_ID,
  SQUARE_TOOL_ID,
  STRAIGHT_LINE_TOOL_ID,
  TEXT_AREA_TOOL_ID,
} from "./constants";
import { StylesValue } from "./Styles/types";
import { BoxSize } from "./utils";

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
export type DrawingDataMap = Map<string, DrawingData>;

export type CapturedEvent = MouseEvent | TouchEvent | null;

// store event listeners in custom state so that can be refered to later
export type EventHandler = {
  ele: HTMLElement;
  eventName: keyof HTMLElementEventMap;
  fn: (...args: any) => void;
};

export type SelectToolCustomState = {
  selectedIds: string[];
  handlers: {
    [objectId: string]: EventHandler[];
  };
  prevPoint: Point | null;
};

export type EraseToolCustomState = {
  deletedObjects: Map<string, DrawingData>;
};

export type OtherToolState = {
  [key: string]: any;
};

export interface CustomState {
  [SELECT_TOOL_ID]: SelectToolCustomState;
  // [FREE_DRAW_TOOL_ID]?: FRE
  [ERASE_TOOL_ID]: EraseToolCustomState;
  [tool_id: string]: OtherToolState;
}

export interface ToolPropertiesMap {
  lineWidth: string;
  zIndex: string;
  color: string;
  fontSize: string;
  background: string;
  opacity: string;
  [id: string]: string;
}

export type ReactDrawContext = {
  viewContainer: HTMLDivElement;
  objectsMap: DrawingDataMap;
  lastEvent: CapturedEvent;
  prevMousePosition: MutableRefObject<Point | null>;
  drawingTools: DrawingTools[];
  fullState: CustomState;
  undoStack: ActionObject[];
  redoStack: ActionObject[];
  shouldKeepHistory: boolean;
  shouldSelectAfterCreate: boolean;
  globalStyles: ToolPropertiesMap;
  selectDrawingTool: (toolId: string) => void;
  selectObject: (object: DrawingData) => void;
};
export type UpdateStyleHandler = (
  data: DrawingData,
  value: string,
  ctx: ReactDrawContext
) => ActionObject | undefined;
export type UndoHandler = (
  action: ActionObject,
  ctx: ReactDrawContext
) => ActionObject;
export type ToolStylesMap = Map<string, ToolPropertiesMap>;
export type StringObject = { [key: string]: string };
/**
 * icon: the icon to be displayed in the top bar tools
 * id: required so that react draw can identify objects created by this id.
 * cursor: sets the the cursor of the mouse while over the viewContainer
 * ----
 */
export type DrawingTools = {
  icon?: JSX.Element;
  tooltip?: string;
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
  //   onUndo?: (action: ActionObject, ctx: ReactDrawContext) => ActionObject;
  //   onRedo?: (action: ActionObject, ctx: ReactDrawContext) => ActionObject;
  onDuplicate?: (newData: DrawingData, ctx: ReactDrawContext) => DrawingData;
  undoHandlers?: {
    [action: ActionKey]: UndoHandler;
  };
  redoHandlers?: {
    [action: ActionKey]: UndoHandler;
  };
  styleHandlers?: {
    [key: keyof ToolPropertiesMap]: UpdateStyleHandler;
  };
  cursor?: string;
};

export type ActionType =
  | "top-bar-tool"
  | "bottom-bar-tool"
  | "menu-tool"
  | "batch";
export type ActionKey =
  | "color"
  | "delete"
  | "create"
  | string
  | "drag"
  | "resize"
  | "rotate"
  | "input";
export type ActionObject = {
  toolType: ActionType;
  toolId: string;
  objectId: string;
  action: ActionKey;
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
};
export type DrawingData = {
  id: string;
  containerDiv: HTMLDivElement;
  coords: Point[];
  element: HTMLElement | SVGSVGElement | null;
  style: ToolPropertiesMap;
  toolId: string;
  customData: Map<string, any>;
};

export type DisplayMode = "disabled" | "hide" | "show";

export type ActionTools = {
  icon: JSX.Element;
  id: string;
  tooltip?: string;
  getDisplayMode: (ctx: ReactDrawContext) => DisplayMode;
  handleContext: (ctx: ReactDrawContext) => void;
  onUndo?: (action: ActionObject, ctx: ReactDrawContext) => ActionObject;
  onRedo?: (action: ActionObject, ctx: ReactDrawContext) => ActionObject;
};

type StyleToolComponentProps = {
  handleContext: (ctx: ReactDrawContext) => void;
};

export type MenuStyleTools = {
  [key: string]: (props: StyleToolComponentProps) => JSX.Element;
};

// export type

export type BottomToolDisplayMap = Map<string, DisplayMode>;
export type UpdateStyleFn = (
  key: keyof ToolPropertiesMap,
  value: string
) => (ActionObject | undefined)[];

export type StyleComponentProps = {
  onUpdate: (key: keyof ToolPropertiesMap, value: string) => void;
  styleKey: string;
  styleValue: string;
};
export type StyleComponent = (props: StyleComponentProps) => JSX.Element;
export type StyleComponents = {
  [key: keyof ToolPropertiesMap]: {
    order: number;
    component: StyleComponent;
  };
};

export type MenuComponent = (props: {
  getContext: () => ReactDrawContext;
}) => JSX.Element;

export type ReactDrawInnerProps = {
  children?: ReactChild;
  layout?: LayoutOption;
  topBarTools: DrawingTools[];
  hideTopBar?: boolean;
  bottomBarTools: ActionTools[];
  hideBottomBar?: boolean;
  shouldKeepHistory?: boolean;
  shouldSelectAfterCreate?: boolean;
  id: string;
  styleComponents?: StyleComponents;
  menuComponents?: MenuComponent[];
  onLoad?: (ctx: ReactDrawContext) => void;
  contextGetter?: (ctxGetter: () => ReactDrawContext) => void;
};

export type StylesObject = {
  [BOTTOM_BAR_CONTAINER_CLASSES]?: StylesValue;
  [TOOL_ICON_WRAPPER_CLASSES]?: StylesValue;
  [CLEAR_ALL_BUTTON_CLASSES]?: StylesValue;
  [ALERT_MESSAGE_DIALOG_CLASSES]?: StylesValue;
  [BOTTOM_TOOL_BUTTON_CLASSES]?: StylesValue;
  [MENU_BUTTON_CLASSES]?: StylesValue;
  [MENU_CONTAINER_CLASSES]?: StylesValue;
  [MENU_BUTTON_CLASSES]?: StylesValue;
  [other: string]: StylesValue | undefined;
};
export type ClassNamesObject = {
  [BOTTOM_BAR_CONTAINER_CLASSES]?: string;
  [TOOL_ICON_WRAPPER_CLASSES]?: string;
  [CLEAR_ALL_BUTTON_CLASSES]?: string;
  [ALERT_MESSAGE_DIALOG_CLASSES]?: string;
  [BOTTOM_TOOL_BUTTON_CLASSES]?: string;
  [MENU_BUTTON_CLASSES]?: string;
  [MENU_CONTAINER_CLASSES]?: string;
  [MENU_BUTTON_CLASSES]?: string;
  [other: string]: string | undefined;
};
export type StylesProviderProps = {
  styles?: StylesObject;
  classNames?: ClassNamesObject;
};
export type ReactDrawProps = StylesProviderProps & ReactDrawInnerProps;

export type PartialCSS = Partial<CSSStyleDeclaration>;
export type SelectMode =
  | "drag"
  | "rotate"
  | "resize-nw"
  | "resize-ne"
  | "resize-se"
  | "resize-sw";
export type HTMLEvent = keyof HTMLElementEventMap;

export type IntermediateStringableObject = {
  toolId: string;
  [key: string]: any;
};

/**
 * Serializer function should take a DrawingData object and transform it
 * into another form which can be stringified and parsed later
 */
export type SerializerFunction = (
  obj: DrawingData
) => IntermediateStringableObject;

export type Serializers = {
  [ARROW_TOOL_ID]?: SerializerFunction;
  [CIRCLE_TOOL_ID]?: SerializerFunction;
  [DIAMOND_TOOL_ID]?: SerializerFunction;
  [FREE_DRAW_TOOL_ID]?: SerializerFunction;
  [SQUARE_TOOL_ID]?: SerializerFunction;
  [STRAIGHT_LINE_TOOL_ID]?: SerializerFunction;
  [TEXT_AREA_TOOL_ID]?: SerializerFunction;
  [key: string]: SerializerFunction | undefined;
};

export type DeserializerFunction = (
  obj: IntermediateStringableObject,
  ctx: ReactDrawContext,
  shouldAddToCanvas: boolean
) => DrawingData;

export type Deserializers = {
  [ARROW_TOOL_ID]?: DeserializerFunction;
  [CIRCLE_TOOL_ID]?: DeserializerFunction;
  [DIAMOND_TOOL_ID]?: DeserializerFunction;
  [FREE_DRAW_TOOL_ID]?: DeserializerFunction;
  [SQUARE_TOOL_ID]?: DeserializerFunction;
  [STRAIGHT_LINE_TOOL_ID]?: DeserializerFunction;
  [TEXT_AREA_TOOL_ID]?: DeserializerFunction;
  [key: string]: DeserializerFunction | undefined;
};

export type ContainerState = {
  bbox: BoxSize;
  rotation: number;
  scale: null | { x: string; y: string };
  other: { [key: string]: any };
};
