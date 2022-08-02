import { useContext } from "react";
import { AlertMessageContext, AlertMessageValue } from "./context";

export function useAlerts(): AlertMessageValue {
  const [state, setState] = useContext(AlertMessageContext);

  return [state, setState];
}
