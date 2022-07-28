import { DrawingData, OnResizeContext, Point } from "../types";
import { getRotateFromDiv } from "./select/getRotateFromDiv";
import { getCenterPoint } from "./utils";

function getDiffCoords(data: DrawingData, ctx: OnResizeContext): Point {
  const [centerX, centerY] = getCenterPoint(data.container.bounds);
  const currRotation = getRotateFromDiv(data.container.div);
  if (currRotation === 0) {
    return [
      ctx.newPoint[0] - ctx.previousPoint[0],
      ctx.newPoint[1] - ctx.previousPoint[1],
    ];
  }
  const rotatedPrev = rotatePoint(
    centerX,
    centerY,
    -((currRotation + 10) * Math.PI) / 180,
    ctx.previousPoint
  );
  //   const [prevX, prevY] = ctx.previousPoint;
  const rotatedNew = rotatePoint(
    centerX,
    centerY,
    -((currRotation + 10) * Math.PI) / 180,
    ctx.newPoint
  );
  //   ctx.viewContainer.appendChild(makePoint(prevX, prevY, "purple"));
  //   ctx.viewContainer.appendChild(
  //     makePoint(rotatedPrev[0], rotatedPrev[1], "red")
  //   );
  //   ctx.viewContainer.appendChild(
  //     makePoint(rotatedNew[0], rotatedNew[1], "green")
  //   );
  //   ctx.viewContainer.appendChild(
  //     makePoint(ctx.newPoint[0], ctx.newPoint[1], "blue")
  //   );
  //   console.log({ currRotation, centerX, centerY });
  //   console.log("prev:", ctx.previousPoint, " after: ", rotatedPrev);
  //   console.log("new:", ctx.newPoint, " after: ", rotatedNew);
  return [rotatedNew[0] - rotatedPrev[0], rotatedNew[1] - rotatedPrev[1]];
}

function makePoint(x: number, y: number, color: string): HTMLDivElement {
  const div = document.createElement("div");
  div.style.width = "1px";
  div.style.height = "1px";
  div.style.border = `1px solid ${color}`;
  div.style.position = "absolute";
  div.style.top = y + "px";
  div.style.left = x + "px";
  return div;
}

function rotatePoint(cx: number, cy: number, angle: number, point: Point) {
  const s = Math.sin(angle);
  const c = Math.cos(angle);
  const [px, py] = [point[0] - cx, point[1] - cy];
  const xNew = px * c - py * s;
  const yNew = px * s + py * c;

  return [xNew + cx, yNew + cy];
  //   const [px, py] = point;
  //   return [
  //     px * Math.cos(angle) - py * Math.sin(angle),
  //     py * Math.cos(angle) + px * Math.sin(angle),
  //   ];
  //   angle += ( * Math.PI) / 180;
  //   return [
  //     Math.cos(angle) * (px - cx) - Math.sin(angle) * (py - cy) + cx,
  //     Math.sin(angle) * (px - cx) + Math.cos(angle) * (py - cy) + cy,
  //   ];
}

export function resizeNE(data: DrawingData, ctx: OnResizeContext) {
  const [xDiff, yDiff] = getDiffCoords(data, ctx);
  console.log({ xDiff, yDiff });
  const container = data.container;
  const bounds = container.bounds;
  const div = container.div;
  if (
    bounds.left + 5 >= bounds.right + xDiff ||
    bounds.bottom - 5 <= bounds.top + yDiff
  ) {
    // console.log("got here");
    return;
  }
  bounds.top += yDiff;
  bounds.right += xDiff;
  div.style.top = bounds.top + "px";
  div.style.width = bounds.right - bounds.left + "px";
  div.style.height = bounds.bottom - bounds.top + "px";
  //   const [xDiff2, yDiff2] = [
  //     ctx.newPoint[0] - ctx.previousPoint[0],
  //     ctx.newPoint[1] - ctx.previousPoint[1],
  //   ];
  //   bounds.left += xDiff2;
  //   div.style.left = bounds.left + "px";
}

export function resizeNW(data: DrawingData, ctx: OnResizeContext) {
  //   const point = [
  //     ctx.newPoint[0] - ctx.previousPoint[0],
  //     ctx.newPoint[1] - ctx.previousPoint[1],
  //   ];
  //   const [xDiff, yDiff] = point;
  const [xDiff, yDiff] = getDiffCoords(data, ctx);
  const container = data.container;
  const bounds = container.bounds;
  const div = container.div;
  if (
    bounds.left + xDiff >= bounds.right - 5 ||
    bounds.bottom - 5 <= bounds.top + yDiff
  ) {
    return;
  }
  bounds.top += yDiff;
  bounds.left += xDiff;
  div.style.top = bounds.top + "px";
  div.style.left = bounds.left + "px";
  div.style.width = bounds.right - bounds.left + "px";
  div.style.height = bounds.bottom - bounds.top + "px";
}

export function resizeSE(data: DrawingData, ctx: OnResizeContext) {
  const [xDiff, yDiff] = getDiffCoords(data, ctx);
  const container = data.container;
  const bounds = container.bounds;
  const div = container.div;
  if (
    bounds.left + 5 >= bounds.right + xDiff ||
    bounds.bottom + yDiff <= bounds.top + 5
  ) {
    return;
  }
  bounds.right += xDiff;
  bounds.bottom += yDiff;
  div.style.width = bounds.right - bounds.left + "px";
  div.style.height = bounds.bottom - bounds.top + "px";
}

export function resizeSW(data: DrawingData, ctx: OnResizeContext) {
  const [xDiff, yDiff] = getDiffCoords(data, ctx);
  const container = data.container;
  const bounds = container.bounds;
  const div = container.div;
  if (
    bounds.left + xDiff >= bounds.right - 5 ||
    bounds.bottom + yDiff <= bounds.top + 5
  ) {
    return;
  }
  bounds.bottom += yDiff;
  bounds.left += xDiff;
  div.style.left = bounds.left + "px";
  div.style.width = bounds.right - bounds.left + "px";
  div.style.height = bounds.bottom - bounds.top + "px";
}
