import e from"react";import t,{css as n}from"styled-components";const r={light:"#bddefb",main:"#228be6"},o={light:"#ececec"};function l(t){return function(n){const{size:r,width:o,height:l,color:i}=n,a=function(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&t.indexOf(r)<0&&(n[r]=e[r]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var o=0;for(r=Object.getOwnPropertySymbols(e);o<r.length;o++)t.indexOf(r[o])<0&&Object.prototype.propertyIsEnumerable.call(e,r[o])&&(n[r[o]]=e[r[o]])}return n}(n,["size","width","height","color"]);return e.createElement(t,Object.assign({},a,{width:o||r||20,height:l||r||20,color:i||"#111827"}))}}t.button`
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
    background-color: ${o.light};
  }
  ${e=>e.selected&&n`
      background-color: ${r.main} !important;
      > svg path {
        fill: white;
      }
    `}
`,t.div`
  display: flex;
  background-color: ${r.light};
`;var i=l((function(t){return e.createElement("svg",Object.assign({},t,{viewBox:"0 0 14 14",fill:"none",xmlns:"http://www.w3.org/2000/svg"}),e.createElement("path",{d:"M10.5858 0.585786C11.3668 -0.195262 12.6332 -0.195262 13.4142 0.585786C14.1953 1.36683 14.1953 2.63316 13.4142 3.41421L12.6213 4.20711L9.79289 1.37868L10.5858 0.585786Z",fill:t.color}),e.createElement("path",{d:"M8.37868 2.79289L0 11.1716V14H2.82842L11.2071 5.62132L8.37868 2.79289Z",fill:t.color}))})),a=l((function(t){return e.createElement("svg",Object.assign({},t,{viewBox:"0 0 17 17",fill:"none",xmlns:"http://www.w3.org/2000/svg"}),e.createElement("path",{d:"M5.67175 0.911473C5.52881 0.378007 4.98047 0.0614245 4.44701 0.204366C3.91354 0.347308 3.59696 0.895645 3.7399 1.42911L3.99872 2.39504C4.14166 2.9285 4.69 3.24509 5.22346 3.10214C5.75693 2.9592 6.07351 2.41086 5.93057 1.8774L5.67175 0.911473Z",fill:"#111827"}),e.createElement("path",{d:"M1.42911 3.7399C0.895645 3.59696 0.347308 3.91354 0.204366 4.44701C0.0614245 4.98047 0.378007 5.52881 0.911473 5.67175L1.8774 5.93057C2.41086 6.07351 2.9592 5.75693 3.10214 5.22346C3.24509 4.69 2.9285 4.14166 2.39504 3.99872L1.42911 3.7399Z",fill:"#111827"}),e.createElement("path",{d:"M10.2426 3.17149C10.6331 2.78097 10.6331 2.1478 10.2426 1.75728C9.85204 1.36676 9.21887 1.36676 8.82835 1.75728L8.12124 2.46439C7.73072 2.85491 7.73072 3.48808 8.12124 3.8786C8.51177 4.26912 9.14493 4.26912 9.53545 3.8786L10.2426 3.17149Z",fill:"#111827"}),e.createElement("path",{d:"M3.17149 10.2426L3.8786 9.53546C4.26912 9.14493 4.26912 8.51177 3.8786 8.12124C3.48808 7.73072 2.85491 7.73072 2.46439 8.12124L1.75728 8.82835C1.36676 9.21887 1.36676 9.85204 1.75728 10.2426C2.1478 10.6331 2.78097 10.6331 3.17149 10.2426Z",fill:"#111827"}),e.createElement("path",{d:"M6.37142 5.07152C6 4.92295 5.57578 5.01002 5.29292 5.29289C5.01006 5.57575 4.92298 5.99997 5.07155 6.37138L9.07155 16.3714C9.2178 16.737 9.56502 16.9828 9.95847 16.9991C10.3519 17.0155 10.7183 16.7994 10.8945 16.4472L12.274 13.6882L15.2929 16.7071C15.6834 17.0976 16.3166 17.0976 16.7071 16.7071C17.0977 16.3166 17.0977 15.6834 16.7071 15.2929L13.6882 12.2739L16.4472 10.8944C16.7995 10.7183 17.0155 10.3519 16.9992 9.95843C16.9828 9.56498 16.737 9.21777 16.3714 9.07152L6.37142 5.07152Z",fill:"#111827"}))}));e.createElement(a,{style:{transform:"translate(-2px, -1px)"}});e.createElement(i,null);
