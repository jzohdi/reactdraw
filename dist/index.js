"use strict";var e=require("react"),t=require("styled-components");function n(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var r=n(e),o=n(t);function i(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(r=Object.getOwnPropertySymbols(e);o<r.length;o++)t.indexOf(r[o])<0&&Object.prototype.propertyIsEnumerable.call(e,r[o])&&(n[r[o]]=e[r[o]])}return n}o.default.button`
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
  ${e=>e.selected&&t.css`
      background-color: #228be6 !important;
      > svg path {
        fill: white;
      }
    `}
`,o.default.div`
  display: flex;
`;var l=function(e){return function(t){const{color:n}=t,o=i(t,["color"]);return r.default.createElement(e,Object.assign({},o,{color:n||"#111827"}))}}(function(e){return function(t){const{size:n}=t,o=i(t,["size"]);if(void 0!==n)return r.default.createElement(e,Object.assign({},o,{width:n,height:n}));const{width:l,height:c}=o,a=i(o,["width","height"]);return r.default.createElement(e,Object.assign({},a,{width:l||20,height:c||20}))}}((function(e){return r.default.createElement("svg",Object.assign({},e,{viewBox:"0 0 14 14",fill:"none",xmlns:"http://www.w3.org/2000/svg"}),r.default.createElement("path",{d:"M10.5858 0.585786C11.3668 -0.195262 12.6332 -0.195262 13.4142 0.585786C14.1953 1.36683 14.1953 2.63316 13.4142 3.41421L12.6213 4.20711L9.79289 1.37868L10.5858 0.585786Z",fill:e.color}),r.default.createElement("path",{d:"M8.37868 2.79289L0 11.1716V14H2.82842L11.2071 5.62132L8.37868 2.79289Z",fill:e.color}))})));r.default.createElement(l,null);
