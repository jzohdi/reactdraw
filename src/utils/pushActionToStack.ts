import { ActionObject, ReactDrawContext } from "../types";

export function pushActionToStack(action: ActionObject, ctx: ReactDrawContext) {
  if (ctx.shouldKeepHistory) {
    ctx.undoStack.push(action);
    // console.log("before:", ctx.redoStack);
    ctx.redoStack.splice(0);
    // console.log("after:", ctx.redoStack);
  }
}
