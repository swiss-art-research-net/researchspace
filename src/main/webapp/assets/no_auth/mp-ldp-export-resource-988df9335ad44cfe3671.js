(window.webpackJsonp=window.webpackJsonp||[]).push([[362],{1411:function(o,e,n){Object.defineProperty(e,"__esModule",{value:!0});var t=n(11),r=n(1),i=n(139),p=n(16),c=n(10),s=n(56),l=n(118),u=n(34),a=n(140),m=n(23);function isIriProps(o){return p.has(o,"iri")}function isSelectionProps(o){return p.has(o,"selection")}var h=function(o){function ExportResourceComponent(e,n){var t=o.call(this,e,n)||this;return t.cancellation=new u.Cancellation,t.onClick=function(){var o=isIriProps(t.props)?[t.props.iri]:t.props.selection,e=t.getLDPService().getExportURL(o),n=t.context.semanticContext.repository;t.cancellation.map(a.getLabels(o.map(m.Rdf.iri),{context:{repository:n}})).observe({value:function(o){var n=o.toArray().reduce((function(o,e){var n=e.replace(/\s/g,"-");return""===o?n:o+"-"+n}),""),t=c().format("YYYY-MM-DDTHH-mm")+"-"+window.location.hostname+"-"+n+".trig";window.open(e+"&filename="+t,"_blank")},error:function(o){throw Error(o)}})},t.checkProps(e),t}return t.__extends(ExportResourceComponent,o),ExportResourceComponent.prototype.componentWillReceiveProps=function(o){this.checkProps(o)},ExportResourceComponent.prototype.componentWillUnmount=function(){this.cancellation.cancelAll()},ExportResourceComponent.prototype.checkProps=function(o){if(isIriProps(o)===isSelectionProps(o))throw"Property iri xor selection of mp-ldp-export-resource should be set"},ExportResourceComponent.prototype.getLDPService=function(){return new l.LdpService("",this.context.semanticContext)},ExportResourceComponent.prototype.render=function(){var o=r.Children.only(this.props.children);return r.cloneElement(o,i({},o.props,{disabled:isSelectionProps(this.props)&&0===this.props.selection.length,onClick:this.onClick}))},ExportResourceComponent}(s.Component);e.ExportResourceComponent=h,e.default=h}}]);
//# sourceMappingURL=mp-ldp-export-resource-988df9335ad44cfe3671.js.map