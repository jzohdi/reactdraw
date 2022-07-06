export type ReactChild = React.ReactNode | React.ReactElement | JSX.Element;
export type LayoutAbsolute = {
  width: number | string;
  height: number | string;
};

export type LayoutOption = "default" | LayoutAbsolute | "fit";

export type DrawingTools = {
  icon: JSX.Element;
  id: string;
  onDrawStart: (data: DrawingData, viewContainer: HTMLDivElement) => void;
  onDrawing: (data: DrawingData, viewContainer: HTMLDivElement) => void;
  onDrawEnd: (data: DrawingData, viewContainer: HTMLDivElement) => void;
  onUpdate: (data: DrawingData, viewContainer: HTMLDivElement) => void;
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
  element: JSX.Element | SVGSVGElement | null;
  style: {
    lineWidth: number;
    zIndex: number;
  };
};

export type ReactDrawProps = {
  children?: ReactChild;
  layout?: LayoutOption;
  topBarTools: DrawingTools[];
};
