const rotateNumRegex = /-{0,1}\d+\.*\d*/g;

export function getRotateFromDiv(div: HTMLDivElement): number {
  const rotateStyle = div.style.transform;
  if (!rotateStyle) {
    return 0;
  }
  const match = rotateStyle.match(rotateNumRegex);
  if (!match) {
    return 0;
  }
  return parseFloat(match[0]);
}
