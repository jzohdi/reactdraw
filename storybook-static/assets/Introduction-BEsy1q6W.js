import{j as n,M as i,S as a}from"./blocks-BASEmEwa.js";import{useMDXComponents as o}from"./index-D2gDddpe.js";import"./preload-helper-PPVm8Dsz.js";import"./iframe-ThtCju29.js";import"./index-CEcb62mv.js";function t(r){const e={a:"a",blockquote:"blockquote",code:"code",h1:"h1",h2:"h2",li:"li",p:"p",pre:"pre",ul:"ul",...o(),...r.components};return n.jsxs(n.Fragment,{children:[n.jsx(i,{title:"Docs/Introduction"}),`
`,n.jsx(e.h1,{id:"reactdraw--introduction",children:"ReactDraw — Introduction"}),`
`,n.jsx(e.p,{children:"A plugin-architecture drawing area for React. Fully customizable, pick the tools you need, or build your own tools."}),`
`,n.jsxs(e.ul,{children:[`
`,n.jsx(e.li,{children:"Lightweight and modular"}),`
`,n.jsx(e.li,{children:"Customizable UI via styles/classNames"}),`
`,n.jsx(e.li,{children:"Extensible tools and serialization"}),`
`]}),`
`,n.jsxs(e.blockquote,{children:[`
`,n.jsxs(e.p,{children:["Jump to the Playground to try everything: ",n.jsx(e.a,{href:"?path=/story/reactdraw--playground",children:"Playground"})]}),`
`]}),`
`,n.jsx(e.h2,{id:"installation",children:"Installation"}),`
`,n.jsxs(e.p,{children:["Install using ",n.jsx(e.code,{children:"npm"})," or ",n.jsx(e.code,{children:"yarn"})]}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-shell",children:`npm install @jzohdi/react-draw

# or

yarn add @jzohdi/react-draw
`})}),`
`,n.jsx(e.h2,{id:"quickstart",children:"Quickstart"}),`
`,n.jsx(e.pre,{children:n.jsx(e.code,{className:"language-tsx",children:`import { ReactDraw, freeDrawTool } from "@jzohdi/react-draw";

export default function Minimal() {
  return (
    <ReactDraw
      drawingTools={[freeDrawTool]}
      actionTools={[]}
      hideTopBar={true}
      hideBottomBar={true}
    />
  );
}
`})}),`
`,n.jsx(e.h2,{id:"props",children:"Props"}),`
`,n.jsx(a,{children:"Key props on ReactDraw"}),`
`,n.jsxs(e.p,{children:["See README for latest API and ",n.jsx(e.a,{href:"?path=/story/docs-type-descriptions--page",children:"Type Descriptions"})," for detailed types."]})]})}function u(r={}){const{wrapper:e}={...o(),...r.components};return e?n.jsx(e,{...r,children:n.jsx(t,{...r})}):t(r)}export{u as default};
