import{j as e,M as a,a as n}from"./blocks-BASEmEwa.js";import{useMDXComponents as r}from"./index-D2gDddpe.js";import{R as i}from"./ReactDraw.stories-CbwVaTZV.js";import"./preload-helper-PPVm8Dsz.js";import"./iframe-ThtCju29.js";import"./index-CEcb62mv.js";import"./ClearAllButton-DK1678Z8.js";import"./publicUtils-CtIMU_v1.js";function l(o){const t={h2:"h2",...r(),...o.components};return e.jsxs(e.Fragment,{children:[e.jsx(a,{of:i}),`
`,e.jsx(t.h2,{id:"playground",children:"Playground"}),`
`,e.jsx(n,{code:`
<ReactDraw
  drawingTools: [  
    selectTool,
    freeDrawTool,
    squareTool,
    circleTool,
    diamondTool,
    straightLineTool,
    textAreaTool,
    arrowTool,
    eraseTool
  ],
  actionTools: [  
    undoTool,
    redoTool,
    trashTool,
    duplicateTool,
    bringBackTool,
    bringForwardTool
  ],
  shouldSelectAfterCreate: true,
  isResponsive: false,
  shouldCornerResizePreserveRatio: false,
  styleComponents: {
    color: { order: 3, component: ColorStyle },
    background: { order: 4, component: BackgroundStyle },
    lineWidth: { order: 1, component: LineWidthStyle },
    opacity: { order: 0, component: OpacityStyle },
    fontSize: { order: 2, component: FontSizeStyle },
  },
  menuComponents: [ClearAllButton],
/>
`}),`
`,e.jsx(t.h2,{id:"free-draw-only",children:"Free Draw Only"}),`
`,e.jsx(n,{code:`
<ReactDraw
  drawingTools: [freeDrawTool],
  hideTopBar: true,
  hideBottomBar: true,
  shouldSelectAfterCreate: false,
  shouldKeepHistory: false,
/>
`}),`
`,e.jsx(t.h2,{id:"save-and-load-json",children:"Save and Load Json"}),`
`,e.jsx(n,{code:`
const serializers: Serializers = {
  [freeDrawTool.id]: serializeFreeDraw,
  [squareTool.id]: serializeSquare,
  [circleTool.id]: serializeCircle,
  [diamondTool.id]: serializeDiamond,
  [straightLineTool.id]: serializeLine,
  [textAreaTool.id]: serializeText,
  [arrowTool.id]: serializeArrow,
};

const deserializers: Deserializers = {
  [freeDrawTool.id]: deserializeFreeDraw,
  [squareTool.id]: deserializeSquare,
  [circleTool.id]: deserializeCircle,
  [diamondTool.id]: deserializeDiamond,
  [straightLineTool.id]: deserializeLine,
  [textAreaTool.id]: deserializeTextArea,
  [arrowTool.id]: deserializeArrow,
};

const drawingTools: DrawingTools[] = [
  selectTool,
  freeDrawTool,
  squareTool,
  circleTool,
  diamondTool,
  straightLineTool,
  textAreaTool,
  arrowTool,
  eraseTool,
];

const inputId = "save-canvas-button";

const SaveCanvas: MenuComponent = ({ getContext }) => {
const classes = useStyles("saveCanvasComponent");
const ref = useRef<HTMLButtonElement>(null);

const handleSaveCanvas = () => {
  const ctx = getContext();
  const data = serializeObjects(serializers, ctx);
  if (window) window.localStorage.setItem("react-draw-saved-data", data);
};

return (
  <button
    className={classes}
    id={inputId}
    onClick={handleSaveCanvas}
    ref={ref}
  >
    <div style={{ padding: "0px 5px", height: 15 }}>
      <DownloadIcon height={15} width={20} />
    </div>
    <label
      htmlFor={inputId}
      style={{ padding: "0px 10px", pointerEvents: "none" }}
    >
      Save Canvas
    </label>
  </button>
);
};

<ReactDraw
  drawingTools={drawingTools},
  shouldSelectAfterCreate={true}
  menuComponents=[SaveCanvas, ClearAllButton]
  shouldKeepHistory={false}
  onLoad={(ctx) => {
    const savedData = localStorage.getItem("react-draw-saved-data");
    if (savedData) deserializeData(savedData, deserializers, ctx);
  }}
  styleComponents={{
    color: { order: 3, component: ColorStyle },
    background: { order: 4, component: BackgroundStyle },
    lineWidth: { order: 1, component: LineWidthStyle },
    opacity: { order: 0, component: OpacityStyle },
    fontSize: { order: 2, component: FontSizeStyle },
  }}
  styles={{
    saveCanvasComponent: {
      width: 180,
      fontSize: 16,
      display: "flex",
      justifyContent: "flex-start",
      alignItems: "center",
      borderRadius: 5,
      cursor: "pointer",
      padding: "7px 10px",
      backgroundColor: "white",
      border: "1px solid ...",
      "&:hover": { backgroundColor: "..." }
    }
  }}
/>
`}),`
`,e.jsx(t.h2,{id:"external-controls",children:"External Controls"}),`
`,e.jsx(n,{code:`
const circleToolCopy = Object.assign({}, circleTool);
// hide from top bar by removing icon
delete circleToolCopy.icon;

const imageToolId = "my-image-tool-id";

const imageTool: DrawingTools = {
id: imageToolId,
onDrawEnd() {},
onDrawing() {},
onDrawStart() {},
onResize() {},
};

function ExternalControlsWrapper(args: ReactDrawProps) {
const contextGetterRef = useRef<() => ReactDrawContext>();
const [numSelected, setNumSelected] = useState(0);

const setContextGetter = (getCtx: () => ReactDrawContext) => {
  contextGetterRef.current = getCtx;
};

const getCtx = () => {
  const getter = contextGetterRef.current;
  if (!getter) throw new Error("Ctx getter not set");
  return getter();
};

const handleSelectedToolEvent = (_event: string) => {
  const selected = getSelectedObjects(getCtx());
  setNumSelected(selected.length);
};

const handleClickAddCircle = () => {
  const ctx = getCtx();
  const centerPoint = getViewCenterPoint(ctx);
  createCircle(ctx, {
    pointA: centerPoint,
    pointB: [centerPoint[0] + 100, centerPoint[1] + 100],
    toolId: circleTool.id,
  });
};

const handleClickAddImage = () => {
  const ctx = getCtx();
  const centerPoint = getViewCenterPoint(ctx);
  const loadingEle = document.createElement("p");
  loadingEle.innerHTML = " loading...";
  createImage(ctx, {
    pointA: centerPoint,
    pointB: [centerPoint[0] + 100, centerPoint[1] + 100],
    toolId: imageTool.id,
    url: "https://picsum.photos/200",
    showLoading: true,
    loadingElement: loadingEle,
  });
};

const handleAddCustomText = (editable: boolean) => {
  const ctx = getCtx();
  const toolId = textAreaTool.id;
  if (!editable) {
    createText(ctx, { text: "hello, world", toolId, editable: false });
    return;
  }
  createText(ctx, {
    text: "hello, world",
    toolId,
    useTextToolDefaults: true,
  });
};

const handleSelectAll = () => selectAll(getCtx());
const duplicateSelected = () => duplicateSelectedObjects(getCtx());
const moveSelectedBack = () => bringSelectedBack(getCtx());
const moveForward = () => moveSelectedForward(getCtx());
const handleDelete = () => deletedSelected(getCtx());
const handleUpdateStyles = (key: keyof ToolPropertiesMap, value: string) =>
  updateSelectedObjectsStyle(getCtx(), key, value);

if (selectTool.subscribe) selectTool.subscribe(handleSelectedToolEvent);

return (
  <div>
    <div style={{ display: "flex", gap: 10 }}>
      <div
        style={{ paddingTop: 10, display: "flex", flexDirection: "column" }}
      >
        <div>Num Selected Items: {numSelected}</div>
        <button onClick={handleClickAddCircle}>Add Circle</button>
        <button onClick={handleClickAddImage}>Add Picture</button>
        <button onClick={handleSelectAll}>Select All</button>
        <button onClick={duplicateSelected}>Duplicate Selected</button>
        <button onClick={moveSelectedBack}>Move Selected Back</button>
        <button onClick={moveForward}>Move Selected Forward</button>
        <button onClick={handleDelete}>Delete Selected</button>
        <button onClick={() => handleAddCustomText(true)}>
          Add some editable text
        </button>
        <button onClick={() => handleAddCustomText(false)}>
          Add some not editable text
        </button>
        {numSelected > 0 && (
          <div>
            <label>Stroke color</label>
            <input
              type="color"
              onChange={(e) => handleUpdateStyles("color", e.target.value)}
            />
          </div>
        )}
      </div>
      <ReactDraw 
          drawingTools: [selectTool, circleToolCopy, imageTool, textAreaTool],
          shouldKeepHistory: false,
          shouldSelectAfterCreate: true,
          hideTopBar: true,
          contextGetter={setContextGetter} />
    </div>
  </div>
);
}
`})]})}function C(o={}){const{wrapper:t}={...r(),...o.components};return t?e.jsx(t,{...o,children:e.jsx(l,{...o})}):l(o)}export{C as default};
