(window.webpackJsonp=window.webpackJsonp||[]).push([[369],{1423:function(o,e,n){Object.defineProperty(e,"__esModule",{value:!0});var r=n(11),t=n(1),p=n(72),l=n(16),i=n(214),s=n(1279),c=n(1280),a=t.createFactory(p.OverlayTrigger),C=t.createFactory(p.Popover),d=function(o){function PopoverComponentClass(){return null!==o&&o.apply(this,arguments)||this}return r.__extends(PopoverComponentClass,o),PopoverComponentClass.prototype.render=function(){var o=this.props,e=o.title,n=o.className,r=t.Children.toArray(this.props.children),p=l.find(r,(function(o){return i.componentHasType(o,c.PopoverTriggerComponent)})),d=l.find(r,(function(o){return i.componentHasType(o,s.PopoverContentComponent)})),m=t.Children.only(p).props.children,u=t.Children.only(d).props.children,y=C({id:"mp-popover",title:e,className:n},u),h=t.Children.only(p).props.trigger,v=t.Children.only(p).props.placement,f=t.Children.only(p).props.rootClose;return a({overlay:y,trigger:h||["click"],placement:v,rootClose:f||!0},t.cloneElement(m,{onClick:function(o){return o.stopPropagation()}}))},PopoverComponentClass}(t.Component);e.PopoverComponentClass=d,e.component=d,e.factory=t.createFactory(e.component),e.default=e.component}}]);
//# sourceMappingURL=mp-popover-8678cdbc96dc643d017e.js.map