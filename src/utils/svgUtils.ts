export function createPathSvg(lineWidth: number): SVGPathElement {
  const newPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  newPath.setAttribute("fill", "transparent");
  newPath.setAttribute("stroke", "black");
  newPath.setAttribute("strokeWidth", `${lineWidth}px`);
  newPath.setAttribute("stroke-linejoin", "round");
  newPath.setAttribute("stroke-linecap", "round");
  return newPath;
}
