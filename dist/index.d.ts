import { MutableRefObject } from "react";
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
type DrawingDataMap = {
    [id: string]: DrawingData;
};
type CapturedEvent = MouseEvent | TouchEvent | null;
type DrawingToolCustomState = {
    [stateKey: string]: any;
};
type CustomState = {
    [toolId: string]: DrawingToolCustomState;
};
type ReactDrawContext = {
    viewContainer: HTMLDivElement;
    objectsMap: DrawingDataMap;
    lastEvent: CapturedEvent;
    prevMousePosition: MutableRefObject<Point | null>;
    drawingTools: DrawingTools[];
    customState: DrawingToolCustomState;
    fullState: CustomState;
};
/**
 * icon: the icon to be displayed in the top bar tools
 * id: required so that react draw can identify objects created by this id.
 * cursor: sets the the cursor of the mouse while over the viewContainer
 * ----
 */
type DrawingTools = {
    icon: JSX.Element;
    id: string;
    setupCustomState?: (state: CustomState) => any;
    onPickTool?: (ctx: ReactDrawContext) => void;
    onUnPickTool?: (ctx: ReactDrawContext) => void;
    onDrawStart: (data: DrawingData, viewContainer: HTMLDivElement) => void;
    onDrawing: (data: DrawingData, ctx: ReactDrawContext) => void;
    onDrawEnd: (data: DrawingData, ctx: ReactDrawContext) => void;
    doResize?: (data: DrawingData, ctx: OnResizeContext) => void;
    onResize: (data: DrawingData, ctx: OnResizeContext) => void;
    onSelect?: (data: DrawingData, ctx: ReactDrawContext) => void;
    onAfterUpdate?: (data: DrawingData, ctx: ReactDrawContext) => void;
    onUnSelect?: (data: DrawingData, ctx: ReactDrawContext) => void;
    onDeleteObject?: (data: DrawingData, ctx: ReactDrawContext) => void;
    onKeyPress?: (event: KeyboardEvent, ctx: ReactDrawContext) => void;
    cursor?: string;
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
    style: {
        lineWidth: number;
        zIndex: number;
    };
    toolId: string;
    customData: {
        [key: string]: any;
    };
};
type ReactDrawProps = {
    children?: ReactChild;
    layout?: LayoutOption;
    topBarTools: DrawingTools[];
    hideTopBar?: boolean;
    id: string;
};
declare function ReactDraw({ children, topBarTools, hideTopBar, id, ...props }: ReactDrawProps): JSX.Element;
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
export { ReactDraw, freeDrawTool, selectTool, squareTool, circlTool as circleTool, diamondTool, straightLineTool, textAreaTool, eraseTool };
//# sourceMappingURL=index.d.ts.map