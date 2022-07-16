import { DrawingDataMap } from "../../types";

export function getSelectedDrawingObjects(
  selectedIds: string[],
  objects: DrawingDataMap
) {
  return selectedIds.map((id) => {
    const object = objects.get(id);
    if (!object) {
      throw new Error("object not found in map");
    }
    return object;
  });
}
