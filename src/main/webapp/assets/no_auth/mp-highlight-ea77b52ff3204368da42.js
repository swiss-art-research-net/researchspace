(window.webpackJsonp=window.webpackJsonp||[]).push([[112],{1271:function(t,n,i){Object.defineProperty(n,"__esModule",{value:!0});var e=i(11),o=i(1),s=i(35),r=i(1413),h=function(t){function HighlightComponent(){return null!==t&&t.apply(this,arguments)||this}return e.__extends(HighlightComponent,t),HighlightComponent.prototype.render=function(){if("string"!=typeof this.props.children)throw"Children of HighlightComponent must be string";var t=this.props.children,n=this.props,i=n.className,o=n.style;return s.span.apply(s,e.__spreadArrays([{className:i,style:o}],function highlight(t,n,i){void 0===i&&(i={className:r.highlight});if(n){var e=n.toLowerCase(),o=t.toLowerCase().indexOf(e);if(o>=0){var h=o+e.length;return[t.substring(0,o),s.span(i,t.substring(o,h)),t.substring(h)]}}return[t]}(t,this.props.highlight,this.props.highlightProps)))},HighlightComponent}(o.Component);n.HighlightComponent=h,n.default=h}}]);
//# sourceMappingURL=mp-highlight-ea77b52ff3204368da42.js.map