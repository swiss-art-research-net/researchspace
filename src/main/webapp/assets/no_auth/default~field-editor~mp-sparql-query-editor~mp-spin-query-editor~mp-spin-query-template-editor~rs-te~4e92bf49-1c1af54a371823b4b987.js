(window.webpackJsonp=window.webpackJsonp||[]).push([[117],{1886:function(e,t,o){Object.defineProperty(t,"__esModule",{value:!0});var r=o(11),i=o(1),n=o(20),s=o(72),a=function(e){function TargetedPopover(t){var o=e.call(this,t)||this;return o.hovering=!1,o.onPopoverMount=function(e){o.popover=e,o.onPotentialSizeChange()},o.onObservedChildMount=function(e){o.observer&&o.observer.disconnect(),e&&(o.observer=new MutationObserver(o.onPotentialSizeChange),o.observer.observe(e,{subtree:!0,attributes:!0,childList:!0,characterData:!0}),o.onPotentialSizeChange())},o.onPotentialSizeChange=function(){var e=o.popover?n.findDOMNode(o.popover):void 0;if(e){var t=e.offsetWidth,r=e.offsetHeight;o.setState((function(e){var o=e.contentSize;return o&&t===o.width&&r===o.height?null:{contentSize:{width:t,height:r}}}))}},o.onMouseEnter=function(){o.hovering=!0,o.restartTimeout()},o.onMouseLeave=function(){o.hovering=!1,o.restartTimeout()},o.onHideByTimeout=function(){var e=o.props.onHide;e&&!o.hovering&&e()},o.state={},o}return r.__extends(TargetedPopover,e),TargetedPopover.prototype.render=function(){var e,t,o=this.props,r=o.id,n=o.targetLeft,a=o.targetTop,p=o.popoverSide,h=o.arrowAlignment,u=o.arrowOffset,d=o.children,c=this.state.contentSize,v=n,f=a;if(c){switch(p){case"left":case"right":f-=t="start"===h?u:"end"===h?c.height-u:c.height/2;break;case"top":case"bottom":v-=e="start"===h?u:"end"===h?c.width-u:c.width/2}"left"===p?v-=c.width:"top"===p&&(f-=c.height)}return i.createElement(s.Popover,{ref:this.onPopoverMount,id:r,style:{whiteSpace:"nowrap",maxWidth:"unset"},onMouseEnter:this.onMouseEnter,onMouseLeave:this.onMouseLeave,placement:p,positionLeft:v,positionTop:f,arrowOffsetLeft:e,arrowOffsetTop:t},i.createElement("div",{ref:this.onObservedChildMount},d))},TargetedPopover.prototype.componentDidMount=function(){this.restartTimeout()},TargetedPopover.prototype.componentDidUpdate=function(e){Boolean(this.props.onHide)!==Boolean(e.onHide)&&this.restartTimeout()},TargetedPopover.prototype.componentWillUnmount=function(){this.clearTimeout()},TargetedPopover.prototype.restartTimeout=function(){this.clearTimeout(),this.props.onHide&&!this.hovering&&(this.showTimeout=setTimeout(this.onHideByTimeout,this.props.hideTimeout))},TargetedPopover.prototype.clearTimeout=function(){this.showTimeout&&(clearTimeout(this.showTimeout),this.showTimeout=void 0)},TargetedPopover.defaultProps={arrowOffset:15,hideTimeout:2e3},TargetedPopover}(i.Component);t.TargetedPopover=a,t.choosePopoverSide=function choosePopoverSide(e,t,o,r){var i=e/o,n=t/r,s=n>1-i,a=n>i?s?"top":"right":s?"left":"bottom",p="center";return"top"!==a&&"bottom"!==a||(i<.1?p="start":i>.9&&(p="end")),{popoverSide:a,arrowAlignment:p}}}}]);
//# sourceMappingURL=default~field-editor~mp-sparql-query-editor~mp-spin-query-editor~mp-spin-query-template-editor~rs-te~4e92bf49-1c1af54a371823b4b987.js.map