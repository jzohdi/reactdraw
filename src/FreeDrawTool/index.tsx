import { PencilBoldIcon } from "@jzohdi/jsx-icons";
import React from "react";
import { CurrentDrawingData, DrawingTools } from "../types";
import {
  expandContainer,
  createCircle,
  createSvg,
  mapPointToRect,
  //   makeRelativeDiv,
} from "../utils";

const cursorPencilBase64 = `PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTQiIHZpZXdCb3g9IjAgMCAxNCAxNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEwLjU4NTggMC41ODU3ODZDMTEuMzY2OCAtMC4xOTUyNjIgMTIuNjMzMiAtMC4xOTUyNjIgMTMuNDE0MiAwLjU4NTc4NkMxNC4xOTUzIDEuMzY2ODMgMTQuMTk1MyAyLjYzMzE2IDEzLjQxNDIgMy40MTQyMUwxMi42MjEzIDQuMjA3MTFMOS43OTI4OSAxLjM3ODY4TDEwLjU4NTggMC41ODU3ODZaIiBmaWxsPSIjMTExODI3Ii8+CjxwYXRoIGQ9Ik04LjM3ODY4IDIuNzkyODlMMCAxMS4xNzE2VjE0SDIuODI4NDJMMTEuMjA3MSA1LjYyMTMyTDguMzc4NjggMi43OTI4OVoiIGZpbGw9IiMxMTE4MjciLz4KPC9zdmc+`;

const freeDrawTool: DrawingTools = {
  icon: <PencilBoldIcon />,
  onDrawStart: (data) => {
    const lineWidth = data.style.lineWidth;
    // const relativeDiv = makeRelativeDiv();
    const newSvg = createSvg(lineWidth, lineWidth);
    // const newPath = createPath();
    const newPath = createCircle(lineWidth / 2);
    newSvg.appendChild(newPath);
    // relativeDiv.appendChild(newSvg);
    // data.container.div.appendChild(relativeDiv);
    data.container.div.appendChild(newSvg);
    data.element = newSvg;
  },
  onDrawing: (data, viewContainer) => {
    expandContainer(data);
    const boxSize = getBoxSize(data);
    const newSvg = createSvg(boxSize.width, boxSize.height);
    // const relativeDiv = makeRelativeDiv();
    const path = svgPathFromData(data, viewContainer);
    path.style.width = "100%";
    path.style.height = "100%";
    newSvg.appendChild(path);
    data.container.div.innerHTML = "";
    // relativeDiv.appendChild(newSvg);
    // data.container.div.appendChild(relativeDiv);
    data.container.div.appendChild(newSvg);
    data.element = newSvg;
  },
  onDrawEnd: (data) => {
    console.log(data);
  },
  cursor: `url('data:image/svg+xml;base64,${cursorPencilBase64}') 0 16, pointer`,
};

export default freeDrawTool;

function getBoxSize(data: CurrentDrawingData) {
  const bounds = data.container.bounds;
  return {
    width: bounds.right - bounds.left,
    height: bounds.bottom - bounds.top,
  };
}

function svgPathFromData(
  data: CurrentDrawingData,
  viewContainer: HTMLDivElement
): SVGPathElement {
  const newPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  newPath.setAttribute("fill", "transparent");
  newPath.setAttribute("stroke", "black");
  newPath.setAttribute("stroke-width", "4px");
  newPath.setAttribute("stroke-linejoin", "round");
  newPath.setAttribute("stroke-linecap", "round");
  newPath.setAttribute("d", getPathDString(data, viewContainer));
  return newPath;
}
function getPathDString(
  data: CurrentDrawingData,
  viewContainer: HTMLDivElement
): string {
  let pathString = "";
  for (let i = 0; i < data.coords.length; i++) {
    const point = data.coords[i];
    const mappedPoint = mapPointToRect(point, data.container, viewContainer);
    if (i === 0) {
      pathString += `M ${mappedPoint[0]} ${mappedPoint[1]}`;
    } else {
      pathString += `L ${mappedPoint[0]} ${mappedPoint[1]}`;
    }
    if (i !== data.coords.length - 1) {
      pathString += "";
    }
  }
  return pathString;
}
