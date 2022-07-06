type ReactChild = React.ReactNode | React.ReactElement | JSX.Element;
type LayoutAbsolute = {
    width: number | string;
    height: number | string;
};
type LayoutOption = "default" | LayoutAbsolute | "fit";
type DrawingTools = {
    icon: JSX.Element;
    id: string;
    onDrawStart: (data: DrawingData, viewContainer: HTMLDivElement) => void;
    onDrawing: (data: DrawingData, viewContainer: HTMLDivElement) => void;
    onDrawEnd: (data: DrawingData, viewContainer: HTMLDivElement) => void;
    onUpdate: (data: DrawingData, viewContainer: HTMLDivElement) => void;
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
    element: JSX.Element | SVGSVGElement | null;
    style: {
        lineWidth: number;
        zIndex: number;
    };
};
type ReactDrawProps = {
    children?: ReactChild;
    layout?: LayoutOption;
    topBarTools: DrawingTools[];
};
declare function ReactDraw({ children, topBarTools, ...props }: ReactDrawProps): JSX.Element;
declare const freeDrawTool: DrawingTools;
export { ReactDraw, freeDrawTool };
//# sourceMappingURL=index.d.ts.map