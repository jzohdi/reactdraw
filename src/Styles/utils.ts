const mediaQuery = {
  applyAbove: (bp: number): string =>
    `@media only screen and (min-width: ${bp}px)`,
  applyBelow: (bp: number): string =>
    `@media only screen and (max-width: ${bp}px)`,
  between: (min: number, max: number): string =>
    `@media only screen and (min-width: ${min}px) and (max-width: ${max}px)`,
};

const keyframes = (animationName: string) => `@keyframes ${animationName}`;

type ClsxType = string | { [key: string]: boolean } | boolean;

function objstr(arg: ClsxType): string {
  if (typeof arg === "string") return arg;
  if (typeof arg === "boolean") return "";

  return Object.keys(arg)
    .map((k) => arg[k] && k)
    .filter(Boolean)
    .join(" ");
}

function clsx(...args: ClsxType[]): string {
  return args.map(objstr).join(" ");
}

export { mediaQuery, clsx, keyframes };
