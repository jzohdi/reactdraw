export type ReactChild = React.ReactNode | React.ReactElement | JSX.Element;
export type LayoutAbsolute = {
  width: number | string;
  height: number | string;
};

export type LayoutOption = "default" | LayoutAbsolute | "fit";

export type OnUpdateContext = {
  viewContainer: HTMLDivElement;
  previousPoint: Point;
  newPoint: Point;
  mode: SelectMode;
};

export type DrawingTools = {
  icon: JSX.Element;
  id: string;
  onDrawStart: (data: DrawingData, viewContainer: HTMLDivElement) => void;
  onDrawing: (data: DrawingData, viewContainer: HTMLDivElement) => void;
  onDrawEnd: (data: DrawingData, viewContainer: HTMLDivElement) => void;
  onUpdate: (data: DrawingData, ctx: OnUpdateContext) => void;
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
