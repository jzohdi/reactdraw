import{j as e,M as r}from"./blocks-BASEmEwa.js";import{useMDXComponents as a}from"./index-D2gDddpe.js";import"./preload-helper-PPVm8Dsz.js";import"./iframe-ThtCju29.js";import"./index-CEcb62mv.js";function o(t){const n={code:"code",h1:"h1",h2:"h2",p:"p",pre:"pre",...a(),...t.components};return e.jsxs(e.Fragment,{children:[e.jsx(r,{title:"Docs/Drawing Tools"}),`
`,e.jsx(n.h1,{id:"top-bar-tools-drawing-tools",children:"Top Bar Tools (Drawing Tools)"}),`
`,e.jsx(n.h1,{id:"top-bar-tools-drawing-tools-1",children:"Top Bar Tools (Drawing Tools)"}),`
`,e.jsx(n.p,{children:`ReactDraw uses a plugin system for drawing tools.
This allows you to have full control over the functionality of the component.
You can import the tools you want, hook in to the drawing stages, and create your own tools.
The type definition of a drawing tool is described by the typescript below.`}),`
`,e.jsxs("ul",{children:[e.jsx("li",{children:e.jsxs(n.p,{children:[e.jsx("strong",{children:"icon: "})," the icon to be displayed in the top bar tools"]})}),e.jsx("li",{children:e.jsxs(n.p,{children:[e.jsx("strong",{children:"id"}),` required so that react draw can identify objects created
by this id`]})}),e.jsx("li",{children:e.jsxs(n.p,{children:[e.jsx("strong",{children:"cursor"}),` sets the the cursor of the mouse while over the
viewContainer`]})}),e.jsx("li",{children:e.jsxs(n.p,{children:[e.jsx("strong",{children:"onDrawStart"}),` called on mousedown/touchstart. includes data
like the coordinates, etc. (see more below)`]})}),e.jsx("li",{children:e.jsxs(n.p,{children:[e.jsx("strong",{children:"onDrawing"})," called during each new point. (mousemove)"]})}),e.jsx("li",{children:e.jsxs(n.p,{children:[e.jsx("strong",{children:"onDrawEnd"})," called after mouseup/touchend"]})}),e.jsx("li",{children:e.jsxs(n.p,{children:[e.jsx("strong",{children:"onResize"}),` called when the object is being resized (corner
expand action while using select tool)`]})}),e.jsx("li",{children:e.jsxs(n.p,{children:[e.jsx("strong",{children:"DrawingData"}),` includes the mouse coordinates, the container
div, current styles, etc.`]})}),e.jsx("li",{children:e.jsxs(n.p,{children:[e.jsx("strong",{children:"viewContainer"}),` the div that is the react-draw full drawing
area. This is used to help calculate relative coordinates.`]})})]}),`
`,e.jsxs(n.p,{children:["More of the types included in the ",e.jsx("strong",{children:"Type Descriptions"})," page."]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`type DrawingTools = {
  icon: JSX.Element;
  tooltip?: string;
  id: string;
  setupCustomState?: (state: CustomState) => any;
  onPickTool?: (ctx: ReactDrawContext) => void;
  onUnPickTool?: (ctx: ReactDrawContext) => void;
  onDrawStart: (data: DrawingData, ctx: ReactDrawContext) => void;
  onDrawing: (data: DrawingData, ctx: ReactDrawContext) => void;
  onDrawEnd: (data: DrawingData, ctx: ReactDrawContext) => void;
  doResize?: (data: DrawingData, ctx: OnResizeContext) => void;
  onResize: (data: DrawingData, ctx: OnResizeContext) => void;
  onSelect?: (data: DrawingData, ctx: ReactDrawContext) => void;
  onAfterUpdate?: (data: DrawingData, ctx: ReactDrawContext) => void;
  onUnSelect?: (data: DrawingData, ctx: ReactDrawContext) => void;
  onDeleteObject?: (data: DrawingData, ctx: ReactDrawContext) => void;
  onKeyPress?: (event: KeyboardEvent, ctx: ReactDrawContext) => void;
  onUnMount?: (ctx: ReactDrawContext) => void;
  onDuplicate?: (newData: DrawingData, ctx: ReactDrawContext) => DrawingData;
  undoHandlers?: {
    [action: ActionKey]: UndoHandler;
  };
  redoHandlers?: {
    [action: ActionKey]: UndoHandler;
  };
  styleHandlers?: {
    [key: keyof ToolPropertiesMap]: UpdateStyleHandler;
  };
  cursor?: string;
};
`})}),`
`,e.jsx(n.h2,{id:"free-draw-tool",children:"Free Draw Tool"}),`
`,e.jsx(n.p,{children:"For example here is the free draw tool implementation."}),`
`,e.jsx("p",{children:e.jsxs(n.p,{children:["During ",e.jsx("strong",{children:"onDrawStart"}),` the free draw tool creates a circle since
there is only a single `,e.jsxs("strong",{children:["data.coords ",e.jsx(n.code,{children:"Point"})]}),`. An svg element is
created and then appended a child to the object container. The object
container is a `,e.jsx("strong",{children:"div"}),`
element that is created for you at the correct position in the `,e.jsx("strong",{children:'"viewContainer"'})]})}),`
`,e.jsx("p",{children:e.jsxs(n.p,{children:["During ",e.jsx("strong",{children:"onDrawing"})," the tool must expand the"," ",`
`,e.jsx("strong",{children:'"viewContainer" div'}),` to be the correct dimensions. Then a new
svg is created based on the `,e.jsx("strong",{children:"data.coords"}),` information. It's
important to note that the `,e.jsx("strong",{children:"data.coords"})," points are"," ",`
`,e.jsx("strong",{children:"[x, y]"})," coordinates relative to the"," ",`
`,e.jsx("strong",{children:"viewContainer"}),`. Drawing in the top left corner of the drawing
area will be represented by `,e.jsx("strong",{children:"[0, 0]"}),` and the bottom right
corner is represented by `,e.jsx("strong",{children:"[width, height]"}),"."]})}),`
`,e.jsx("p",{children:e.jsxs(n.p,{children:["During ",e.jsx("strong",{children:"onDrawEnd"})," no more work needs to be done."]})}),`
`,e.jsx("p",{children:e.jsxs(n.p,{children:["During ",e.jsx("strong",{children:"onResize"}),` the div has been set to the correct
dimensions for you and so we need to take care of scaling the svg inside.`]})}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-typescript",children:`const freeDrawTool: DrawingTools = {
  id: "free-draw-tool",
  tooltip: "Free draw tool",
  icon: <PencilBoldIcon />,
  onDrawStart: (data) => {
    const lineWidth = parseInt(data.style.lineWidth);
    const newSvg = createSvg(lineWidth, lineWidth, data.style.opacity);
    newSvg.style.overflow = "visible";
    const newPath = createCircle(lineWidth / 2, data.style.color);
    newSvg.appendChild(newPath);
    data.container.div.appendChild(newSvg);
    data.element = newSvg;
  },
  onDrawing: (data, { viewContainer }) => {
    smoothCoords(data.coords);
    expandContainer(data);
    const boxSize = getBoxSize(data);
    const newSvg = createSvg(boxSize.width, boxSize.height, data.style.opacity);
    newSvg.style.overflow = "visible";
    const path = svgPathFromData(data, viewContainer);
    newSvg.appendChild(path);
    data.container.div.innerHTML = "";
    data.container.div.appendChild(newSvg);
    data.element = newSvg;
  },
  onDrawEnd: (data, ctx) => {
    saveCreateToUndoStack(data, ctx);
    if (ctx.shouldSelectAfterCreate) {
      ctx.selectObject(data);
    }
  },
  onResize: (data, ctx) => {
    if (!data.element) {
      return;
    }
    scaleSvg(data.element as SVGSVGElement, data.container.bounds);
  },
  undoHandlers: {
    create: undoCreate,
    delete: redoDelete,
    color: undoSvgPathColor,
    lineWidth: undoSvgPathWidth,
    opacity: undoEleOpacity,
  },
  redoHandlers: {
    create: undoCreate,
    delete: redoDelete,
    color: undoSvgPathColor,
    lineWidth: undoSvgPathWidth,
    opacity: undoEleOpacity,
  },
  styleHandlers: {
    color: (data, value, _ctx) => updateSvgPathStroke(data, value),
    lineWidth: (data, value, _ctx) => updateSvgPathWidth(data, value),
    opacity: (data, value, _ctx) => updateEleOpacity(data, value),
  },
  cursor: \`url(data:image/svg+xml;base64,\${cursorPencilBase64}) 0 16, pointer\`,
};
`})})]})}function h(t={}){const{wrapper:n}={...a(),...t.components};return n?e.jsx(n,{...t,children:e.jsx(o,{...t})}):o(t)}export{h as default};
