/**

	This file contains util functions that are useful only for 
	user and are not used inside of react draw components.

*/

import { setContainerRect } from "./index";
import { makeCircleDiv } from "../TopBarTools/CircleTool";
import { DrawingData, Point, ReactDrawContext } from "../types";
import { addObject, createNewObject } from "./utils";

export type CreateObjectOptions = {
  topLeftPoint: Point;
  bottomRightPoint: Point;
  toolId: string;
};

/**
 * creates a new circle and adds it to thew view.
 * returns the resulting DrawingDataObject
 */
export function createCircle(
  ctx: ReactDrawContext,
  options: CreateObjectOptions
): DrawingData {
  const newDrawingObject = createNewObject(
    ctx,
    options.topLeftPoint,
    options.toolId
  );
  const newCircle = makeCircleDiv(ctx.globalStyles);
  newDrawingObject.containerDiv.appendChild(newCircle);
  newDrawingObject.element = newCircle;
  // expand point
  newDrawingObject.coords.push(options.bottomRightPoint);
  setContainerRect(newDrawingObject);
  addObject(ctx, newDrawingObject);
  ctx.selectObject(newDrawingObject);
  return newDrawingObject;
}
