/// <reference types="react" />
import React from "react";
import { DetailedHTMLProps, HTMLAttributes, MutableRefObject, CSSProperties } from "react";
//============== TOOL IDS =========================
declare const SQUARE_TOOL_ID = "react-draw-square-tool";
declare const CIRCLE_TOOL_ID = "react-draw-circle-tool";
declare const DIAMOND_TOOL_ID = "react-draw-diamond-tool";
declare const STRAIGHT_LINE_TOOL_ID = "react-draw-line-tool";
declare const ARROW_TOOL_ID = "react-draw-arrow-tool";
declare const ERASE_TOOL_ID = "react-draw-erase-tool";
declare const FREE_DRAW_TOOL_ID = "react-draw-free-tool";
declare const SELECT_TOOL_ID = "react-draw-cursor";
declare const TEXT_AREA_TOOL_ID = "react-draw-textarea-tool";
//============== STYLES =========================
//          Styles Keys
declare const BOTTOM_BAR_CONTAINER_CLASSES = "bottomBarContainer";
declare const TOOL_ICON_WRAPPER_CLASSES = "toolIconWrapper";
declare const CLEAR_ALL_BUTTON_CLASSES = "clearAllButton";
declare const ALERT_MESSAGE_DIALOG_CLASSES = "alertMessageDialog";
declare const BOTTOM_TOOL_BUTTON_CLASSES = "bottomToolButton";
declare const MENU_BUTTON_CLASSES = "menuButton";
declare const MENU_CONTAINER_CLASSES = "menuContainer";
declare const TOP_BAR_CONTAINER_CLASSES = "topBarBontainer";
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
type MakeNewDivOutput = {
    div: HTMLDivElement;
    id: string;
    left: number;
    top: number;
    right: number;
    bottom: number;
};
declare function makeNewDiv(pointX: number, pointY: number, lineWidth: number, toolId: string): MakeNewDivOutput;
/**
 * Uses the initial point and the most recent point
 * has the side effect of altering the container to be the
 * correct position and dimensions;
 */
declare function setContainerRect(data: DrawingData): Point[];
type BoxSize = {
    left: number;
    top: number;
    height: number;
    width: number;
    right: number;
    bottom: number;
};
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
    shouldPreserveAspectRatio: boolean;
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
    shouldPreserveAspectRatio: boolean;
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
    subscribe?: (callback: (event: string) => void) => void;
    localState?: {
        [key: string]: any;
    };
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
};
type DrawingData = {
    id: string;
    containerDiv: HTMLDivElement;
    coords: Point[];
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
    shouldPreserveAspectRatio?: boolean;
    id: string;
    styleComponents?: StyleComponents;
    menuComponents?: MenuComponent[];
    onLoad?: (ctx: ReactDrawContext) => void;
    contextGetter?: (ctxGetter: () => ReactDrawContext) => void;
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
    [TOP_BAR_CONTAINER_CLASSES]?: string;
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
type CSSProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>;
type ReactDrawProps = StylesProviderProps & ReactDrawInnerProps & {
    style?: CSSProps;
};
type PartialCSS = Partial<CSSStyleDeclaration>;
type SelectMode = "drag" | "rotate" | "resize-nw" | "resize-ne" | "resize-se" | "resize-sw";
type HTMLEvent = keyof HTMLElementEventMap;
type IntermediateStringableObject = {
    toolId: string;
    [key: string]: any;
};
/**
 * Serializer function should take a DrawingData object and transform it
 * into another form which can be stringified and parsed later
 */
type SerializerFunction = (obj: DrawingData) => IntermediateStringableObject;
type Serializers = {
    [ARROW_TOOL_ID]?: SerializerFunction;
    [CIRCLE_TOOL_ID]?: SerializerFunction;
    [DIAMOND_TOOL_ID]?: SerializerFunction;
    [FREE_DRAW_TOOL_ID]?: SerializerFunction;
    [SQUARE_TOOL_ID]?: SerializerFunction;
    [STRAIGHT_LINE_TOOL_ID]?: SerializerFunction;
    [TEXT_AREA_TOOL_ID]?: SerializerFunction;
    [key: string]: SerializerFunction | undefined;
};
type DeserializerFunction = (obj: IntermediateStringableObject, ctx: ReactDrawContext, shouldAddToCanvas: boolean) => DrawingData;
type Deserializers = {
    [ARROW_TOOL_ID]?: DeserializerFunction;
    [CIRCLE_TOOL_ID]?: DeserializerFunction;
    [DIAMOND_TOOL_ID]?: DeserializerFunction;
    [FREE_DRAW_TOOL_ID]?: DeserializerFunction;
    [SQUARE_TOOL_ID]?: DeserializerFunction;
    [STRAIGHT_LINE_TOOL_ID]?: DeserializerFunction;
    [TEXT_AREA_TOOL_ID]?: DeserializerFunction;
    [key: string]: DeserializerFunction | undefined;
};
type ContainerState = {
    bbox: BoxSize;
    rotation: number;
    scale: null | {
        x: string;
        y: string;
    };
    other: {
        [key: string]: any;
    };
};
declare const _default: React.ForwardRefExoticComponent<StylesProviderProps & ReactDrawInnerProps & {
    style?: CSSProps | undefined;
} & React.RefAttributes<HTMLDivElement>>;
declare const freeDrawTool: DrawingTools;
declare const selectTool: DrawingTools;
declare function deletedSelected(ctx: ReactDrawContext): void;
declare const squareTool: DrawingTools;
declare function makeSquareDiv(style: ToolPropertiesMap): HTMLDivElement;
declare const circlTool: DrawingTools;
declare function makeCircleDiv(styles: ToolPropertiesMap): HTMLDivElement;
declare const diamondTool: DrawingTools;
declare function makeDiamondSvg(data: DrawingData): SVGSVGElement;
type Orientation = "left" | "right" | "up" | "down" | "nw" | "ne" | "se" | "sw";
declare const straightLineTool: DrawingTools;
declare function makeLineInOrientation(data: DrawingData, orientation: Orientation): SVGSVGElement;
declare const textAreaTool: DrawingTools;
declare function setupTextAreaDiv(data: DrawingData, ctx: ReactDrawContext): void;
declare const arrowTool: DrawingTools;
declare function makeArrowSvg(data: DrawingData, orientation: Orientation): SVGSVGElement;
// TODO: alter item on drawing
// then finally delete stuff on draw end
declare const eraseTool: DrawingTools;
declare const undoTool: ActionTools;
declare const redoTool: ActionTools;
declare const trashTool: ActionTools;
declare const duplicateTool: ActionTools;
declare function duplicateSelectedObjects(ctx: ReactDrawContext): void;
declare const bringBackTool: ActionTools;
/**
 * Always use div ele as source of truth
 * Algo:
 * 1. take the selected Objects and set their z-index to min num
 *    ei: if there are 3 selected then z-index will be 0,0,0 (TODO: preserve order)
 * 2. find the current lowest object not selected
 * 3. add the different from the lowest(unselected) to the highest (selected)
 */
declare function bringSelectedBack(ctx: ReactDrawContext): void;
declare const bringForwardTool: ActionTools;
/**
 * Algorithm:
 * get list of selected elements
 * get the list of non-selected elements
 * for each of the selected elements make the z index equal to the number of non-selected elements + 1,
 *   this ensures that there will be enough numbers between this and 0 for the other elements
 * sort the list of non-selected elements by their current z-index
 * for each of the non-selected elements, iterate through and set z-index to current - 1
 *
 * This ensures that the selected are at the top, and the rest maintain their ordering
 *
 * Example:
 * selected = [object1 (z=1), object2 (z=4)]
 * non-selected = [object3 (z=5), object4 (z=2), object5(z=10), object6(z=3)]
 *
 * object1.zindex = 4
 * object2.zindex = 5
 *
 * non-selected
 * (sorted) = [object5, object3, object6, object4],
 * (set zindex) = [(z=3), (z=2), (z=1), (z=0)]
 */
declare function moveSelectedForward(ctx: ReactDrawContext): void;
declare const ColorStyle: StyleComponent;
declare const BackgroundStyle: StyleComponent;
type LineWidthPickerProps = StyleComponentProps;
declare function LineWidthPicker({ onUpdate, styleKey, styleValue }: LineWidthPickerProps): React.JSX.Element;
type OpacityPickerProps = StyleComponentProps;
declare function LineWidthPicker$0({ onUpdate, styleKey, styleValue }: OpacityPickerProps): React.JSX.Element;
type LineWidthPickerProps$0 = StyleComponentProps;
declare function LineWidthPicker$1({ onUpdate, styleKey, styleValue }: LineWidthPickerProps$0): React.JSX.Element;
declare const ClearAllButton: MenuComponent;
declare function useStyles(key: string): string;
/**
 * Using each serializer which is mapped to the correct DrawingData object
 * by "toolId" property, add each resulting serialized object to an array
 * and return the result of JSON.stringify(array). Each resulting object
 * should also have "toolId" property so that it can be properly mapped
 * to the later deserializer function.
 * @param serializers
 * @param ctx
 * @returns
 */
declare function serializeObjects(serializers: Serializers, ctx: ReactDrawContext): string;
declare const serializeArrow: SerializerFunction;
declare const serializeCircle: SerializerFunction;
declare const serializeDiamond: SerializerFunction;
declare const serializeFreeDraw: SerializerFunction;
declare const serializeSquare: SerializerFunction;
declare const serializeLine: SerializerFunction;
declare const serializeText: SerializerFunction;
/**
 * Expects that the data is in the form of a stringified array of serialized objects.
 * example "[serializedArrowObj, serialziedFreeDrawObj1, serializedFreeDrawObj2, etc..]"
 * Also expects each object to have a key "toolId" so that it can map the object to the
 * deserializer function that handles.
 *
 * Sometimes you may want to not automatically add the resulting DrawingData objects
 * to the canvas. Use the third optional arguement  "shouldAddToCanvas" for this case
 * (default true)
 *
 * @param stringifiedData
 * @param ctx
 */
declare function deserializeData(stringifiedData: string, deserializers: Deserializers, ctx: ReactDrawContext, shouldAddToCanvas?: boolean): DrawingData[];
declare function deserializationSetup(obj: IntermediateStringableObject): {
    drawingData: DrawingData;
    div: HTMLDivElement;
    containerState: ContainerState;
};
declare const deserializeFreeDraw: DeserializerFunction;
declare const deserializeSquare: DeserializerFunction;
declare const deserializeCircle: DeserializerFunction;
declare const deserializeDiamond: DeserializerFunction;
declare const deserializeLine: DeserializerFunction;
declare const deserializeTextArea: DeserializerFunction;
declare const deserializeArrow: DeserializerFunction;
declare function selectManyElements(selectObjects: DrawingData[], ctx: ReactDrawContext): void;
declare function notifyTool(tools: DrawingTools[], data: DrawingData, ctx: ReactDrawContext): void;
declare function unselectAll(selectedObjects: DrawingData[], ctx: ReactDrawContext): void;
declare function selectElement(data: DrawingData, ctx: ReactDrawContext): void;
declare function getViewCenterPoint(ctx: ReactDrawContext): Point;
declare function createNewObject(ctx: ReactDrawContext, point: Point, toolId: string): DrawingData;
declare function addObject(ctx: ReactDrawContext, obj: DrawingData): void;
declare function centerObject(ctx: ReactDrawContext, obj: DrawingData, w?: number, h?: number): void;
/**
 * Unselecting an element requires also cleaning up the event listeners
 * TODO: this could be a performance hit.
 * @param data
 * @param ctx
 */
declare function unselectElement(data: DrawingData, ctx: ReactDrawContext): void;
type CreateObjectOptions = {
    pointA: Point;
    pointB: Point;
    toolId: string;
};
/**
 * creates a new circle and adds it to thew view.
 * returns the resulting DrawingDataObject
 */
declare function createCircle(ctx: ReactDrawContext, options: CreateObjectOptions): DrawingData;
type CreateImageOptions = CreateObjectOptions & {
    url?: string;
    showLoading?: boolean;
    image?: HTMLImageElement;
    loadingElement?: Element;
};
declare function createImage(ctx: ReactDrawContext, options: CreateImageOptions): Promise<DrawingData>;
declare function selectAll(ctx: ReactDrawContext): void;
declare function getSelectedObjects(ctx: ReactDrawContext): DrawingData[];
export { _default as ReactDraw, freeDrawTool, selectTool, deletedSelected, squareTool, makeSquareDiv, circlTool as circleTool, makeCircleDiv, diamondTool, makeDiamondSvg, straightLineTool, makeLineInOrientation, textAreaTool, setupTextAreaDiv, arrowTool, makeArrowSvg, eraseTool, undoTool, redoTool, trashTool, duplicateTool, duplicateSelectedObjects, bringBackTool, bringSelectedBack, bringForwardTool, moveSelectedForward, ColorStyle, BackgroundStyle, LineWidthPicker as LineWidthStyle, LineWidthPicker$0 as OpacityStyle, LineWidthPicker$1 as FontSizeStyle, ClearAllButton, ReactChild, LayoutAbsolute, LayoutOption, OnResizeContext, DrawingDataMap, CapturedEvent, EventHandler, SelectToolCustomState, EraseToolCustomState, OtherToolState, CustomState, ToolPropertiesMap, ReactDrawContext, UpdateStyleHandler, UndoHandler, ToolStylesMap, StringObject, DrawingTools, ActionType, ActionKey, ActionObject, Point, RectBounds, DrawingContainer, DrawingData, DisplayMode, ActionTools, MenuStyleTools, BottomToolDisplayMap, UpdateStyleFn, StyleComponentProps, StyleComponent, StyleComponents, MenuComponent, ReactDrawInnerProps, StylesObject, ClassNamesObject, StylesProviderProps, CSSProps, ReactDrawProps, PartialCSS, SelectMode, HTMLEvent, IntermediateStringableObject, SerializerFunction, Serializers, DeserializerFunction, Deserializers, ContainerState, COLORS, useStyles, serializeObjects, serializeArrow, serializeCircle, serializeDiamond, serializeFreeDraw, serializeLine, serializeSquare, serializeText, deserializeData, deserializationSetup, deserializeFreeDraw, deserializeSquare, deserializeCircle, deserializeDiamond, deserializeLine, deserializeTextArea, deserializeArrow, selectElement, notifyTool, selectManyElements, unselectAll, makeNewDiv, setContainerRect, createNewObject, addObject, centerObject, getViewCenterPoint, unselectElement, CreateObjectOptions, createCircle, CreateImageOptions, createImage, selectAll, getSelectedObjects };
//# sourceMappingURL=index.d.ts.map