import { EraserIcon } from "@jzohdi/jsx-icons";
import React from "react";
import { ERASE_TOOL_ID } from "../constants";
import {
  ActionObject,
  DrawingData,
  DrawingTools,
  Point,
  ReactDrawContext,
} from "../types";
import {
  expandContainer,
  getBoxSize,
  isRectBounding,
  makeBoundingRect,
  mapPointToRect,
} from "../utils";
import { createPathSvg, createSvg } from "../utils/svgUtils";
import {
  deleteCreatedObjects,
  pushActionToStack,
  recreateDeletedObjects,
} from "../utils/undo";
import { deleteObjectAndNotify } from "../utils/utils";

const eraserIconBase64 =
  "PHN2ZyB3aWR0aD0iMTkiIGhlaWdodD0iMTgiIHZpZXdCb3g9IjAgMCAxOSAxOCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEwLjA2MTYgMC41ODY1NzNMNS4zMTE1OSA1LjMzNjU3TDAuNTgxNTg1IDEwLjE3NjZDMC4yMDkwODQgMTAuNTUxMyAwIDExLjA1ODIgMCAxMS41ODY2QzAgMTIuMTE0OSAwLjIwOTA4NCAxMi42MjE4IDAuNTgxNTg1IDEyLjk5NjZMNC44ODE1OSAxNy4yOTY2QzUuMDY3ODUgMTcuNDgxMyA1LjMxOTI1IDE3LjU4NTUgNS41ODE1OSAxNy41ODY2SDE3LjU4MTZWMTUuNTg2NkgxMC41ODE2TDE3LjgwMTYgOC4zNjY1N0MxNy45ODc1IDguMTgwODMgMTguMTM1MSA3Ljk2MDI1IDE4LjIzNTcgNy43MTc0NUMxOC4zMzY0IDcuNDc0NjYgMTguMzg4MiA3LjIxNDQgMTguMzg4MiA2Ljk1MTU3QzE4LjM4ODIgNi42ODg3NCAxOC4zMzY0IDYuNDI4NDkgMTguMjM1NyA2LjE4NTY5QzE4LjEzNTEgNS45NDI5IDE3Ljk4NzUgNS43MjIzMiAxNy44MDE2IDUuNTM2NTdMMTIuODkxNiAwLjU4NjU3M0MxMi43MDU4IDAuNDAwNjIgMTIuNDg1MyAwLjI1MzEwMiAxMi4yNDI1IDAuMTUyNDU0QzExLjk5OTcgMC4wNTE4MDUzIDExLjczOTQgMCAxMS40NzY2IDBDMTEuMjEzOCAwIDEwLjk1MzUgMC4wNTE4MDUzIDEwLjcxMDcgMC4xNTI0NTRDMTAuNDY3OSAwLjI1MzEwMiAxMC4yNDczIDAuNDAwNjIgMTAuMDYxNiAwLjU4NjU3M1YwLjU4NjU3M1pNNS45OTE1OSAxNS41ODY2TDEuOTkxNTkgMTEuNTg2Nkw2Ljc0MTU5IDYuNzQ2NTdMNy40ODE1OSA1Ljk5NjU3TDEyLjQzMTYgMTAuOTQ2Nkw3Ljg3MTU5IDE1LjUwNjZMNy44MDE1OSAxNS41ODY2SDUuOTkxNTlaIiBmaWxsPSJibGFjayI+PC9wYXRoPgo8L3N2Zz4=";

type EraseToolCustomState = {
  deletedObjects: Map<string, DrawingData>;
};

// TODO: alter item on drawing
// then finally delete stuff on draw end
const eraseTool: DrawingTools = {
  icon: <EraserIcon />,
  id: ERASE_TOOL_ID,
  cursor: `url('data:image/svg+xml;base64,${eraserIconBase64}') 0 16, pointer`,
  setupCustomState(): EraseToolCustomState {
    return {
      deletedObjects: new Map(),
    };
  },
  onDrawStart(data, viewContainer) {},
  onDrawing(data, ctx) {
    const viewContainer = ctx.viewContainer;
    expandContainer(data);
    const boxSize = getBoxSize(data);
    const newSvg = createSvg(boxSize.width, boxSize.height);
    const eraserPath = getEraserPath(data, viewContainer);
    newSvg.appendChild(eraserPath);
    data.container.div.innerHTML = "";
    data.container.div.appendChild(newSvg);
    data.element = newSvg;
    const lastPoint = data.coords[data.coords.length - 1];
    const bounds = makeBoundingRect(lastPoint);
    const objectKeys = Object.keys(ctx.objectsMap);
    for (const objectId of objectKeys) {
      const object = ctx.objectsMap.get(objectId);
      if (!object) {
        continue;
      }
      if (isRectBounding(object.container.bounds, bounds)) {
        deleteObjectAndNotify(objectId, ctx);
        addObjectToCustomState(ctx, object);
      }
    }
  },
  onDrawEnd(data, ctx) {
    const { objectsMap, viewContainer } = ctx;
    viewContainer.removeChild(data.container.div);
    objectsMap.delete(data.container.id);
    const action: ActionObject = {
      toolId: data.toolId,
      toolType: "top-bar-tool",
      objectId: "",
      action: "delete",
      data: ctx.customState.deletedObjects,
    };
    ctx.customState.deletedObjects = {};
    pushActionToStack(action, ctx);
  },
  onUndo(action, ctx) {
    if (action.action === "delete") {
      return recreateDeletedObjects(action, ctx);
    }
    console.error("unrecognized action", action);
    throw new Error();
  },
  onRedo(action, ctx) {
    if (action.action === "create") {
      return deleteCreatedObjects(action, ctx);
    }
    console.error("unrecognized action", action);
    throw new Error();
  },
  onResize(data, ctx) {},
};

export default eraseTool;

function addObjectToCustomState(
  ctx: ReactDrawContext,
  object: DrawingData
): void {
  const state = ctx.customState as EraseToolCustomState;
  state.deletedObjects.set(object.container.id, object);
}

function getEraserPath(
  data: DrawingData,
  viewContainer: HTMLDivElement
): SVGPathElement {
  const newPath = createPathSvg(10);
  newPath.setAttribute("d", getEraserPathDString(data, viewContainer));
  newPath.setAttribute("stroke", "rgba(232, 16, 84, 0.142)");
  return newPath;
}

function getEraserPathDString(
  data: DrawingData,
  viewContainer: HTMLDivElement
): string {
  let pathString = "";
  let lastPoint = data.coords[0];
  for (let i = 0; i < data.coords.length; i++) {
    const point = data.coords[i];
    const mappedPoint = mapPointToRect(point, data.container, viewContainer);
    pathString += getPathPoint(mappedPoint, lastPoint, i);
    lastPoint = mappedPoint;
    if (i !== data.coords.length - 1) {
      pathString += " ";
    }
  }
  return pathString;
}

function getPathPoint(curr: Point, prev: Point, index: number): string {
  if (index === 0) {
    return `M ${curr[0]} ${curr[1]}`;
  }
  return `l ${curr[0] - prev[0]} ${curr[1] - prev[1]}`;
}
