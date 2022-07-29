import React, { useEffect, useMemo, useRef, useState } from "react";
import Container from "./Container";
import { TopToolBar } from "./TopToolBar";
import {
  ActionObject,
  BottomToolDisplayMap,
  CapturedEvent,
  CustomState,
  DrawingData,
  DrawingDataMap,
  DrawingTools,
  LayoutOption,
  Point,
  ReactChild,
  ReactDrawContext,
  ReactDrawProps,
  StringObject,
  ToolPropertiesMap,
  ToolStylesMap,
} from "../types";
import { Children } from "react";
import { makeNewBoundingDiv } from "../utils";
import { BottomToolBar } from "./BottomToolBar";
import { ERASE_TOOL_ID, SELECT_TOOL_ID } from "../constants";
import {
  getObjectFromMap,
  getRelativePoint,
  getTouchCoords,
  isNotUndefined,
} from "../utils/utils";
import {
  getSelectedIdsFromFullState,
  selectElement,
  unselectAll,
} from "../utils/select/utils";
import { getSelectedDrawingObjects } from "../utils/select/getSelectedDrawingObjects";
import EditMenu from "./EditMenu";
import { pushActionToStack } from "../utils/undo";

export default function ReactDraw({
  children,
  id = "main",
  topBarTools,
  hideTopBar,
  bottomBarTools,
  hideBottomBar,
  shouldKeepHistory = true,
  shouldSelectAfterCreate = true,
  styleComponents,
  ...props
}: ReactDrawProps): JSX.Element {
  const drawingAreaRef = useRef<HTMLDivElement>(null);
  const [currentDrawingTool, setCurrentDrawingTool] = useState(topBarTools[0]);
  const { layout } = validateProps(children, props.layout);
  const renderedElementsMap = useRef<DrawingDataMap>(new Map());
  const currDrawObj = useRef<DrawingData | null>(null);
  const drawingAreaId = useRef<string>(`drawing-area-container-${id}`);
  const previousMousePos = useRef<Point | null>(null);
  const latestEvent = useRef<CapturedEvent>(null);
  const customState = useRef<CustomState>(setupCustomStateSpace(topBarTools));
  const undoStack = useRef<ActionObject[]>([]);
  const redoStack = useRef<ActionObject[]>([]);
  const objectToSelect = useRef<DrawingData | null>(null);
  const globalStyles = useRef<ToolPropertiesMap>(
    setupGlobalStyles(topBarTools)
  );
  // bottomToolsDisplayMap is used to set whether the bottom tool should be display | hidden | show
  const [bottomToolsDisplayMap, setBottomToolsDisplayMap] =
    useState<BottomToolDisplayMap>(new Map());

  const makeBottomBarDisplayMap = () => {
    const bottomDisplayMap: BottomToolDisplayMap = new Map();
    return bottomBarTools.reduce((prev, curr) => {
      prev.set(curr.id, curr.getDisplayMode(getReactDrawContext()));
      return prev;
    }, bottomDisplayMap);
  };

  const updateBottomToolDisplayMap = () => {
    const newMap = makeBottomBarDisplayMap();
    if (newMap.size !== bottomToolsDisplayMap.size) {
      return setBottomToolsDisplayMap(newMap);
    }
    const newMapKeys = newMap.keys();
    for (const key of newMapKeys) {
      if (newMap.get(key) !== bottomToolsDisplayMap.get(key)) {
        return setBottomToolsDisplayMap(newMap);
      }
    }
  };

  useEffect(() => {
    updateBottomToolDisplayMap();
  }, []);

  useEffect(() => {
    if (currentDrawingTool.id === SELECT_TOOL_ID) {
      const obj = objectToSelect.current;
      if (obj) {
        const ctx = getReactDrawContext();
        unselectEverything(ctx);
        ctx.fullState[SELECT_TOOL_ID].selectedIds = [obj.container.id];
        selectElement(obj, ctx);
      }
    }
    updateBottomToolDisplayMap();
  }, [currentDrawingTool]);

  /**
   * Assumes that the object is on the view and in the renderedMap
   * Changes the tool to the select tool if not already.
   * then selects the object
   * @param data
   */
  const selectObject = (data: DrawingData) => {
    if (currentDrawingTool.id !== SELECT_TOOL_ID) {
      objectToSelect.current = data;
      return setCurrentDrawingTool(getToolById(topBarTools, SELECT_TOOL_ID));
    }
    const ctx = getReactDrawContext();
    unselectEverything(ctx);
    selectElement(data, ctx);
    updateBottomToolDisplayMap();
  };

  const getReactDrawContext = (viewC?: HTMLDivElement): ReactDrawContext => {
    const viewContainer = viewC || getViewContainer();
    const fullState = customState.current;
    return {
      viewContainer,
      objectsMap: renderedElementsMap.current,
      lastEvent: latestEvent.current,
      prevMousePosition: previousMousePos,
      drawingTools: topBarTools,
      fullState,
      undoStack: undoStack.current,
      redoStack: redoStack.current,
      shouldKeepHistory,
      selectDrawingTool: handleSelectTopTool,
      selectObject,
      shouldSelectAfterCreate,
    };
  };

  function alertToolOfKeydown(e: KeyboardEvent) {
    if (currentDrawingTool.onKeyPress) {
      currentDrawingTool.onKeyPress(e, getReactDrawContext());
      updateBottomToolDisplayMap();
    }
  }

  const getViewContainer = () => {
    const viewContainer = drawingAreaRef.current;
    if (!viewContainer) {
      throw new Error("no view container while resizing");
    }
    return viewContainer;
  };

  /**
   * @param eventTarget The target of the mouse or touch event
   * @param relativePoint a point [x, y] relative to the drawing area box
   * @returns
   */
  function starDraw(relativePoint: Point) {
    const ctx = getReactDrawContext();
    const styles = { ...globalStyles.current };
    const newDrawingData = makeNewBoundingDiv(
      relativePoint,
      styles,
      currentDrawingTool.id
    );
    currDrawObj.current = newDrawingData;
    ctx.viewContainer.append(newDrawingData.container.div);
    currentDrawingTool.onDrawStart(newDrawingData, ctx);
  }

  function drawing(relativePoint: Point) {
    // need to do this first because currentDrawing data is null during
    // select mode.
    const currentDrawingData = currDrawObj.current;
    if (!currentDrawingData) {
      return;
    }
    const ctx = getReactDrawContext();
    currentDrawingData.coords.push(relativePoint);
    currentDrawingTool.onDrawing(currentDrawingData, ctx);
  }

  function endDraw(relativePoint: Point) {
    const currentDrawingData = currDrawObj.current;
    // currentSelectMode.current = null;
    previousMousePos.current = null;
    currDrawObj.current = null;
    if (!currentDrawingData) {
      return;
    }
    currentDrawingData.coords.push(relativePoint);
    renderedElementsMap.current.set(
      currentDrawingData.container.id,
      currentDrawingData
    );
    currentDrawingTool.onDrawEnd(currentDrawingData, getReactDrawContext());
    updateBottomToolDisplayMap();
  }

  useEffect(() => {
    const container = drawingAreaRef.current;
    if (!container) {
      return;
    }
    function startDrawMouse(e: MouseEvent) {
      latestEvent.current = e;
      const startPoint: Point = [e.clientX, e.clientY];
      const relativePoint = getRelativePoint(startPoint, container);
      starDraw(relativePoint);
    }

    function drawMouse(e: MouseEvent) {
      latestEvent.current = e;
      const point: Point = [e.clientX, e.clientY];
      const relativePoint = getRelativePoint(point, container);
      drawing(relativePoint);
    }

    function endDrawMouse(e: MouseEvent) {
      latestEvent.current = e;
      const point: Point = [e.clientX, e.clientY];
      const relativePoint = getRelativePoint(point, container);
      endDraw(relativePoint);
    }

    function startDrawTouch(e: TouchEvent) {
      latestEvent.current = e;
      e.preventDefault();
      const startPoint = getTouchCoords(e);
      const relativePoint = getRelativePoint(startPoint, container);
      starDraw(relativePoint);
    }

    function drawTouch(e: TouchEvent) {
      latestEvent.current = e;
      e.preventDefault();
      const point = getTouchCoords(e);
      const relativePoint = getRelativePoint(point, container);
      drawing(relativePoint);
    }
    function endDrawTouch(e: TouchEvent) {
      latestEvent.current = e;
      e.preventDefault();
      const startPoint = getTouchCoords(e);
      const relativePoint = getRelativePoint(startPoint, container);
      endDraw(relativePoint);
    }

    container.addEventListener("mousedown", startDrawMouse);
    container.addEventListener("mouseup", endDrawMouse);
    container.addEventListener("mousemove", drawMouse);
    container.addEventListener("touchstart", startDrawTouch, {
      passive: false,
    });
    container.addEventListener("touchmove", drawTouch, { passive: false });
    container.addEventListener("touchcancel", endDrawTouch);
    container.addEventListener("touchend", endDrawTouch);
    container.addEventListener("mouseleave", endDrawMouse);
    window.addEventListener("keydown", alertToolOfKeydown);
    return () => {
      container.removeEventListener("mousedown", startDrawMouse);
      container.removeEventListener("mouseup", endDrawMouse);
      container.removeEventListener("mousemove", drawMouse);
      container.removeEventListener("touchstart", startDrawTouch);
      container.removeEventListener("touchmove", drawTouch);
      container.removeEventListener("touchcancel", endDrawTouch);
      container.removeEventListener("touchend", endDrawTouch);
      container.removeEventListener("mouseleave", endDrawMouse);
      window.removeEventListener("keydown", alertToolOfKeydown);
      // avoid leaks. ex: if unmount while select tool, there would be leaked dom event handlers
      // container b/c ref will be gone
      const ctx = getReactDrawContext(container);
      for (const tool of topBarTools) {
        if (tool.onUnMount) {
          tool.onUnMount(ctx);
        }
      }
    };
  }, [currentDrawingTool]);

  const handleSelectTopTool = (toolId: string) => {
    if (currentDrawingTool.id !== toolId) {
      const selectedTool = getToolById(topBarTools, toolId);
      if (!!selectedTool) {
        const currentTool = currentDrawingTool;
        const currentCtx = getReactDrawContext();
        if (currentTool.onUnPickTool) {
          currentTool.onUnPickTool(currentCtx);
        }
        if (selectedTool.onPickTool) {
          selectedTool.onPickTool(currentCtx);
        }
        setCurrentDrawingTool(selectedTool);
        updateBottomToolDisplayMap();
      }
    }
  };

  const dispatchBottomToolCtx = (cb: (data: ReactDrawContext) => void) => {
    const ctx = getReactDrawContext();
    cb(ctx);
    updateBottomToolDisplayMap();
  };

  /**
   	if single selected object return those
	if multiple return union
	if none return default */
  const handleGetEditProps = (): StringObject => {
    const ctx = getReactDrawContext();
    const selectedIds = getSelectedIdsFromFullState(ctx);
    if (selectedIds.length === 0) {
      const styles = globalStyles.current;
      return styles;
    }
    const styles = getEditStylesFromSelected(selectedIds, ctx);
    return styles;
  };

  const handleUpdateStyles = (key: keyof ToolPropertiesMap, value: string) => {
    const ctx = getReactDrawContext();
    const selectedIds = getSelectedIdsFromFullState(ctx);
    if (selectedIds.length === 0) {
      globalStyles.current[key] = value;
      return [];
    }
    const selectObjects = selectedIds.map((id) =>
      getObjectFromMap(ctx.objectsMap, id)
    );
    const allActions = selectObjects.map((obj) => {
      const tool = getToolById(ctx.drawingTools, obj.toolId);
	  const handlers = tool.styleHandlers
      if (handlers && handlers[key]) {
        return handlers[key](obj,  value, ctx);
      }
      return undefined;
    });
    // TODO: notify
	pushStyleUpdateToStack(allActions, ctx);
    return allActions;
  };

  const pushStyleUpdateToStack = (actions: (ActionObject | undefined)[], ctx: ReactDrawContext) => {
	const filterUndefined: ActionObject[] = actions.filter(isNotUndefined<ActionObject>);
	if (filterUndefined.length === 0) {
		return;
	}
	const action: ActionObject = {
		data: filterUndefined,
		objectId: "",
		toolId: "",
		toolType: "batch",
		action: "batch"
	}
	pushActionToStack(action, ctx);
  }

  // TODO: handle non-style menu components
  const hasMenuItems = !!styleComponents && !isObjEmpty(styleComponents);

  return (
    <Container layout={layout}>
      {!hideTopBar && (
        <TopToolBar
          tools={topBarTools}
          onSelectTool={handleSelectTopTool}
          currentTool={currentDrawingTool.id}
        />
      )}
      <div
        id={drawingAreaId.current}
        style={{
          position: "relative",
          width: "100%",
          flex: 1,
          boxSizing: "border-box",
        }}
        ref={drawingAreaRef}
      >
        {children}
      </div>
      {!hideBottomBar && (
        <BottomToolBar
          displayMap={bottomToolsDisplayMap}
          tools={bottomBarTools}
          dispatch={dispatchBottomToolCtx}
          hasMenu={hasMenuItems}
        >
          <EditMenu
            getEditProps={handleGetEditProps}
            styleComponents={styleComponents}
            onUpdateStyle={handleUpdateStyles}
          />
        </BottomToolBar>
      )}
      <style>{`
		#${drawingAreaId.current} {
			cursor: ${currentDrawingTool.cursor || "default"};
		}
	  `}</style>
    </Container>
  );
}

function validateProps(children: ReactChild, layout?: LayoutOption) {
  const numChildren = Children.count(children);
  if (numChildren > 1) {
    throw new Error("ReactDraw expects either 0 or 1 children, detected more.");
  }
  if (layout === undefined) {
    layout = "default";
  }
  return { numChildren, layout };
}

function getToolById(tools: DrawingTools[], id: string): DrawingTools {
  const tool = tools.find((t) => t.id === id);
  if (!tool) {
    throw new Error("could not find the used tool");
  }
  return tool;
}
function setupCustomStateSpace(tools: DrawingTools[]): CustomState {
  const state: CustomState = {
    [SELECT_TOOL_ID]: {
      selectedIds: [],
      handlers: {},
      prevPoint: null,
    },
    [ERASE_TOOL_ID]: {
      deletedObjects: new Map(),
    },
  };
  return tools.reduce((prev, curr) => {
    if (prev[curr.id] === undefined) {
      prev[curr.id] = {};
    }
    if (curr.setupCustomState) {
      prev[curr.id] = Object.assign(
        prev[curr.id],
        curr.setupCustomState(state)
      );
    }
    return prev;
  }, state);
}

function unselectEverything(ctx: ReactDrawContext): void {
  const currSelected = ctx.fullState[SELECT_TOOL_ID].selectedIds;
  if (currSelected.length > 0) {
    const objects = getSelectedDrawingObjects(currSelected, ctx.objectsMap);
    unselectAll(objects, ctx);
  }
  return;
}
const defaultEditableProps: ToolPropertiesMap = {
  lineWidth: "4",
  zIndex: "1",
  color: "#000000",
  fontSize: "14",
  background: "transparent",
  opacity: "1",
};

function isObjEmpty(obj: { [key: string]: any }): boolean {
  for (var _x in obj) {
    return false;
  }
  return true;
}

// TODO: accept default styles as a react-draw prop
function setupGlobalStyles(topBarTools: DrawingTools[]) {
  const styles: ToolPropertiesMap = {
    ...defaultEditableProps,
  };

  return styles;
}

function getEditStylesFromSelected(
  selectedIds: string[],
  ctx: ReactDrawContext
): StringObject {
  const styles: StringObject = {};
  const selectedObjects = selectedIds.map((i) =>
    getObjectFromMap(ctx.objectsMap, i)
  );

  // count so that only shared keys are allowed
 const counter: {[id: string]: number} = {}

  for (const object of selectedObjects) {
    const tool = getToolById(ctx.drawingTools, object.toolId);
    if (tool.styleHandlers) {
      const toolsAllowedStyles = Object.keys(tool.styleHandlers);
      for (const key of toolsAllowedStyles) {
        // TODO
        const currentObjectValue = object.style[key];
        if (currentObjectValue) {
          styles[key] = currentObjectValue;
		  counter[key] = (counter[key] || 0) + 1
        } else {
          console.error(
            "could not get style value for key:",
            key,
            "from object",
            object
          );
        }
      }
    }
  }
  for (const key in counter) {
	if (counter[key] !== selectedObjects.length) {
		delete styles[key]
	}
  }
  //   console.log("getEditStylesFromSelected:", styles);
  return styles;
}
