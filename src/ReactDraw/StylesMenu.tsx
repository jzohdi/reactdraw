import React, { useState, useEffect } from "react";
import {
  StringObject,
  StyleComponents,
  ToolPropertiesMap,
  UpdateStyleFn,
} from "../types";

type StylesMenuProps = {
  getEditProps: () => StringObject;
  styleComponents?: StyleComponents;
  onUpdateStyle: UpdateStyleFn;
};

export default function StylesMenu({
  getEditProps,
  styleComponents = {},
  onUpdateStyle,
}: StylesMenuProps) {
  const [state, setState] = useState(getEditProps());

  const keysToRender = Object.keys(state).filter((k) => !!styleComponents[k]);

  // TODO: make this better (get current object's styles)
  useEffect(() => {
    function updateEditProps() {
      const newState = getEditProps();
      //   if (!isEqual(state, newState)) {
      //   console.log("setting new state in menu:", newState);
      setState(newState);
      //   }
    }
    window.addEventListener("click", updateEditProps);
    return () => {
      window.removeEventListener("click", updateEditProps);
    };
  }, [state]);

  // TODO: handle undo/redo
  const onUpdate = (key: keyof ToolPropertiesMap, value: string) => {
    setState({ ...state, [key]: value });
    onUpdateStyle(key, value);
  };

  // TODO: return some message
  if (keysToRender.length === 0) {
    return <></>;
  }
  keysToRender.sort((a, b) => {
    const orderA = styleComponents[a].order;
    const orderB = styleComponents[b].order;
    return orderB - orderA;
  });
  //   console.log(keysToRender);
  //   console.log(state);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {keysToRender.map((key) => {
        const Component = styleComponents[key].component;
        return (
          <Component
            key={key}
            onUpdate={onUpdate}
            styleKey={key}
            styleValue={state[key]}
          />
        );
      })}
    </div>
  );
}

function isEqual(objA: StringObject, objB: StringObject): boolean {
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);
  if (keysA.length !== keysB.length) {
    return false;
  }
  for (const key of keysA) {
    if (objA[key] !== objB[key]) {
      return false;
    }
  }
  return true;
}
