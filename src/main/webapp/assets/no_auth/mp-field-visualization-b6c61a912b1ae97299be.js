(window.webpackJsonp=window.webpackJsonp||[]).push([[155],{1258:function(e,t,i){Object.defineProperty(t,"__esModule",{value:!0});var a=i(11),n=i(1),s=i(19),o=i(16),u=i(23),l=i(56),r=i(630),d=i(327),c=i(63),p=i(1208),f=i(1689),m=function(e){function FieldBasedVisualization(t,i){var a=e.call(this,t,i)||this;return a.state={fieldsData:[],isLoading:!0,noData:!0},a}return a.__extends(FieldBasedVisualization,e),FieldBasedVisualization.prototype.componentDidMount=function(){this.fetchFieldValues()},FieldBasedVisualization.prototype.render=function(){return this.state.isLoading?n.createElement(d.Spinner):this.renderResult()},FieldBasedVisualization.prototype.renderResult=function(){return n.createElement(r.TemplateItem,{template:{source:this.props.template,options:{subject:this.props.subject,additionalSubjects:this.props.additionalSubjects,fields:this.state.fieldsData,noData:this.state.noData}}})},FieldBasedVisualization.prototype.fetchFieldValues=function(){var e=this,t=this.props,i=t.fields,a=t.subject,n=t.additionalSubjects,l=u.Rdf.iri(a),r=n.map((function(e){return u.Rdf.iri(e)}));s.combine(i.map(p.normalizeFieldDefinition).map((function(t){return f.queryValues(t.selectPattern,l,{context:e.context.semanticContext},r).map((function(e){var i=o.cloneDeep(t);return i.values=o.isEmpty(e)?null:e,i}))}))).onValue((function(t){return e.setState({fieldsData:t,isLoading:!1,noData:o.every(t,(function(e){return null===e.values}))})}))},FieldBasedVisualization.defaultProps={subject:c.getCurrentResource().value,additionalSubjects:[]},FieldBasedVisualization}(l.Component);t.FieldBasedVisualization=m,t.default=m}}]);
//# sourceMappingURL=mp-field-visualization-b6c61a912b1ae97299be.js.map