import { useContext } from "react";
import { StylesContext } from "./context";

export function useStyles(key: string): string {
  const getClasses = useContext(StylesContext);

  return getClasses(key);
}
