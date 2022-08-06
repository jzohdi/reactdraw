import { SELECT_TOOL_ID } from "../../constants";
import { DrawingData, ReactDrawContext } from "../../types";

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
  const objectId = data.id;
  const div = data.containerDiv;
  const state = ctx.fullState[SELECT_TOOL_ID];
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
