type ReactChild = React.ReactNode | React.ReactElement | JSX.Element;
type LayoutAbsolute = {
    width: number | string;
    height: number | string;
};
type LayoutOption = "default" | LayoutAbsolute | "fit";
type OnUpdateContext = {
    viewContainer: HTMLDivElement;
    previousPoint: Point;
    newPoint: Point;
    mode: SelectMode;
};
type DrawingTools = {
    icon: JSX.Element;
    id: string;
    onDrawStart: (data: DrawingData, viewContainer: HTMLDivElement) => void;
    onDrawing: (data: DrawingData, viewContainer: HTMLDivElement) => void;
    onDrawEnd: (data: DrawingData, viewContainer: HTMLDivElement) => void;
    onUpdate: (data: DrawingData, ctx: OnUpdateContext) => void;
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
export { ReactDraw, freeDrawTool, selectTool, squareTool, circlTool as circleTool, diamondTool, straightLineTool };
//# sourceMappingURL=index.esm.d.ts.map