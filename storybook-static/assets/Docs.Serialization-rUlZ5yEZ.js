import{j as e,M as r}from"./blocks-BASEmEwa.js";import{useMDXComponents as i}from"./index-D2gDddpe.js";import"./preload-helper-PPVm8Dsz.js";import"./iframe-ThtCju29.js";import"./index-CEcb62mv.js";function a(t){const n={code:"code",h1:"h1",h2:"h2",li:"li",ol:"ol",p:"p",pre:"pre",...i(),...t.components};return e.jsxs(e.Fragment,{children:[e.jsx(r,{title:"Docs/Serialization (Saving + Loading)"}),`
`,e.jsx(n.h1,{id:"serialization-saving--loading-canvas",children:"Serialization (Saving + Loading) Canvas"}),`
`,e.jsxs(n.p,{children:[`A common use case for the canvas objects is to be able to save the canvas and restore the state later.
An example of this behavior can be seen under `,e.jsx(n.code,{children:"ReactDraw/Save And Load Canvas JSON"})," where the source code is also provided."]}),`
`,e.jsx("p",{children:e.jsxs(n.p,{children:["The function ",e.jsx(n.code,{children:"serializeObjects"}),` is provided from the root of this project and
returns a string which can be saved to localStorage or sent to a server. This
gives you the control when to save the canvas data and what to do with it. You
can create custom buttons to save and load the data such as in the example
mentioned above. Alternatively you can load the data using the `,e.jsx(n.code,{children:"ReactDraw"}),`
onLoad prop.`]})}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-javascript",children:`import {
  ReactDraw,
  Serializers,
  serializeObjects,
  Deserializers,
  deserializeData,
  serializeFreeDraw,
  deserializeFreeDraw,
} from "../src";

const serializers: Serializers = {
  [freeDrawTool.id]: serializeFreeDraw,
};

const deserializers: Deserializers = {
  [freeDrawTool.id]: deserializeFreeDraw,
};

// collected serialization of each drowing object on the canvas
// call this when you want to save canvas (returns string for you to save at your desired location)
const data = serializeObjects(serializers, ctx);

// turn the data (string) back into the canvas state
deserializeData(data, deserializers, ctx);
`})}),`
`,e.jsx(n.h2,{id:"serializeobjects",children:"serializeObjects"}),`
`,e.jsxs(n.p,{children:["Below shows the implementation of the ",e.jsx(n.code,{children:"serializeObjects"}),` function. Each of the drawing objects must
be turned into `,e.jsx(n.code,{children:"IntermediateStringableObject"}),` because the object's html elements are not json stringifiable.
See below for an example of how `,e.jsx(n.code,{children:"serializeFreeDraw"}),` is implemented. If you want to serialize and deserialize your custom
drawing tools you must create the serialization and deserialization functions for it as well.`]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-javascript",children:`export function serializeObjects(
  serializers: Serializers,
  ctx: ReactDrawContext
): string {
  const serializedObjects: IntermediateStringableObject[] = [];
  for (const drawingObject of ctx.objectsMap.values()) {
    const toolId = drawingObject.toolId;
    const serializerFunc = serializers[toolId];
    if (serializerFunc === undefined) {
      return toolNotFoundError(drawingObject, serializers);
    }
    serializedObjects.push(serializerFunc(drawingObject));
  }
  return JSON.stringify(serializedObjects);
}
`})}),`
`,e.jsx(n.h1,{id:"deserializedata",children:"deserializeData"}),`
`,e.jsxs(n.p,{children:["Below shows the implementation of ",e.jsx(n.code,{children:"deserializeData"}),`, there is a 4th optional arguement if you would like
to return the drawing objects and not add them to the canvas right away. See below for implementation example
for `,e.jsx(n.code,{children:"deserializeFreeDraw"}),"."]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-javascript",children:`export function deserializeData(
  stringifiedData: string,
  deserializers: Deserializers,
  ctx: ReactDrawContext,
  shouldAddToCanvas: boolean = true
): DrawingData[] {
  const toArray: IntermediateStringableObject[] = JSON.parse(stringifiedData);
  const results: DrawingData[] = [];
  for (const obj of toArray) {
    const deserializerFunction = deserializers[obj.toolId];
    if (deserializerFunction === undefined) {
      return toolNotFoundError(obj, deserializers);
    }
    const drawingDataObject = deserializerFunction(obj, ctx, shouldAddToCanvas);
    results.push(drawingDataObject);
  }
  return results;
}
`})}),`
`,e.jsx(n.h2,{id:"serializefreedraw",children:"serializeFreeDraw"}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-javascript",children:`export const serializeFreeDraw: SerializerFunction = (obj: DrawingData) => {
  const containerState = getContainerState(obj);
  containerState.scale = getScaleFromSvg(obj);
  containerState.other["viewbox"] = obj.element?.getAttribute("viewbox");
  const customData = serializeCustomData(obj);
  const objectCopy = { ...obj, containerDiv: containerState, customData };
  return objectCopy;
};
`})}),`
`,e.jsx(n.h2,{id:"deserializefreedraw",children:"deserializeFreeDraw"}),`
`,e.jsx(n.p,{children:"The general steps included here are:"}),`
`,e.jsxs(n.ol,{children:[`
`,e.jsx(n.li,{children:"grab the previously serialized setup data (constainerState, customData)"}),`
`,e.jsx(n.li,{children:"create a new containerDiv (makeNewDiv) with an empty size and center at the original first drawing point."}),`
`,e.jsxs(n.li,{children:["create a new ",e.jsx(n.code,{children:"DrawingData"})," object"]}),`
`,e.jsxs(n.li,{children:["deserialize customData (turn back into ",e.jsx(n.code,{children:"Map<string, any>"}),")"]}),`
`,e.jsx(n.li,{children:"set the containerDiv to the original size and position (this is needed so that we can redraw the svg as it was originally drawn)"}),`
`,e.jsxs(n.li,{children:["add the containerDiv to the canvas (need to do this first so that it's ",e.jsx(n.code,{children:"div.getBoundingClientRect()"})," works)"]}),`
`,e.jsx(n.li,{children:"draw the svg again based on the original coords and original position"}),`
`,e.jsx(n.li,{children:"restore the rotation, scale, and true saved position. (it's important to do this last or the free draw svg won't be created correctly)"}),`
`]}),`
`,e.jsx(n.pre,{children:e.jsx(n.code,{className:"language-javascript",children:`export const deserializeFreeDraw: DeserializerFunction = (
  obj: IntermediateStringableObject,
  ctx: ReactDrawContext,
  shouldAddToCanvas: boolean = true
) => {
  const freeDrawObj = obj as SerializedFreeDraw;
  const containerState = freeDrawObj.containerDiv;
  const customData = freeDrawObj.customData;
  const originalBounds = customData[FREE_DRAW_ORIGINAL_BOUNDS];
  const p = freeDrawObj.coords[0];
  const bbox = containerState.bbox;
  const lineWidth = parseInt(freeDrawObj.style.lineWidth);

  const { id, div } = makeNewDiv(p[0], p[1], lineWidth, freeDrawObj.toolId);

  const newDrwingData: DrawingData = {
    toolId: freeDrawObj.toolId,
    id,
    style: freeDrawObj.style,
    customData: deserializeCustomData(customData),
    containerDiv: div,
    element: null,
    coords: freeDrawObj.coords,
  };

  setDivToBounds(div, originalBounds);

  if (shouldAddToCanvas) {
    addObject(ctx, newDrwingData);
  }
  const newSvg = createSvg(
    originalBounds.width,
    originalBounds.height,
    freeDrawObj.style.opacity
  );

  newSvg.setAttribute("viewbox", containerState.other["viewbox"]);
  newSvg.style.overflow = "visible";
  newDrwingData.containerDiv.innerHTML = "";
  const newPath = svgPathFromData(newDrwingData, ctx.viewContainer);
  div.style.transform = \`rotate(\${containerState.rotation}deg)\`;
  newPath.style.transform = \`scale(\${containerState.scale?.x}, \${containerState.scale?.y})\`;
  newSvg.appendChild(newPath);
  newDrwingData.containerDiv.appendChild(newSvg);
  newDrwingData.element = newSvg;
  setDivToBounds(div, bbox);
  return newDrwingData;
};
`})})]})}function h(t={}){const{wrapper:n}={...i(),...t.components};return n?e.jsx(n,{...t,children:e.jsx(a,{...t})}):a(t)}export{h as default};
