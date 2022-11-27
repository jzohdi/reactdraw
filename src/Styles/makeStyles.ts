import { CSSProperties } from "react";
import { KeyFramesValue, StylesContextState, StylesValue } from "./types";

export default function cssFromState(state: StylesContextState): string {
  let finalCss = "";
  const entries = Object.entries(state);
  for (const [className, styles] of entries) {
    finalCss += compileClasses(className, styles);
  }
  // return CSS.escape(finalCss);
  // return finalCss.replace(/"/g, "&#x27;");
  return finalCss;
}

function compileClasses(className: string, styles: StylesValue): string {
  const cls = className.startsWith(".") ? className : `.${className}`;
  let cssString = "";
  let mainClass = `${cls} {`;
  const entries = Object.entries(styles);

  for (const [property, value] of entries) {
    if (typeof value === "string" || typeof value === "number") {
      mainClass += " " + makeProp(property, value);
    } else if (typeof value === "object" && property.startsWith("@media")) {
      cssString += makeMediaCss(property, cls, value);
    } else if (typeof value === "object" && property.startsWith("@keyframes")) {
      cssString += makeKeyframes(property, value);
    } else if (typeof value === "object" && property.trim().startsWith("*")) {
      cssString += compileClasses(
        cls + " " + property.replace(/&/g, cls),
        value
      );
    } else if (typeof value === "object") {
      cssString += compileClasses(property.replace(/&/g, cls), value);
    } else {
      console.error("Unrecognized value:", value);
      throw new Error();
    }
  }
  cssString += `${mainClass} }`;
  return cssString;
}
function makeKeyframes(kf: string, defs: KeyFramesValue): string {
  return `${kf} { ${Object.entries(defs)
    .map(([percent, styles]) => {
      return compileClasses(percent, styles).replace(".", "");
    })
    .join("")} }`;
}

function makeMediaCss(
  mediaQuery: string,
  cls: string,
  styles: CSSProperties
): string {
  let cssString = `${mediaQuery} { `;
  cssString += compileClasses(cls, styles);
  return cssString + " }";
}

const unitlessProperties = new Set([
  "opacity",
  "zIndex",
  "fontWeight",
  "lineHeight",
  "flex",
]);

function makeProp(prop: string, value: string | number) {
  if (typeof value === "string" || unitlessProperties.has(prop)) {
    return `${dashCase(prop)}: ${value};`;
  }
  return `${dashCase(prop)}: ${value}px;`;
}

function dashCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, (s) => s[0] + "-" + s[1].toLowerCase());
}
