import e from"react";import t,{css as n}from"styled-components";function r(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(r=Object.getOwnPropertySymbols(e);o<r.length;o++)t.indexOf(r[o])<0&&Object.prototype.propertyIsEnumerable.call(e,r[o])&&(n[r[o]]=e[r[o]])}return n}t.button`
  display: flex;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  border: none;
  background-color: transparent;
  border-radius: 2px;
  transition: background-color 150ms ease-in-out;
  @media only screen and (min-width: ${450}px) {
    width: 40px;
    height: 40px;
  }
  @media only screen and (max-width: ${450}px) {
    width: 30px;
    height: 30px;
  }
  &:hover {
    background-color: #ececec;
  }
  ${e=>e.selected&&n`
      background-color: #228be6 !important;
      > svg path {
        fill: white;
      }
    `}
`,t.div`
  display: flex;
`;var o=function(t){return function(n){const{color:o}=n,i=r(n,["color"]);return e.createElement(t,Object.assign({},i,{color:o||"#111827"}))}}(function(t){return function(n){const{size:o}=n,i=r(n,["size"]);if(void 0!==o)return e.createElement(t,Object.assign({},i,{width:o,height:o}));const{width:c,height:l}=i,a=r(i,["width","height"]);return e.createElement(t,Object.assign({},a,{width:c||20,height:l||20}))}}((function(t){return e.createElement("svg",Object.assign({},t,{viewBox:"0 0 14 14",fill:"none",xmlns:"http://www.w3.org/2000/svg"}),e.createElement("path",{d:"M10.5858 0.585786C11.3668 -0.195262 12.6332 -0.195262 13.4142 0.585786C14.1953 1.36683 14.1953 2.63316 13.4142 3.41421L12.6213 4.20711L9.79289 1.37868L10.5858 0.585786Z",fill:t.color}),e.createElement("path",{d:"M8.37868 2.79289L0 11.1716V14H2.82842L11.2071 5.62132L8.37868 2.79289Z",fill:t.color}))})));e.createElement(o,null);
