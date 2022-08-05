import React from "react";
import { MutableRefObject, CSSProperties } from "react";
declare const ERASE_TOOL_ID = "react-draw-erase-tool";
declare const SELECT_TOOL_ID = "react-draw-cursor";
//============== STYLES =========================
//          Styles Keys
declare const BOTTOM_BAR_CONTAINER_CLASSES = "bottomBarContainer";
declare const TOOL_ICON_WRAPPER_CLASSES = "toolIconWrapper";
declare const CLEAR_ALL_BUTTON_CLASSES = "clearAllButton";
declare const ALERT_MESSAGE_DIALOG_CLASSES = "alertMessageDialog";
declare const BOTTOM_TOOL_BUTTON_CLASSES = "bottomToolButton";
declare const MENU_BUTTON_CLASSES = "menuButton";
declare const MENU_CONTAINER_CLASSES = "menuContainer";
declare const COLORS: {
    primary: {
        light: string;
        main: string;
    };
    grey: {
        light: string;
    };
};
/**
 * Example:
 * {
 *    '@keyframes my-animation': {
 *        '0%': {
 *            ...CSSProperties
 *        },
 *        '100%': {
 *            ...CSSProperties
 *        }
 *    }
 * }
 */
type KeyFramesValue = {
    [percent: string]: CSSProperties;
};
type KeyFramesDefinition = {
    [keyframesDef: string]: KeyFramesValue;
};
type StylesValue = CSSProperties | {
    [selector: string]: CSSProperties;
} | KeyFramesDefinition;
type ReactChild = React.ReactNode | React.ReactElement | JSX.Element;
type LayoutAbsolute = {
    width: number | string;
    height: number | string;
};
type LayoutOption = "default" | LayoutAbsolute | "fit";
type OnResizeContext = {
    viewContainer: HTMLDivElement;
    previousPoint: Point;
    newPoint: Point;
};
type DrawingDataMap = Map<string, DrawingData>;
type CapturedEvent = MouseEvent | TouchEvent | null;
// store event listeners in custom state so that can be refered to later
type EventHandler = {
    ele: HTMLElement;
    eventName: keyof HTMLElementEventMap;
    fn: (...args: any) => void;
};
type SelectToolCustomState = {
    selectedIds: string[];
    handlers: {
        [objectId: string]: EventHandler[];
    };
    prevPoint: Point | null;
};
type EraseToolCustomState = {
    deletedObjects: Map<string, DrawingData>;
};
type OtherToolState = {
    [key: string]: any;
};
interface CustomState {
    [SELECT_TOOL_ID]: SelectToolCustomState;
    // [FREE_DRAW_TOOL_ID]?: FRE
    [ERASE_TOOL_ID]: EraseToolCustomState;
    [tool_id: string]: OtherToolState;
}
interface ToolPropertiesMap {
    lineWidth: string;
    zIndex: string;
    color: string;
    fontSize: string;
    background: string;
    opacity: string;
    [id: string]: string;
}
type ReactDrawContext = {
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
type UpdateStyleHandler = (data: DrawingData, value: string, ctx: ReactDrawContext) => ActionObject | undefined;
type UndoHandler = (action: ActionObject, ctx: ReactDrawContext) => ActionObject;
type ToolStylesMap = Map<string, ToolPropertiesMap>;
type StringObject = {
    [key: string]: string;
};
/**
 * icon: the icon to be displayed in the top bar tools
 * id: required so that react draw can identify objects created by this id.
 * cursor: sets the the cursor of the mouse while over the viewContainer
 * ----
 */
type DrawingTools = {
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
type ActionType = "top-bar-tool" | "bottom-bar-tool" | "menu-tool" | "batch";
type ActionKey = "color" | "delete" | "create" | string | "drag" | "resize" | "rotate" | "input";
type ActionObject = {
    toolType: ActionType;
    toolId: string;
    objectId: string;
    action: ActionKey;
    data: any;
};
type Point = [
    number,
    number
];
type RectBounds = {
    top: number;
    right: number;
    bottom: number;
    left: number;
};
type DrawingContainer = {
    div: HTMLDivElement;
    id: string;
    bounds: RectBounds;
};
type DrawingData = {
    coords: Point[];
    container: DrawingContainer;
    element: HTMLElement | SVGSVGElement | null;
    style: ToolPropertiesMap;
    toolId: string;
    customData: Map<string, any>;
};
type DisplayMode = "disabled" | "hide" | "show";
type ActionTools = {
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
type MenuStyleTools = {
    [key: string]: (props: StyleToolComponentProps) => JSX.Element;
};
// export type
type BottomToolDisplayMap = Map<string, DisplayMode>;
type UpdateStyleFn = (key: keyof ToolPropertiesMap, value: string) => (ActionObject | undefined)[];
type StyleComponentProps = {
    onUpdate: (key: keyof ToolPropertiesMap, value: string) => void;
    styleKey: string;
    styleValue: string;
};
type StyleComponent = (props: StyleComponentProps) => JSX.Element;
type StyleComponents = {
    [key: keyof ToolPropertiesMap]: {
        order: number;
        component: StyleComponent;
    };
};
type MenuComponent = (props: {
    getContext: () => ReactDrawContext;
}) => JSX.Element;
type ReactDrawInnerProps = {
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
};
type StylesObject = {
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
type ClassNamesObject = {
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
type StylesProviderProps = {
    styles?: StylesObject;
    classNames?: ClassNamesObject;
};
type ReactDrawProps = StylesProviderProps & ReactDrawInnerProps;
type PartialCSS = Partial<CSSStyleDeclaration>;
type SelectMode = "drag" | "rotate" | "resize-nw" | "resize-ne" | "resize-se" | "resize-sw";
type HTMLEvent = keyof HTMLElementEventMap;
declare const _default: React.ForwardRefExoticComponent<StylesProviderProps & ReactDrawInnerProps & React.RefAttributes<HTMLDivElement>>;
declare const freeDrawTool: DrawingTools;
declare const selectTool: DrawingTools;
declare const squareTool: DrawingTools;
declare const circlTool: DrawingTools;
declare const diamondTool: DrawingTools;
declare const straightLineTool: DrawingTools;
declare const textAreaTool: DrawingTools;
// TODO: alter item on drawing
// then finally delete stuff on draw end
declare const eraseTool: DrawingTools;
declare const undoTool: ActionTools;
declare const redoTool: ActionTools;
declare const trashTool: ActionTools;
declare const duplicateTool: ActionTools;
declare const bringBackTool: ActionTools;
declare const bringForwardTool: ActionTools;
declare const ColorStyle: StyleComponent;
declare const BackgroundStyle: StyleComponent;
type LineWidthPickerProps = StyleComponentProps;
declare function LineWidthPicker({ onUpdate, styleKey, styleValue }: LineWidthPickerProps): JSX.Element;
type OpacityPickerProps = StyleComponentProps;
declare function LineWidthPicker$0({ onUpdate, styleKey, styleValue }: OpacityPickerProps): JSX.Element;
type LineWidthPickerProps$0 = StyleComponentProps;
declare function LineWidthPicker$1({ onUpdate, styleKey, styleValue }: LineWidthPickerProps$0): JSX.Element;
declare const arrowTool: DrawingTools;
declare const ClearAllButton: MenuComponent;
declare function createNewObject(ctx: ReactDrawContext, point: Point, toolId: string): DrawingData;
declare function addObject(ctx: ReactDrawContext, obj: DrawingData): void;
declare function centerObject(ctx: ReactDrawContext, obj: DrawingData, w?: number, h?: number): void;
declare function useStyles(key: string): string;
export { _default as ReactDraw, freeDrawTool, selectTool, squareTool, circlTool as circleTool, diamondTool, straightLineTool, textAreaTool, eraseTool, undoTool, redoTool, trashTool, duplicateTool, bringBackTool, bringForwardTool, ColorStyle, BackgroundStyle, LineWidthPicker as LineWidthStyle, LineWidthPicker$0 as OpacityStyle, LineWidthPicker$1 as FontSizeStyle, arrowTool, ClearAllButton, ReactChild, LayoutAbsolute, LayoutOption, OnResizeContext, DrawingDataMap, CapturedEvent, EventHandler, SelectToolCustomState, EraseToolCustomState, OtherToolState, CustomState, ToolPropertiesMap, ReactDrawContext, UpdateStyleHandler, UndoHandler, ToolStylesMap, StringObject, DrawingTools, ActionType, ActionKey, ActionObject, Point, RectBounds, DrawingContainer, DrawingData, DisplayMode, ActionTools, MenuStyleTools, BottomToolDisplayMap, UpdateStyleFn, StyleComponentProps, StyleComponent, StyleComponents, MenuComponent, ReactDrawInnerProps, StylesObject, ClassNamesObject, StylesProviderProps, ReactDrawProps, PartialCSS, SelectMode, HTMLEvent, COLORS, createNewObject, addObject, centerObject, useStyles };
//# sourceMappingURL=index.esm.d.ts.map