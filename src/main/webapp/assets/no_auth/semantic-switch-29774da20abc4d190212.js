(window.webpackJsonp=window.webpackJsonp||[]).push([[507],{1362:function(e,t,r){Object.defineProperty(t,"__esModule",{value:!0});var i=r(11),a=r(1),n=r(56),s=r(34),o=r(61),c=r(116),l=r(327),u=r(630),p=function(e){function SemanticSwitch(t,r){var i=e.call(this,t,r)||this;return i.cancellation=new s.Cancellation,i.state={loading:!0},i}return i.__extends(SemanticSwitch,e),SemanticSwitch.prototype.componentDidMount=function(){var e,t=this;try{e=function parseSwitchSelectQuery(e){if(!e)throw new Error("Missing SELECT Sparql query for <semantic-switch>");var t=o.SparqlUtil.parseQuery(e);if("query"!==t.type||"SELECT"!==t.queryType)throw new Error("Sparql query must be a SELECT query");if(o.SparqlTypeGuards.isStarProjection(t.variables)||1!==t.variables.length)throw new Error("SELECT query for <semantic-switch> must contain only a single projection variable");return t}(this.props.query)}catch(e){return void this.setState({loading:!1,error:e})}var r=this.context.semanticContext;this.cancellation.map(o.SparqlClient.select(e,{context:r})).observe({value:function(e){return t.setResultCase(e)},error:function(e){return t.setState({loading:!1,error:e})}})},SemanticSwitch.prototype.getCaseTemplate=function(e){var t=this.props.cases[e];if(t)return t;var r=this.props.markupTemplateScope,i=r?r.getPartial(e):void 0;return i?i.source:void 0},SemanticSwitch.prototype.setResultCase=function(e){if(0===e.results.bindings.length)this.setState({loading:!1});else{var t=e.results.bindings[0][e.head.vars[0]],r=t?t.value:void 0;this.setState({loading:!1,selectedCase:r})}},SemanticSwitch.prototype.render=function(){if(this.state.loading)return a.createElement(l.Spinner,null);if(this.state.error)return a.createElement(c.ErrorNotification,{errorMessage:this.state.error});var e=this.getCaseTemplate(this.state.selectedCase),t=void 0===e?this.getCaseTemplate("default"):e;return t?a.createElement(u.TemplateItem,{template:{source:t}}):null},SemanticSwitch.defaultProps={cases:{}},SemanticSwitch}(n.Component);t.SemanticSwitch=p,t.default=p}}]);
//# sourceMappingURL=semantic-switch-29774da20abc4d190212.js.map