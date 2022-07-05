type ReactChild = React.ReactNode | React.ReactElement | JSX.Element;
type LayoutAbsolute = {
    width: number | string;
    height: number | string;
};
type LayoutOption = "default" | LayoutAbsolute | "fit";
type DrawingTools = {
    icon: JSX.Element;
    id?: string;
    onDrawStart: (data: CurrentDrawingData, viewContainer: HTMLDivElement) => void;
    onDrawing: (data: CurrentDrawingData, viewContainer: HTMLDivElement) => void;
    onDrawEnd: (data: CurrentDrawingData, viewContainer: HTMLDivElement) => void;
    cursor?: string;
};
type Point = [
    number,
    number
];
type DrawingContainer = {
    div: HTMLDivElement;
    id: string;
    bounds: {
        top: number;
        right: number;
        bottom: number;
        left: number;
    };
};
type CurrentDrawingData = {
    coords: Point[];
    container: DrawingContainer;
    element: JSX.Element | SVGSVGElement | null;
    style: {
        lineWidth: number;
    };
};
type ReactDrawProps = {
    children?: ReactChild;
    layout?: LayoutOption;
    topBarTools: DrawingTools[];
};
declare function ReactDraw({ children, topBarTools, ...props }: ReactDrawProps): JSX.Element;
declare const freeDrawTool: DrawingTools;
export { ReactDrawProps, ReactDraw as default, freeDrawTool };
//# sourceMappingURL=index.d.ts.map