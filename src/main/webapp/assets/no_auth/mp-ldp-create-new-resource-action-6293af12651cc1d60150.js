(window.webpackJsonp=window.webpackJsonp||[]).push([[360],{1409:function(e,r,o){Object.defineProperty(r,"__esModule",{value:!0});var t=o(11),n=o(1),c=o(35),a=o(33),p=o(56),i=o(23),s=o(118),u=o(117),l=o(1956),d=i.Rdf.graph,f=i.Rdf.iri,w=i.Rdf.triple,v=i.Rdf.literal,h=i.vocabularies.rdfs,m=i.vocabularies.rdf;o(1270);var C=function(e){function CreateNewResourceComponent(){var r=null!==e&&e.apply(this,arguments)||this;return r.createResource=function(e){return new s.LdpService(r.props.container,r.context.semanticContext).addResource(d([w(f(""),m.type,f(r.props.type)),w(f(""),h.label,v(e))]),a.Just(e))},r.onSave=function(e){return r.createResource(e)},r}return t.__extends(CreateNewResourceComponent,e),CreateNewResourceComponent.prototype.render=function(){var e=this,r=n.Children.only(this.props.children),o={onClick:function(){u.getOverlaySystem().show("create-new-resource",n.createElement(l.CreateResourceDialog,{onSave:e.onSave,onHide:function(){return u.getOverlaySystem().hide("create-new-resource")},show:!0,title:e.props.title,placeholder:e.props.placeholder}))}};return c.div({},n.cloneElement(r,o))},CreateNewResourceComponent}(p.Component);r.component=C,r.factory=n.createFactory(r.component),r.default=r.component}}]);
//# sourceMappingURL=mp-ldp-create-new-resource-action-6293af12651cc1d60150.js.map