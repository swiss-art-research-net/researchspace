(window.webpackJsonp=window.webpackJsonp||[]).push([[509],{1524:function(e,t,n){Object.defineProperty(t,"__esModule",{value:!0});var i=n(11),a=n(1),r=n(20),o=n(33),s=n(10),l=n(16),p=n(3401),u=n(162),m=n(56),c=n(61),d=n(116),g=n(327),f=n(630),T=n(23),v=n(140);n(1525);var h=n(1526),S={orientation:"top"},y=function(e){function SemanticTimeline(t,n){var r=e.call(this,t,n)||this;return r.getDataSetAndError=function(e){for(var t=r.props.defaultItemOptions,n=[],a=0,s=e.results.bindings;a<s.length;a++){var l=s[a],u=r.parseDate(l.start),m=r.parseDate(l.end),c=l.type?l.type.value:t.type,d=r.validateDates(u,m,c);if(d)return{dataSet:void 0,errorMessage:o.Just(d)};var g=i.__assign(i.__assign(i.__assign({},t),l),{content:t.content||"",start:u,end:m,type:c,group:l.group?l.group.value:t.group,_start:l.start,_end:l.end});n.push(g)}return{dataSet:new p.DataSet(n),errorMessage:o.Nothing()}},r.getTimelineItemTemplate=makeVisJsTemplateFunction(r,(function(e){var t=r.props,n=t.tupleTemplate,o=t.tupleTemplateHeight,s=i.__assign(i.__assign({},e),{start:e._start,end:e._end});return a.createElement("div",{style:{height:o}},a.createElement(f.TemplateItem,{template:{source:n,options:s}}))})),r.getTimelineGroupTemplate=makeVisJsTemplateFunction(r,(function(e){var t=r.props.options.groupTemplate;return t?a.createElement(f.TemplateItem,{template:{source:t,options:e}}):e.content})),r.renderFitButton=function(){return r.state.isDrawing?null:a.createElement("button",{className:"btn btn-default "+h.fitButton,onClick:function(){return r.timeline.fit()}},a.createElement("i",{className:"fa fa-expand"}))},r.renderLoading=function(){return r.state.isDrawing?a.createElement("div",{className:h.loading},a.createElement(f.TemplateItem,{template:{source:r.props.loadingTemplate}})):null},r.getTimelineOptions=function(){var e=r.props.options;return i.__assign(i.__assign(i.__assign({},S),e),{template:r.getTimelineItemTemplate,groupTemplate:r.getTimelineGroupTemplate,onInitialDrawComplete:function(){r.setState({isDrawing:!1}),setTimeout((function(){return r.timeline.redraw()}),1e3)}})},r.initTimeline=function(e){if(e){var t=r.state.dataSet,n=r.getTimelineOptions();r.timeline=new p.Timeline(e,t,n),r.initGroups()}},r.initGroups=function(){var e=l.keyBy(r.props.groups,(function(e){return e.id})),t={};r.state.dataSet.forEach((function(n){var i=n.group;!i||e[i]||t[i]||(t[i]={id:i,content:i})})),r.getGroupsLabels(t).onValue((function(n){Object.keys(t).forEach((function(e){t[e].content=n[e]})),r.setGroups(i.__assign(i.__assign({},e),t))}))},r.state={dataSet:void 0,isLoading:!0,isDrawing:!0,noResults:!1,tupleTemplate:o.Nothing(),errorMessage:o.Nothing()},r}return i.__extends(SemanticTimeline,e),SemanticTimeline.prototype.componentDidMount=function(){this.prepareData(this.props)},SemanticTimeline.prototype.componentWillReceiveProps=function(e){this.props.query!==e.query&&(this.setState({isLoading:!0}),this.prepareData(e))},SemanticTimeline.prototype.componentWillUnmount=function(){this.timeline&&this.timeline.destroy()},SemanticTimeline.prototype.parseDate=function(e){if(e){var t="Y-MM-DD",n=this.props.dateFormat;return n?t=n:e.datatype.equals(T.vocabularies.xsd.dateTime)?t="Y-MM-DDTHH:mm:ss":e.datatype.equals(T.vocabularies.xsd.time)&&(t="HH:mm:ss"),s(e.value,t)}},SemanticTimeline.prototype.prepareData=function(e){var t=this,n=this.context.semanticContext,i=c.SparqlClient.select(e.query,{context:n});i.onValue((function(e){if(c.SparqlUtil.isSelectResultEmpty(e))t.setState({noResults:!0,errorMessage:o.Nothing(),isLoading:!1});else{var n=t.getDataSetAndError(e),i=n.dataSet,a=n.errorMessage;t.setState({dataSet:i,noResults:!1,errorMessage:a,isLoading:!1})}})),i.onError((function(e){return t.setState({errorMessage:o.Just(e),isLoading:!1})})),i.onEnd((function(){t.props.id&&u.trigger({eventType:u.BuiltInEvents.ComponentLoaded,source:t.props.id})})),this.props.id&&u.trigger({eventType:u.BuiltInEvents.ComponentLoading,source:this.props.id,data:i})},SemanticTimeline.prototype.validateDates=function(e,t,n){return e?t||"range"!==n&&"background"!==n?e.isValid()?t&&!t.isValid()?new Error("The end date is not valid"):void 0:new Error("The start date is not valid"):new Error("The result does not contain an end date"):new Error("The result does not contain a start date")},SemanticTimeline.prototype.getGroupsLabels=function(e){var t=Object.keys(e).map((function(e){return T.Rdf.iri(e)}));return v.getLabels(t).map((function(e){return e.mapKeys((function(e){return e.value})).toObject()}))},SemanticTimeline.prototype.setGroups=function(e){var t=Object.keys(e).map((function(t){return e[t]}));t.length&&this.timeline.setGroups(t)},SemanticTimeline.prototype.render=function(){var e=this.props,t=e.noResultTemplate,n=e.className,i=e.style,r=this.state,o=r.isLoading,s=r.noResults,l=r.errorMessage;return l.isNothing?o?a.createElement(g.Spinner,null):s?a.createElement(f.TemplateItem,{template:{source:t}}):a.createElement("div",{className:h.timeline+" "+(n||""),style:i},a.createElement("div",{ref:this.initTimeline}),this.renderFitButton(),this.renderLoading()):a.createElement(d.ErrorNotification,{errorMessage:l.get()})},SemanticTimeline.defaultProps={tupleTemplate:"{{start.value}} - {{end.value}}",tupleTemplateHeight:21,loadingTemplate:"<span>Please wait, loading ....</span>",options:{},defaultItemOptions:{},groups:[]},SemanticTimeline}(m.Component);function makeVisJsTemplateFunction(e,t){return function(n,i,a){if(a){var o=t(n);return r.unstable_renderSubtreeIntoContainer(e,o,i),{}}}}t.SemanticTimeline=y,t.default=y}}]);
//# sourceMappingURL=semantic-timeline-9aa39178d5de4186f504.js.map