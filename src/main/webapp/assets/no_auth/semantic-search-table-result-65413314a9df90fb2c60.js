(window.webpackJsonp=window.webpackJsonp||[]).push([[506],{1360:function(e,t,n){Object.defineProperty(t,"__esModule",{value:!0});var r=n(11),a=n(1),i=n(23),o=n(214),l=n(1690),s=n(1569),c=function(e){function SemanticSearchTableResult(){return null!==e&&e.apply(this,arguments)||this}return r.__extends(SemanticSearchTableResult,e),SemanticSearchTableResult.prototype.render=function(){var e=this;return a.createElement(s.SemanticSearchContext.Consumer,null,(function(t){return a.createElement(u,r.__assign({},e.props,{context:t}))}))},SemanticSearchTableResult}(a.Component);t.SemanticSearchTableResult=c;var u=function(e){function SemanticSearchTableResultInner(t){var n=e.call(this,t)||this;return n.state={columnConfiguration:[]},n}return r.__extends(SemanticSearchTableResultInner,e),SemanticSearchTableResultInner.prototype.componentDidMount=function(){this.prepareColumnConfiguration()},SemanticSearchTableResultInner.prototype.componentDidUpdate=function(e){var t=e.context,n=this.props.context,r=n.searchProfileStore,a=n.availableDomains;t.searchProfileStore.isEqual(r)&&t.availableDomains.isEqual(a)||this.prepareColumnConfiguration()},SemanticSearchTableResultInner.prototype.prepareColumnConfiguration=function(){var e=this.props.context.graphScopeResults.isJust?function prepareGraphScopeColumns(e){var t=e.searchProfileStore,n=e.graphScopeResults,r=t.isJust?t.get():void 0,a=[];if(n.isJust)for(var o=0,l=n.get().columns;o<l.length;o++){var s=l[o],c=s.id.replace(/^\?/,""),u=void 0;if("var-concept"===s.type){var p=i.Rdf.fullIri(s.tgConcept.iri);u=r&&r.categories.has(p)?r.categories.get(p).label:c}else u=s.attribute.label;a.push({variableName:c,displayName:u})}return a}(this.props.context):function prepareSearchProfileColumns(e){var t=e.searchProfileStore,n=e.availableDomains,r=[],a=t.isJust?t.get():void 0,i=n.isJust?n.get():void 0;i&&i.forEach((function(e,t){var n=e.replace(/^\?/,"");r.push({variableName:n,displayName:a&&a.categories.has(t)?a.categories.get(t).label:n})}));return r}(this.props.context);this.setState({columnConfiguration:e})},SemanticSearchTableResultInner.prototype.mapChildren=function(e){var t=this,n=this.state.columnConfiguration;return o.universalChildren(a.Children.toArray(e).map((function(e){return o.isValidChild(e)?o.componentHasType(e,l.SemanticTable)?a.cloneElement(e,r.__assign(r.__assign({},e.props),{columnConfiguration:n})):a.cloneElement(e,e.props,t.mapChildren(e.props.children)):e})))},SemanticSearchTableResultInner.prototype.render=function(){return this.mapChildren(this.props.children)},SemanticSearchTableResultInner}(a.Component);t.SemanticSearchTableResultInner=u,t.default=c}}]);
//# sourceMappingURL=semantic-search-table-result-65413314a9df90fb2c60.js.map