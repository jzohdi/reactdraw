import t,{useRef as e,useMemo as n,useState as o,useEffect as r,Children as i}from"react";import l,{css as c}from"styled-components";function s(t,e){var n={};for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&e.indexOf(o)<0&&(n[o]=t[o]);if(null!=t&&"function"==typeof Object.getOwnPropertySymbols){var r=0;for(o=Object.getOwnPropertySymbols(t);r<o.length;r++)e.indexOf(o[r])<0&&Object.prototype.propertyIsEnumerable.call(t,o[r])&&(n[o[r]]=t[o[r]])}return n}const d={boxShadow:"#000000 0px 1px 3px 0px",borderRadius:4,overflow:"hidden",display:"flex",flexDirection:"column"};function a({children:e,layout:n}){const o=function(t){return"default"===t?{width:500,height:500,maxWidth:"100%"}:"fit"===t?{maxWidth:"100%"}:void 0}(n);return t.createElement("div",{style:Object.assign(Object.assign({},d),o)},e)}const u={light:"#bddefb",main:"#228be6"},h={light:"#ececec"},p=l.button`
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
    background-color: ${h.light};
  }
  ${t=>t.selected&&c`
      background-color: ${u.main} !important;
      > svg path {
        fill: white;
      }
    `}
`;function g({children:e,selected:n,onSelect:o}){return t.createElement(p,{selected:n,onClick:o},e)}const f=l.div`
  display: flex;
  background-color: ${u.light};
`;function m({tools:e,onSelectTool:n,currentTool:o}){return t.createElement(f,null,e.map((e=>t.createElement(g,{key:e.id,selected:e.id===o,onSelect:()=>n(e.id)},e.icon))))}function w(t){for(var e="",n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",o=n.length,r=0;r<t;r++)e+=n.charAt(Math.floor(Math.random()*o));return e}function v(t){let e=t.touches[0];return e||(e=t.targetTouches[0]),e||(e=t.changedTouches[0]),[e.clientX,e.clientY]}function b(t,e){if(!e)throw new Error("Container not set.");const n=e.getBoundingClientRect();return[t[0]-n.left,t[1]-n.top]}function x(){return void 0!==typeof window}function y(t,e){if(!x())throw new Error("new bounding div called on the server.");const[n,o]=t,{id:r,div:i,top:l,left:c,right:s,bottom:d}=function(t,e,n){const o=w(6),r=document.createElement("div"),i=t-n,l=e-n;return r.id=o,r.style.width=2*n+"px",r.style.height=2*n+"px",r.style.position="absolute",r.style.left=i+"px",r.style.top=l+"px",{div:r,id:o,top:l,left:i,right:i+n+n,bottom:l+n+n}}(n,o,e);return{coords:[t],element:null,container:{id:r,div:i,bounds:{top:l,left:c,right:s,bottom:d}},style:{lineWidth:e}}}function M(t,e){if(!x())throw new Error("createSVG called on server");const n=document.createElementNS("http://www.w3.org/2000/svg","svg");return n.setAttributeNS("http://www.w3.org/2000/xmlns/","xmlns:xlink","http://www.w3.org/1999/xlink"),n.setAttribute("viewbox",`0 0 ${t} ${e}`),n.style.width="100%",n.style.height="100%",n}function E(t,e,n){const o=e.div.getBoundingClientRect(),r=n.getBoundingClientRect(),i=o.top-r.top,l=t[1]-i,c=o.left-r.left;return[t[0]-c,l]}function C(e){return function(n){const{size:o,width:r,height:i,color:l}=n,c=function(t,e){var n={};for(var o in t)Object.prototype.hasOwnProperty.call(t,o)&&e.indexOf(o)<0&&(n[o]=t[o]);if(null!=t&&"function"==typeof Object.getOwnPropertySymbols){var r=0;for(o=Object.getOwnPropertySymbols(t);r<o.length;r++)e.indexOf(o[r])<0&&Object.prototype.propertyIsEnumerable.call(t,o[r])&&(n[o[r]]=t[o[r]])}return n}(n,["size","width","height","color"]);return t.createElement(e,Object.assign({},c,{width:r||o||20,height:i||o||20,color:l||"#111827"}))}}var L=C((function(e){return t.createElement("svg",Object.assign({},e,{viewBox:"0 0 14 14",fill:"none",xmlns:"http://www.w3.org/2000/svg"}),t.createElement("path",{d:"M10.5858 0.585786C11.3668 -0.195262 12.6332 -0.195262 13.4142 0.585786C14.1953 1.36683 14.1953 2.63316 13.4142 3.41421L12.6213 4.20711L9.79289 1.37868L10.5858 0.585786Z",fill:e.color}),t.createElement("path",{d:"M8.37868 2.79289L0 11.1716V14H2.82842L11.2071 5.62132L8.37868 2.79289Z",fill:e.color}))})),O=C((function(e){return t.createElement("svg",Object.assign({},e,{viewBox:"0 0 17 17",fill:"none",xmlns:"http://www.w3.org/2000/svg"}),t.createElement("path",{d:"M5.67175 0.911473C5.52881 0.378007 4.98047 0.0614245 4.44701 0.204366C3.91354 0.347308 3.59696 0.895645 3.7399 1.42911L3.99872 2.39504C4.14166 2.9285 4.69 3.24509 5.22346 3.10214C5.75693 2.9592 6.07351 2.41086 5.93057 1.8774L5.67175 0.911473Z",fill:"#111827"}),t.createElement("path",{d:"M1.42911 3.7399C0.895645 3.59696 0.347308 3.91354 0.204366 4.44701C0.0614245 4.98047 0.378007 5.52881 0.911473 5.67175L1.8774 5.93057C2.41086 6.07351 2.9592 5.75693 3.10214 5.22346C3.24509 4.69 2.9285 4.14166 2.39504 3.99872L1.42911 3.7399Z",fill:"#111827"}),t.createElement("path",{d:"M10.2426 3.17149C10.6331 2.78097 10.6331 2.1478 10.2426 1.75728C9.85204 1.36676 9.21887 1.36676 8.82835 1.75728L8.12124 2.46439C7.73072 2.85491 7.73072 3.48808 8.12124 3.8786C8.51177 4.26912 9.14493 4.26912 9.53545 3.8786L10.2426 3.17149Z",fill:"#111827"}),t.createElement("path",{d:"M3.17149 10.2426L3.8786 9.53546C4.26912 9.14493 4.26912 8.51177 3.8786 8.12124C3.48808 7.73072 2.85491 7.73072 2.46439 8.12124L1.75728 8.82835C1.36676 9.21887 1.36676 9.85204 1.75728 10.2426C2.1478 10.6331 2.78097 10.6331 3.17149 10.2426Z",fill:"#111827"}),t.createElement("path",{d:"M6.37142 5.07152C6 4.92295 5.57578 5.01002 5.29292 5.29289C5.01006 5.57575 4.92298 5.99997 5.07155 6.37138L9.07155 16.3714C9.2178 16.737 9.56502 16.9828 9.95847 16.9991C10.3519 17.0155 10.7183 16.7994 10.8945 16.4472L12.274 13.6882L15.2929 16.7071C15.6834 17.0976 16.3166 17.0976 16.7071 16.7071C17.0977 16.3166 17.0977 15.6834 16.7071 15.2929L13.6882 12.2739L16.4472 10.8944C16.7995 10.7183 17.0155 10.3519 16.9992 9.95843C16.9828 9.56498 16.737 9.21777 16.3714 9.07152L6.37142 5.07152Z",fill:"#111827"}))}));const j={icon:t.createElement(O,{style:{transform:"translate(-2px, -1px)"}}),id:"react-draw-cursor",onDrawStart:t=>{t.container.div.style.border=`1px solid ${u.main}`,t.container.div.style.backgroundColor=u.light+"4d"},onDrawing:t=>{!function(t){if(t.coords.length<2)throw new Error("data coords must be at least length 2");const[e,n]=t.coords[0],[o,r]=t.coords[t.coords.length-1],i=Math.min(e,o),l=Math.min(n,r),c=Math.max(e,o),s=Math.max(n,r),{bounds:d,div:a}=t.container;d.left=i,d.right=c,d.top=l,d.bottom=s,a.style.top=l+"px",a.style.left=i+"px",a.style.width=c-i+"px",a.style.height=s-l+"px",t.coords}(t),t.coords.splice(1)},onDrawEnd:t=>{var e;const n=t.container.div;n.style.border="none",n.style.backgroundColor="transparent",null===(e=n.parentElement)||void 0===e||e.removeChild(n)}};function D(l){var{children:c,topBarTools:d}=l,u=s(l,["children","topBarTools"]);const h=e(null),p=n((()=>function(t){return[j].concat(t.map((t=>{var{id:e}=t,n=s(t,["id"]);if("react-draw-cursor"===e)throw new Error("Cannot give tool with reserved cursor id");return e?Object.assign({id:e},n):Object.assign(Object.assign({},n),{id:w(6)})})))}(d)),[d]),[g,f]=o(p[0]),{layout:x}=function(t,e){const n=i.count(t);if(n>1)throw new Error("ReactDraw expects either 0 or 1 children, detected more.");void 0===e&&(e="default");return{numChildren:n,layout:e}}(c,u.layout),M=e({}),E=e(null),[C,L]=o(4),O=e(`drawing-area-container-${w(6)}`);r((()=>{const t=h.current;if(t)return t.addEventListener("mousedown",e),t.addEventListener("mouseup",o),t.addEventListener("mousemove",n),t.addEventListener("touchstart",r,{passive:!1}),t.addEventListener("touchmove",l,{passive:!1}),t.addEventListener("touchcancel",i),t.addEventListener("touchend",i),()=>{t.removeEventListener("mousedown",e),t.removeEventListener("mouseup",o),t.removeEventListener("mousemove",n),t.removeEventListener("touchstart",r),t.removeEventListener("touchmove",l),t.removeEventListener("touchcancel",i),t.removeEventListener("touchend",i)};function e(e){if(!t)return;const n=y(b([e.clientX,e.clientY],t),C);E.current=n,null==t||t.append(n.container.div),g.onDrawStart(n,t)}function n(e){const n=E.current;if(!n||!t)return;const o=b([e.clientX,e.clientY],t);n.coords.push(o),g.onDrawing(n,t)}function o(){const e=E.current;e&&t&&(E.current=null,M.current[e.container.id]=e,g.onDrawEnd(e,t))}function r(e){b(v(e),t)}function i(){}function l(e){b(v(e),t)}}),[g]);return t.createElement(a,{layout:x},t.createElement(m,{tools:p,onSelectTool:t=>{if(g.id!==t){const e=p.find((e=>e.id===t));e&&f(e)}},currentTool:g.id}),t.createElement("div",{id:O.current,style:{position:"relative",width:"100%",flex:1,boxSizing:"border-box"},ref:h},c),t.createElement("div",null),t.createElement("style",null,`\n\t\t#${O.current} {\n\t\t\tcursor: ${g.cursor||"defautl"};\n\t\t}\n\t  `))}const T={icon:t.createElement(L,null),onDrawStart:t=>{const e=t.style.lineWidth,n=M(e,e),o=function(t){if(!x())throw new Error("createPath called on server");const e=document.createElementNS("http://www.w3.org/2000/svg","circle");return e.setAttribute("fill","black"),e.setAttribute("cx",`${Math.ceil(t/2)}`),e.setAttribute("cy",`${Math.ceil(t/2)}`),e.setAttribute("r",`${t}`),e}(e/2);n.appendChild(o),t.container.div.appendChild(n),t.element=n},onDrawing:(t,e)=>{!function(t){let e=!1;const[n,o]=t.coords[t.coords.length-1],r=t.container,i=r.bounds,l=t.style.lineWidth;n-l<=i.left?(i.left=n-l,r.div.style.left=n-l+"px",r.div.style.width=i.right+2*l-n+"px",e=!0):n+l>=i.right&&(i.right=n+l,r.div.style.width=n+2*l-i.left+"px",e=!0),o+l>=i.bottom?(i.bottom=o+l,r.div.style.height=o+2*l-i.top+"px",e=!0):o-l<=i.top&&(i.top=o-l,r.div.style.top=o-l+"px",r.div.style.height=i.bottom+2*l-o+"px",e=!0)}(t);const n=function(t){const e=t.container.bounds;return{width:e.right-e.left,height:e.bottom-e.top}}(t),o=M(n.width,n.height),r=function(t,e){const n=document.createElementNS("http://www.w3.org/2000/svg","path");return n.setAttribute("fill","transparent"),n.setAttribute("stroke","black"),n.setAttribute("stroke-width","4px"),n.setAttribute("stroke-linejoin","round"),n.setAttribute("stroke-linecap","round"),n.setAttribute("d",function(t,e){let n="";for(let o=0;o<t.coords.length;o++){const r=E(t.coords[o],t.container,e);n+=0===o?`M ${r[0]} ${r[1]}`:`L ${r[0]} ${r[1]}`,o!==t.coords.length-1&&(n+="")}return n}(t,e)),n}(t,e);r.style.width="100%",r.style.height="100%",o.appendChild(r),t.container.div.innerHTML="",t.container.div.appendChild(o),t.element=o},onDrawEnd:t=>{console.log(t)},cursor:"url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQiIGhlaWdodD0iMTQiIHZpZXdCb3g9IjAgMCAxNCAxNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZD0iTTEwLjU4NTggMC41ODU3ODZDMTEuMzY2OCAtMC4xOTUyNjIgMTIuNjMzMiAtMC4xOTUyNjIgMTMuNDE0MiAwLjU4NTc4NkMxNC4xOTUzIDEuMzY2ODMgMTQuMTk1MyAyLjYzMzE2IDEzLjQxNDIgMy40MTQyMUwxMi42MjEzIDQuMjA3MTFMOS43OTI4OSAxLjM3ODY4TDEwLjU4NTggMC41ODU3ODZaIiBmaWxsPSIjMTExODI3Ii8+CjxwYXRoIGQ9Ik04LjM3ODY4IDIuNzkyODlMMCAxMS4xNzE2VjE0SDIuODI4NDJMMTEuMjA3MSA1LjYyMTMyTDguMzc4NjggMi43OTI4OVoiIGZpbGw9IiMxMTE4MjciLz4KPC9zdmc+') 0 16, pointer"};export{D as ReactDraw,T as freeDrawTool};
