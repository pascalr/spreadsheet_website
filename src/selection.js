!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.Selection=t():e.Selection=t()}(window,function(){return function(e){var t={};function n(o){if(t[o])return t[o].exports;var l=t[o]={i:o,l:!1,exports:{}};return e[o].call(l.exports,l,l.exports,n),l.l=!0,l.exports}return n.m=e,n.c=t,n.d=function(e,t,o){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:o})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var o=Object.create(null);if(n.r(o),Object.defineProperty(o,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var l in e)n.d(o,l,function(t){return e[t]}.bind(null,l));return o},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="dist/",n(n.s=0)}([function(e,t,n){"use strict";n.r(t);var o={};function l(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},o=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(o=o.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),o.forEach(function(t){r(e,t,n[t])})}return e}function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t,n,o){let r=arguments.length>4&&void 0!==arguments[4]?arguments[4]:{};t instanceof HTMLCollection||t instanceof NodeList?t=Array.from(t):Array.isArray(t)||(t=[t]),Array.isArray(n)||(n=[n]);for(const a of t)for(const t of n)a[e](t,o,l({capture:!1},r));return Array.prototype.slice.call(arguments,1)}n.r(o),n.d(o,"on",function(){return i}),n.d(o,"off",function(){return c}),n.d(o,"css",function(){return u}),n.d(o,"intersects",function(){return d}),n.d(o,"selectAll",function(){return p}),n.d(o,"eventPath",function(){return f}),n.d(o,"removeElement",function(){return _}),n.d(o,"simplifyEvent",function(){return h}),n.d(o,"isElement",function(){return m});const i=a.bind(null,"addEventListener"),c=a.bind(null,"removeEventListener"),s=function(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"px";return"number"==typeof e?e+t:""+e};function u(e,t,n){const o=e&&e.style;if(o)if("object"==typeof t)for(const e in t)o[e]=s(t[e]);else{if(null==n){const o=document.defaultView;return o&&o.getComputedStyle?n=o.getComputedStyle(e,null):e.currentStyle&&(n=e.currentStyle),null==t?n:n[t]}o[t]=s(n)}}function d(e,t){let n=arguments.length>2&&void 0!==arguments[2]?arguments[2]:"touch";if("center"===n){const n=t.left+t.width/2,o=t.top+t.height/2;return n>=e.left&&n<=e.right&&o>=e.top&&o<=e.bottom}return"cover"===n?t.left>=e.left&&t.top>=e.top&&t.right<=e.right&&t.bottom<=e.bottom:"touch"===n?e.right>=t.left&&e.left<=t.right&&e.bottom>=t.top&&e.top<=t.bottom:void 0}function p(e){Array.isArray(e)||(e=[e]);const t=[];for(const n of e)t.push(...document.querySelectorAll(n));return t}function f(e){let t=e.path||e.composedPath&&e.composedPath();if(t)return t;let n=e.target.parentElement;for(t=[e.target,n];n=n.parentElement;)t.push(n);return t.push(document,window),t}function _(e,t){const n=e.indexOf(t);~n&&e.splice(n,1)}function h(e){const t=e.touches&&e.touches[0]||e;return{tap:t,x:t.clientX,y:t.clientY,target:t.target}}function m(e){return"object"==typeof HTMLElement?e instanceof HTMLElement:"object"==typeof e&&null!==e&&1===e.nodeType&&"string"==typeof e.nodeName}function g(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}
/**
 * Selection, library to realize visual DOM-Selection like on your Desktop.
 *
 * @author  Simon Reinisch
 * @license MIT
 */const v=Math.abs,y=Math.max,b=Math.min,S=Math.round,E=document,w=e=>e.preventDefault();function T(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{};const t={options:Object.assign({class:"selection-area",mode:"touch",startThreshold:10,singleClick:!0,disableTouch:!1,validateStart:()=>!0,containers:[],selectables:[],scrollSpeedDivider:10,startareas:["html"],boundaries:["html"],selectionAreaContainer:"body"},e),_selectedStore:[],_areaElement:E.createElement("div"),_clippingElement:E.createElement("div"),_scrollAvailable:!0,_scrollSpeed:{x:null,y:null},_selectionAreaContainer:null,_init(){m(t.options.selectionAreaContainer)?t._selectionAreaContainer=t.options.selectionAreaContainer:t._selectionAreaContainer=E.querySelector(t.options.selectionAreaContainer),t._clippingElement.appendChild(t._areaElement),t._selectionAreaContainer.appendChild(t._clippingElement),u(t._areaElement,{top:0,left:0,position:"fixed"}),u(t._clippingElement,{overflow:"hidden",position:"fixed",transform:"translate3d(0, 0, 0)","pointer-events":"none"}),t.enable()},_bindStartEvents(e){o[e](E,"mousedown",t._onTapStart),t.options.disableTouch||o[e](E,"touchstart",t._onTapStart,{passive:!1})},_onTapStart(e){const n=h(e),o=n.x,l=n.y,r=n.target.getBoundingClientRect();if(!t.options.validateStart(e))return;const a=p(t.options.startareas);t._boundaries=p(t.options.boundaries);const c=f(e);a.find(e=>c.includes(e))&&t._boundaries.find(e=>c.includes(e))&&(t._areaX1=o,t._areaY1=l,t._areaX2=0,t._areaY2=0,t._singleClick=!0,t.resolveSelectables(),t._targetContainer=t._boundaries.find(e=>d(e.getBoundingClientRect(),r)),t._targetBoundary=t._targetContainer.getBoundingClientRect(),t._touchedElements=[],t._changedElements={added:[],removed:[]},S(t._targetContainer.scrollHeight)!==S(t._targetBoundary.height)||S(t._targetContainer.scrollWidth)!==S(t._targetBoundary.width)?(t._scrollAvailable=!0,i(window,"wheel",t._manualScroll),t._selectables=t._selectables.filter(e=>t._targetContainer.contains(e)),u(t._clippingElement,{top:t._targetBoundary.top,left:t._targetBoundary.left,width:t._targetBoundary.width,height:t._targetBoundary.height}),u(t._areaElement,{"margin-top":-t._targetBoundary.top,"margin-left":-t._targetBoundary.left})):(t._scrollAvailable=!1,u(t._clippingElement,{top:0,left:0,width:"100%",height:"100%"}),u(t._areaElement,{"margin-top":0,"margin-left":0})),t._areaElement.classList.add(t.options.class),i(E,"selectstart",w),i(E,"mousemove",t._delayedTapMove),i(E,"touchmove",t._delayedTapMove,{passive:!1}),i(E,["mouseup","touchcancel","touchend"],t._onTapStop),e.preventDefault())},_onSingleTap(e){let n=h(e).target;for(;!t._selectables.includes(n);){if(!n.parentElement)return;n=n.parentElement}t._touchedElements.push(n),t._dispatchEvent("onSelect",e,{target:n})},_delayedTapMove(e){const n=h(e),o=n.x,l=n.y;v(o+l-(t._areaX1+t._areaY1))>=t.options.startThreshold&&(c(E,["mousemove","touchmove"],t._delayedTapMove),i(E,["mousemove","touchmove"],t._onTapMove),u(t._areaElement,"display","block"),t._onTapMove(e),t._dispatchEvent("onStart",e),t._singleClick=!1)},_onTapMove(e){const n=h(e),o=n.x,l=n.y;if(t._areaX2=o,t._areaY2=l,!t._scrollAvailable||null===t._scrollSpeed.y&&null===t._scrollSpeed.x)t._redrawArea(),t._updatedTouchingElements(),t._dispatchEvent("onMove",e);else{const n=t._targetContainer;requestAnimationFrame(function o(){if(null===t._scrollSpeed.y&&null===t._scrollSpeed.x)return;const l=n.scrollTop,r=n.scrollLeft;null!==t._scrollSpeed.y&&(n.scrollTop+=Math.ceil(t._scrollSpeed.y/t.options.scrollSpeedDivider),t._areaY1-=n.scrollTop-l),null!==t._scrollSpeed.x&&(n.scrollLeft+=Math.ceil(t._scrollSpeed.x/t.options.scrollSpeedDivider),t._areaX1-=n.scrollLeft-r),t._redrawArea(),t._updatedTouchingElements(),t._dispatchEvent("onMove",e),requestAnimationFrame(o)})}},_manualScroll(e){t._scrollSpeed.y+=t.options.scrollSpeedDivider*(-1*e.wheelDeltaY),t._scrollSpeed.x+=t.options.scrollSpeedDivider*(-1*e.wheelDeltaX),t._onTapMove(e),e.preventDefault()},_redrawArea(){const e=t._targetContainer,n=e.scrollTop,o=e.scrollHeight,l=e.clientHeight,r=e.scrollLeft,a=e.scrollWidth,i=e.clientWidth,c=t._targetBoundary;let s=t._areaX2,d=t._areaY2;s<c.left?(t._scrollSpeed.x=r?-Math.abs(c.left-s):null,s=c.left):s>c.left+c.width?(t._scrollSpeed.x=a-r-i?Math.abs(c.left+c.width-s):null,s=c.left+c.width):t._scrollSpeed.x=null,d<c.top?(t._scrollSpeed.y=n?-Math.abs(c.top-d):null,d=c.top):d>c.top+c.height?(t._scrollSpeed.y=o-n-l?Math.abs(c.top+c.height-d):null,d=c.top+c.height):t._scrollSpeed.y=null;const p=b(t._areaX1,s),f=b(t._areaY1,d),_=y(t._areaX1,s),h=y(t._areaY1,d);u(t._areaElement,{top:f,left:p,width:_-p,height:h-f})},_onTapStop(e,n){c(E,["mousemove","touchmove"],t._delayedTapMove),c(E,["touchmove","mousemove"],t._onTapMove),c(E,["mouseup","touchcancel","touchend"],t._onTapStop),t._singleClick&&t.options.singleClick?t._onSingleTap(e):t._singleClick||n||(t._updatedTouchingElements(),t._dispatchEvent("onStop",e)),t._scrollSpeed={x:null,y:null},c(window,"wheel",t._manualScroll),c(E,"selectstart",w),u(t._areaElement,"display","none")},_updatedTouchingElements(){const e=[],n={added:[],removed:[]},o=t.options.mode,l=t._selectables,r=t._areaElement.getBoundingClientRect();for(let a,i=0,c=l.length;a=l[i],i<c;i++)d(r,a.getBoundingClientRect(),o)&&!1!==t._dispatchFilterEvent("selectionFilter",a)&&(t._touchedElements.includes(a)||n.added.push(a),e.push(a));for(let o,l=0,r=t._touchedElements.length;o=t._touchedElements[l],l<r;l++)e.includes(o)||n.removed.push(o);t._touchedElements=e,t._changedElements=n},_dispatchFilterEvent(e,n){const o=t.options[e];if("function"==typeof o)return o.call(t,{selection:t,eventName:e,element:n})},_dispatchEvent(e,n,o){const l=t.options[e];if("function"==typeof l)return l.call(t,function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{},o=Object.keys(n);"function"==typeof Object.getOwnPropertySymbols&&(o=o.concat(Object.getOwnPropertySymbols(n).filter(function(e){return Object.getOwnPropertyDescriptor(n,e).enumerable}))),o.forEach(function(t){g(e,t,n[t])})}return e}({selection:t,areaElement:t._areaElement,selectedElements:t._touchedElements.concat(t._selectedStore),changedElements:t._changedElements,eventName:e,originalEvent:n},o))},resolveSelectables(){t._selectables=p(t.options.selectables);const e=p(t.options.containers);for(let n=0,o=e.length;n<o;n++)t._selectables.push(...e[n].querySelectorAll("*"))},keepSelection(){for(let e,n=0,o=t._touchedElements.length;e=t._touchedElements[n],n<o;n++)t._selectedStore.includes(e)||t._selectedStore.push(e)},clearSelection(){t._selectedStore=[]},removeFromSelection(e){_(t._selectedStore,e),_(t._touchedElements,e)},getSelection:()=>t._selectedStore,cancel(){let e=arguments.length>0&&void 0!==arguments[0]&&arguments[0];t._onTapStop(null,!e)},option(e,n){const o=t.options;return null==n?o[e]:o[e]=n},disable(){t._bindStartEvents("off")},destroy(){t.disable(),t._selectionAreaContainer.removeChild(t._clippingElement)},enable(){t._bindStartEvents("on")}};return t._init(),t}T.utils={on:i,off:c,css:u,intersects:d,selectAll:p,eventPath:f,removeElement:_},T.create=(e=>new T(e)),T.version="0.2.1";t.default=T}]).default});
//# sourceMappingURL=selection.min.js.map
