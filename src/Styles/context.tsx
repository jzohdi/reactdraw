import React, { createContext, useRef, useEffect } from "react";
import cssFromState from "./makeStyles";
import { StylesContextState, StylesValue } from "./types";
import * as componentStyles from "./ComponentStyles";
import { ClassNamesObject, StylesObject, StylesProviderProps } from "../types";

// type UpdateStylesFn = (key: string, styles: StylesValue) => void;
// type GetStylesFn = (key: string) => StylesValue;

export type StylesContextValue = (key: string) => string;
// export type StylesContextValue = [GetStylesFn, UpdateStylesFn];

export const StylesContext = createContext<StylesContextValue>(() => "");

type ClassNamesMap = Map<string, string>;

function classNamesToMap(
  classNames: undefined | ClassNamesObject
): ClassNamesMap {
  const classNamesMap: ClassNamesMap = new Map();
  if (!classNames) {
    return classNamesMap;
  }
  for (const key in classNames) {
    const value = classNames[key];
    if (value !== undefined) {
      classNamesMap.set(key, value);
    }
  }
  return classNamesMap;
}

function deepMergeStyles(
  reactDrawStyles: { [key: string]: any },
  userStyles: { [key: string]: any }
): void {
  for (const key in userStyles) {
    const value = userStyles[key];
    if (typeof value === undefined) continue;
    if (typeof value === "string" || typeof value === "number") {
      reactDrawStyles[key] = value;
    } else if (
      typeof value === "object" &&
      reactDrawStyles[key] === undefined
    ) {
      reactDrawStyles[key] = value;
    } else if (typeof value === "object") {
      deepMergeStyles(reactDrawStyles[key], value);
    }
  }
}

function mergeStyles(
  reactDrawStyles: StylesContextState,
  userDefinedStyles: StylesObject | undefined,
  classNamesMap: ClassNamesMap
): StylesContextState {
  if (!userDefinedStyles) {
    return reactDrawStyles;
  }
  for (const key in userDefinedStyles) {
    if (key === undefined) continue;
    const userStyles = userDefinedStyles[key];
    if (userStyles === undefined) continue;
    if (reactDrawStyles[key] === undefined) {
      reactDrawStyles[key] = userStyles;
      classNamesMap.set(key, key);
    } else {
      deepMergeStyles(reactDrawStyles[key], userStyles);
    }
  }
  return reactDrawStyles;
}

function makeStylesMap(classNamesMap: ClassNamesMap): StylesContextState {
  return Object.values(componentStyles).reduce((acc, curr) => {
    if (acc[curr.key]) {
      throw new Error("duplicate key while creating css styles");
    }
    acc[curr.key] = curr.styles;
    const currClassNames = classNamesMap.get(curr.key);
    if (currClassNames !== undefined) {
      classNamesMap.set(curr.key, currClassNames + " " + curr.key);
    }
    classNamesMap.set(curr.key, curr.key);
    return acc;
  }, {} as StylesContextState);
}

export function StylesProvider({
  children,
  styles,
  classNames,
}: React.PropsWithChildren<StylesProviderProps>) {
  const classNamesMap = useRef<ClassNamesMap>(classNamesToMap(classNames));

  const stylesMap = useRef<StylesContextState>(
    mergeStyles(
      makeStylesMap(classNamesMap.current),
      styles,
      classNamesMap.current
    )
  );

  const styleRef = useRef<HTMLStyleElement>(null);

  useEffect(() => {
    const styleTag = styleRef.current;
    if (!styleTag) {
      return;
    }
    classNamesMap.current = classNamesToMap(classNames);
    stylesMap.current = mergeStyles(
      makeStylesMap(classNamesMap.current),
      styles,
      classNamesMap.current
    );
    styleTag.innerHTML = cssFromState(stylesMap.current);
  }, [styles]);

  const getClasses = (key: string) => {
    const classes = classNamesMap.current.get(key);
    if (classes === undefined) {
      throw new Error("Could not find key in classNames map");
    }
    return classes;
  };

  return (
    <StylesContext.Provider value={getClasses}>
      <style id="react-draw-styles" ref={styleRef}>
        {cssFromState(stylesMap.current)}
      </style>
      {children}
    </StylesContext.Provider>
  );
}
