import{j as n,M as s}from"./blocks-BASEmEwa.js";import{useMDXComponents as o}from"./index-D2gDddpe.js";import"./preload-helper-PPVm8Dsz.js";import"./iframe-ThtCju29.js";import"./index-CEcb62mv.js";function r(t){const e={code:"code",h1:"h1",h2:"h2",p:"p",pre:"pre",...o(),...t.components};return n.jsxs(n.Fragment,{children:[n.jsx(s,{title:"Docs/Type Descriptions"}),`
`,n.jsx(e.h1,{id:"type-descriptions",children:"Type Descriptions"}),`
`,n.jsx(e.h2,{id:"reactdraw-prop-types",children:"ReactDraw Prop Types"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-typescript",children:`type ReactDrawProps = {
  children?: ReactChild;
  layout?: LayoutOption;
  drawingTools: DrawingTools[];
  hideTopBar?: boolean;
  actionTools: ActionTools[];
  hideBottomBar?: boolean;
  shouldKeepHistory?: boolean;
  shouldSelectAfterCreate?: boolean;
  id: string;
  styleComponents?: StyleComponents;
  menuComponents?: MenuComponent[];
  styles?: StylesObject;
  classNames?: ClassNamesObject;
};

type LayoutOption = "default" | LayoutAbsolute | "fit";

type LayoutAbsolute = {
  width: number | string;
  height: number | string;
};

type StylesObject = {
  bottomBarContainer?: StylesValue;
  toolIconWrapper?: StylesValue;
  clearAllButton?: StylesValue;
  alertMessageDialog?: StylesValue;
  bottomToolButton?: StylesValue;
  menuButton?: StylesValue;
  menuContainer?: StylesValue;
  topBarBontainer?: StylesValue;
  [other: string]: StylesValue | undefined;
};

type ClassNamesObject = {
  bottomBarContainer?: string;
  toolIconWrapper?: string;
  clearAllButton?: string;
  alertMessageDialog?: string;
  bottomToolButton?: string;
  menuButton?: string;
  menuContainer?: string;
  topBarBontainer?: string;
  [other: string]: string | undefined;
};

type KeyFramesValue = {
  [percent: string]: CSSProperties;
};

type KeyFramesDefinition = {
  [keyframesDef: string]: KeyFramesValue;
};

type StylesValue =
  | CSSProperties
  | {
      [selector: string]: CSSProperties;
    }
  | KeyFramesDefinition;
`})}),`
`,n.jsx(e.p,{children:"These are the core types you will work with in ReactDraw."}),`
`,n.jsx(e.h2,{id:"point",children:"Point"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-typescript",children:`type Point = [number, number];
`})}),`
`,n.jsx(e.h2,{id:"rectbounds",children:"RectBounds"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-typescript",children:`type RectBounds = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};
`})}),`
`,n.jsx(e.h2,{id:"drawingcontainer",children:"DrawingContainer"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-typescript",children:`type DrawingContainer = {
  div: HTMLDivElement;
  id: string;
};
`})}),`
`,n.jsx(e.h2,{id:"drawingdata",children:"DrawingData"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-typescript",children:`type DrawingData = {
  id: string;
  containerDiv: HTMLDivElement;
  coords: Point[];
  element: HTMLElement | SVGSVGElement | null;
  style: ToolPropertiesMap;
  toolId: string;
  customData: Map<string, any>;
};
`})}),`
`,n.jsx(e.h2,{id:"onresizecontext",children:"OnResizeContext"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-typescript",children:`type OnResizeContext = {
  viewContainer: HTMLDivElement;
  previousPoint: Point;
  newPoint: Point;
  shouldPreserveAspectRatio: boolean;
};
`})}),`
`,n.jsx(e.h2,{id:"selectmode",children:"SelectMode"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-typescript",children:`type SelectMode =
  | "drag"
  | "rotate"
  | "resize-nw"
  | "resize-ne"
  | "resize-se"
  | "resize-sw";
`})}),`
`,n.jsx(e.h2,{id:"toolpropertiesmap",children:"ToolPropertiesMap"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-typescript",children:`type ToolPropertiesMap = {
  lineWidth: string;
  zIndex: string;
  color: string;
  fontSize: string;
  background: string;
  opacity: string;
  [id: string]: string;
};
`})})]})}function d(t={}){const{wrapper:e}={...o(),...t.components};return e?n.jsx(e,{...t,children:n.jsx(r,{...t})}):r(t)}export{d as default};
