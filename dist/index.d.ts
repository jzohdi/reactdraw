type ReactChild = React.ReactNode | React.ReactElement | JSX.Element;
type LayoutAbsolute = {
    width: number | string;
    height: number | string;
};
type LayoutOption = "default" | LayoutAbsolute | "fit";
type onResizeContext = {
    viewContainer: HTMLDivElement;
    previousPoint: Point;
    newPoint: Point;
    mode: SelectMode;
};
type ReactDrawContext = {
    viewContainer: HTMLDivElement;
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
    onDrawStart: (data: DrawingData, viewContainer: HTMLDivElement) => void;
    onDrawing: (data: DrawingData, viewContainer: HTMLDivElement) => void;
    onDrawEnd: (data: DrawingData, viewContainer: HTMLDivElement) => void;
    onResize: (data: DrawingData, ctx: onResizeContext) => void;
    onSelect?: (data: DrawingData, ctx: ReactDrawContext) => void;
    onAfterUpdate?: (data: DrawingData, ctx: ReactDrawContext) => void;
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
    customData: any;
};
type ReactDrawProps = {
    children?: ReactChild;
    layout?: LayoutOption;
    topBarTools: DrawingTools[];
    hideTopBar?: boolean;
};
type SelectMode = "drag" | "rotate" | "resize-nw" | "resize-ne" | "resize-se" | "resize-sw";
declare function ReactDraw({ children, topBarTools, hideTopBar, ...props }: ReactDrawProps): JSX.Element;
declare const freeDrawTool: DrawingTools;
declare const selectTool: DrawingTools;
declare const squareTool: DrawingTools;
declare const circlTool: DrawingTools;
declare const diamondTool: DrawingTools;
declare const straightLineTool: DrawingTools;
declare const textAreaTool: DrawingTools;
export { ReactDraw, freeDrawTool, selectTool, squareTool, circlTool as circleTool, diamondTool, straightLineTool, textAreaTool };
//# sourceMappingURL=index.d.ts.map