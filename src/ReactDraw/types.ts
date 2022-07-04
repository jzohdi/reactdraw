export type ReactChild = React.ReactNode | React.ReactElement | JSX.Element;
export type LayoutAbsolute = {
  width: number | string;
  height: number | string;
};

export type LayoutOption = "default" | LayoutAbsolute | "fit";

export type DrawingTools = {
  icon: JSX.Element;
  id?: string;
  onDrawStart: (
    data: CurrentDrawingData,
    viewContainer: HTMLDivElement
  ) => void;
  onDrawing: (data: CurrentDrawingData, viewContainer: HTMLDivElement) => void;
  onDrawEnd: (data: CurrentDrawingData, viewContainer: HTMLDivElement) => void;
  cursor?: string;
};

export type Point = [number, number];

export type DrawingContainer = {
  div: HTMLDivElement;
  id: string;
  bounds: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
};
export type CurrentDrawingData = {
  coords: Point[];
  container: DrawingContainer;
  element: JSX.Element | SVGSVGElement | null;
  style: {
    lineWidth: number;
  };
};
