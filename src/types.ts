export type ReactChild = React.ReactNode | React.ReactElement | JSX.Element;
export type LayoutAbsolute = {
  width: number | string;
  height: number | string;
};

export type LayoutOption = "default" | LayoutAbsolute | "fit";

export type onResizeContext = {
  viewContainer: HTMLDivElement;
  previousPoint: Point;
  newPoint: Point;
  mode: SelectMode;
};

export type ReactDrawContext = {
  viewContainer: HTMLDivElement;
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
  onDrawStart: (data: DrawingData, viewContainer: HTMLDivElement) => void;
  onDrawing: (data: DrawingData, viewContainer: HTMLDivElement) => void;
  onDrawEnd: (data: DrawingData, viewContainer: HTMLDivElement) => void;
  onResize: (data: DrawingData, ctx: onResizeContext) => void;
  onSelect?: (data: DrawingData, ctx: ReactDrawContext) => void;
  onAfterUpdate?: (data: DrawingData, ctx: ReactDrawContext) => void;
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
  customData: any;
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
