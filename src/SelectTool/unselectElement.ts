import { DrawingData, ReactDrawContext } from "../types";
import { SelectToolCustomState } from "./types";

/**
 * Unselecting an element requires also cleaning up the event listeners
 * TODO: this could be a performance hit.
 * @param data
 * @param ctx
 */

export function unselectElement(
  data: DrawingData,
  ctx: ReactDrawContext
): void {
  const objectId = data.container.id;
  const { div } = data.container;
  const state = ctx.customState as SelectToolCustomState;
  const handlers = state.handlers[objectId];
  if (handlers) {
    // console.log("removing ", handlers.length, "handlers");
    for (const handler of handlers) {
      handler.ele.removeEventListener(handler.eventName, handler.fn);
    }
  }
  const selectFrame = div.querySelector('[id^="select-frame"');
  state.handlers[objectId] = [];
  if (selectFrame !== null) {
    div.removeChild(selectFrame);
  }
  const indexInSelectedIds = state.selectedIds.indexOf(objectId);
  if (indexInSelectedIds >= 0) {
    state.selectedIds.splice(indexInSelectedIds, 1);
  }
}
