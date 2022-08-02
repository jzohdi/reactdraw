import React, { createContext, useState } from "react";

type AlertMessageState = {
  color: string | null;
  message: string | null;
  position: "top" | "bottom";
};

const initialData: AlertMessageState = {
  color: null,
  message: null,
  position: "top",
};
export type AlertMessageValue = [
  AlertMessageState,
  (newState: AlertMessageState) => void
];
export const AlertMessageContext = createContext<AlertMessageValue>([
  initialData,
  () => {},
]);

// type AlertProviderProps = FC<{}>;

export function AlertMessageProvider({
  children,
}: React.PropsWithChildren<{}>) {
  const [state, setState] = useState<AlertMessageState>(initialData);

  const updateState = (newState: AlertMessageState) => {
    setState(newState);
  };

  return (
    <AlertMessageContext.Provider value={[state, updateState]}>
      {children}
    </AlertMessageContext.Provider>
  );
}
