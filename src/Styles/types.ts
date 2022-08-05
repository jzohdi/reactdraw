import { CSSProperties } from "react";
/**
 * Example:
 * {
 *    '@keyframes my-animation': {
 *        '0%': {
 *            ...CSSProperties
 *        },
 *        '100%': {
 *            ...CSSProperties
 *        }
 *    }
 * }
 */

export type KeyFramesValue = {
  [percent: string]: CSSProperties;
};

export type KeyFramesDefinition = {
  [keyframesDef: string]: KeyFramesValue;
};

export type StylesValue =
  | CSSProperties
  | {
      [selector: string]: CSSProperties;
    }
  | KeyFramesDefinition;

export type StylesContextState = {
  [key: string]: StylesValue;
};
