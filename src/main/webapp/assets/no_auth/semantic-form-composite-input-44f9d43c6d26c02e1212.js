(window.webpackJsonp=window.webpackJsonp||[]).push([[29],{1217:function(e,t,n){Object.defineProperty(t,"__esModule",{value:!0});var r=n(11),i=n(1),a=n(43),o=n(19),u=n(34),s=n(23),l=n(327),p=n(1208),d=n(1553),f=n(1945),c=n(1825),v=n(1619),m=n(1631),h=n(1620),y={dataState:d.DataState.Ready,validation:u.Cancellation.cancelled},g=function(e){function CompositeInput(t,n){var r=e.call(this,t,n)||this;return r.cancellation=new u.Cancellation,r.compositeOperations=r.cancellation.derive(),r.shouldReload=!0,r.compositeState=d.DataState.Ready,r.inputRefs=new Map,r.inputStates=new Map,r.onFieldValuesChanged=function(e,t){r.props.updateValue((function(n){return r.setFieldValue(e,n,t)}))},r.dataStateForField=function(e){return r.compositeState!==d.DataState.Ready?r.compositeState:(r.inputStates.get(e)||y).dataState},r.onMountInput=function(e,t,n){var i=r.inputRefs.get(e);i||(i=[],r.inputRefs.set(e,i)),i[t]=n},r}return r.__extends(CompositeInput,e),CompositeInput.prototype.getHandler=function(){var e=this.props.handler;if(!(e instanceof S))throw new Error("Invalid value handler for CompositeInput");return e},CompositeInput.prototype.componentDidMount=function(){this.tryLoadComposite(this.props)},CompositeInput.prototype.componentWillReceiveProps=function(e){e.value!==this.props.value&&(this.shouldReload=!0),this.tryLoadComposite(e)},CompositeInput.prototype.componentWillUnmount=function(){this.cancellation.cancelAll()},CompositeInput.prototype.tryLoadComposite=function(e){this.shouldReload&&e.dataState===d.DataState.Ready&&((!d.FieldValue.isComposite(e.value)||e.value.fields.size>0&&0===e.value.definitions.size)&&(this.shouldReload=!1,this.loadComposite(e)))},CompositeInput.prototype.loadComposite=function(e){var t=this;this.compositeOperations=this.cancellation.deriveAndCancel(this.compositeOperations);var n=this.getHandler(),r=n.definitions.filter((function(e,t){return n.inputs.has(t)})).toMap(),i=createRawComposite(e.value,r,n.configurationErrors);this.compositeState=d.DataState.Loading,this.inputStates.clear(),e.updateValue((function(){return i})),this.compositeOperations.map(c.loadDefaults(i,n.inputs).flatMap((function(e){return o.later(0,e)}))).observe({value:function(n){var r=n(i);d.FieldValue.isComposite(e.value)&&(r=function mergeInitialValues(e,t){if(0===t.fields.size)return e;return d.CompositeValue.set(e,{fields:e.fields.map((function(e,n){return t.fields.get(n,e)})).toMap()})}(r,e.value)),t.compositeState=d.DataState.Ready,t.props.updateValue((function(){return r}))}})},CompositeInput.prototype.setFieldValue=function(e,t,n){if(d.FieldValue.isComposite(t)){var r=function reduceFieldValue(e,t,n){var r=t.fields.get(e,d.FieldState.empty),i=d.FieldState.set(r,n({values:r.values,errors:r.errors})),a=t.fields.set(e,i);return d.CompositeValue.set(t,{fields:a})}(e.id,t,n);return this.isInputLoading(e.id)?this.inputStates.set(e.id,y):this.startValidatingField(e,t,r),r}},CompositeInput.prototype.isInputLoading=function(e){var t=this.inputRefs.get(e);if(!t)return!0;for(var n=0,r=t;n<r.length;n++){var i=r[n];if(!i||i.dataState()===d.DataState.Loading)return!0}return!1},CompositeInput.prototype.startValidatingField=function(e,t,n){var r=this,i=this.inputStates.get(e.id)||y,a=i.dataState,u=i.validation,s=c.tryBeginValidation(e,t,n);a=s?d.DataState.Verifying:d.DataState.Ready,u=this.compositeOperations.deriveAndCancel(u),this.inputStates.set(e.id,{dataState:a,validation:u}),s&&u.map(o.later(500,{}).flatMap((function(){return s}))).observe({value:function(t){var n=r.props.value;if(d.FieldValue.isComposite(n)){var i=t(n);r.inputStates.set(e.id,y),r.props.updateValue((function(){return i}))}}})},CompositeInput.prototype.dataState=function(){if(!d.FieldValue.isComposite(this.props.value))return d.DataState.Loading;if(this.compositeState!==d.DataState.Ready)return this.compositeState;for(var e=d.DataState.Ready,t=0,n=this.props.value.definitions.map((function(e){return e.id})).toArray();t<n.length;t++){var r=n[t],i=this.inputRefs.get(r);if(i)for(var a=0,o=i;a<o.length;a++){var u=o[a];u&&(e=d.mergeDataState(e,u.dataState()))}else e=d.mergeDataState(e,d.DataState.Loading)}return e},CompositeInput.prototype.render=function(){var e=this.props.value;if(!d.FieldValue.isComposite(e))return i.createElement(l.Spinner);var t=f.renderFields(this.props.children,e,this.getHandler().handlers,this.dataStateForField,this.onFieldValuesChanged,this.onMountInput);return i.createElement("div",{className:"composite-input"},t)},CompositeInput.makeHandler=function(e){return new S(e)},CompositeInput.inputKind=h.InputKind.CompositeInput,CompositeInput}(v.SingleValueInput);t.CompositeInput=g;var S=function(){function CompositeHandler(e){var t=this,n=e.baseInputProps;this.newSubjectTemplate=n.newSubjectTemplate,this.definitions=function normalizeDefinitons(e){return a.Map().withMutations((function(t){for(var n=0,r=e;n<r.length;n++){var i=r[n];if(!t.has(i.id)){var a=p.normalizeFieldDefinition(i);t.set(a.id,a)}}}))}(n.fields);var r=f.validateFieldConfiguration(this.definitions,n.children),i=r.inputs,o=r.errors;this.inputs=i,this.configurationErrors=o,this.handlers=i.map((function(e){return e.map((function(e){return m.MultipleValuesInput.getHandlerOrDefault(e.inputType,{definition:t.definitions.get(e.for),baseInputProps:e.element.props})}))})).toMap()}return CompositeHandler.prototype.validate=function(e){var t=this;return d.FieldValue.isComposite(e)?d.CompositeValue.set(e,{fields:e.fields.map((function(e,n){var r=t.handlers.get(n);if(!r||0===r.length)return e;for(var i=e,a=0,o=r;a<o.length;a++){i=o[a].validate(i)}return d.FieldState.set(e,i)})).toMap()}):e},CompositeHandler.prototype.finalize=function(e,t){var n=this,r=this.finalizeSubject(e,t);return function zipImmutableMap(e){var t=e.map((function(e,t){return e.map((function(e){return{key:t,value:e}}))})).toArray();return t.length>0?o.zip(t).map((function(e){return a.Map().withMutations((function(t){for(var n=0,r=e;n<r.length;n++){var i=r[n],a=i.key,o=i.value;t.set(a,o)}}))})).toProperty():o.constant(a.Map())}(r.fields.map((function(e,t){var i=n.handlers.get(t);if(!i||0===i.length)return o.constant(e);for(var a=o.constant(e.values),_loop_1=function(e){a=a.flatMap((function(t){return e.finalize(t,r)})).toProperty()},u=0,s=i;u<s.length;u++){_loop_1(s[u])}return a.map((function(t){return d.FieldState.set(e,{values:t,errors:d.FieldError.noErrors})}))})).toMap()).map((function(e){return d.CompositeValue.set(r,{fields:e})}))},CompositeHandler.prototype.finalizeSubject=function(e,t){var n=d.FieldValue.isComposite(e)?e:createRawComposite(e),r=d.FieldValue.isComposite(t)?t.subject:void 0;return d.CompositeValue.set(n,{subject:c.generateSubjectByTemplate(this.newSubjectTemplate,r,n)})},CompositeHandler}();function createRawComposite(e,t,n){return void 0===t&&(t=a.Map()),void 0===n&&(n=d.FieldError.noErrors),{type:d.CompositeValue.type,subject:getSubject(e),definitions:t,fields:t.map(c.fieldInitialState).toMap(),errors:n}}function getSubject(e){if(d.FieldValue.isComposite(e))return e.subject;if(d.FieldValue.isAtomic(e)){var t=d.FieldValue.asRdfNode(e);if(t.isIri())return t}return s.Rdf.iri("")}v.SingleValueInput.assertStatic(g),t.default=g},1825:function(e,t,n){Object.defineProperty(t,"__esModule",{value:!0});var r=n(11),i=n(217),a=n(43),o=n(19),u=n(142),s=n(16),l=n(23),p=n(61),d=n(1553),f=n(1945),c=n(1689);function generateSubjectByTemplate(e,t,n,r){if(void 0===r&&(r=makeDefaultSubjectReplacer()),n&&!d.CompositeValue.isPlaceholder(n.subject))return n.subject;var i=(e||"{{UUID}}").replace(/{{([^{}]+)}}/g,(function(e,t){var i;return i="UUID"===t?{type:"UUID"}:t.startsWith("FIELD_VALUE_LOCAL_NAME")?{type:"FIELD_VALUE_LOCAL_NAME",id:t.replace("FIELD_VALUE_LOCAL_NAME","").trim()}:{type:"FieldValue",id:t},r(i,n)}));if(u(i).scheme())return l.Rdf.iri(i);var a=t?t.value:p.SparqlUtil.RegisteredPrefixes.Default,o=u.joinPaths(a,i).toString();return l.Rdf.iri(u(a).pathname(o).toString())}function makeDefaultSubjectReplacer(){return function(e,t){if("UUID"===e.type)return i.v4();if(t&&("FieldValue"===e.type||"FIELD_VALUE_LOCAL_NAME"===e.type)&&t.definitions.has(e.id)){var n=t.fields.get(e.id),r=(n?n.values.first():void 0)||d.FieldValue.empty,a=d.FieldValue.isAtomic(r)?r.value.value:"";return"FIELD_VALUE_LOCAL_NAME"===e.type&&a?l.Rdf.getLocalName(a):encodeIri(a)}return""}}function setSizeAndFill(e,t,n){var i=r.__spreadArrays(e);i.length=t;for(var a=e.length;a<t;a++)i[a]=n;return i}function lookForDefaultValues(e,t){var n=t.element.props,r=n.defaultValue,i=n.defaultValues,a=n.forceDefaults;if(r||i){if((u=(r?[r]:i).map((function(t){return parseDefaultValue(t,e,a)}))).length>0)return o.zip(u).toProperty()}else if(e.defaultValues.length>0){var u=e.defaultValues.map((function(t){return parseDefaultValue(t,e,a)}));return o.zip(u).toProperty()}return o.constant([])}function parseDefaultValue(e,t,n){var r=function createDefaultValue(e,t,n){if(!t.xsdDatatype)return d.FieldValue.fromLabeled({value:l.Rdf.literal(e),isForcedDefault:n});if(l.XsdDataTypeValidation.sameXsdDatatype(t.xsdDatatype,l.vocabularies.xsd.anyURI))return d.FieldValue.fromLabeled({value:l.Rdf.iri(e),isForcedDefault:n});var r=l.Rdf.literal(e,t.xsdDatatype),i=l.XsdDataTypeValidation.validate(r),a=i.success,o=i.message;return a?d.FieldValue.fromLabeled({value:r,isForcedDefault:n}):d.AtomicValue.set(d.FieldValue.fromLabeled({value:r}),{errors:d.FieldError.noErrors.push({kind:d.ErrorKind.Loading,message:"Default value doesn't match XSD datatype: "+o})})}(e,t,n);return c.restoreLabel(r)}function formatError(e){return"string"==typeof e?e:e&&"string"==typeof e.message?e.message:e&&"number"==typeof e.status?"query error":"unknown error occured"}t.generateSubjectByTemplate=generateSubjectByTemplate,t.wasIriGeneratedByTemplate=function wasIriGeneratedByTemplate(e,t,n,r){var a=makeDefaultSubjectReplacer(),o={UUID:i.v4(),FieldValue:void 0,FIELD_VALUE_LOCAL_NAME:void 0},u=generateSubjectByTemplate(t,n,r,(function(e,t){var n=o[e.type];return n||a(e,t)})),l=s.escapeRegExp(u.value).replace(s.escapeRegExp(o.UUID),"[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}");return new RegExp(l).test(e)},t.makeDefaultSubjectReplacer=makeDefaultSubjectReplacer,t.readyToSubmit=function readyToSubmit(e,t){var freeOfErrors=function(e){return e.every((function(e){return!t(e)}))};return freeOfErrors(e.errors)&&e.fields.every((function(e){return freeOfErrors(e.errors)&&e.values.every((function(e){return d.FieldValue.isComposite(e)?readyToSubmit(e,t):freeOfErrors(d.FieldValue.getErrors(e))}))}))},t.loadDefaults=function loadDefaults(e,t){var n=e.definitions.map((function(n){var r=t.get(n.id),i=r&&r.length>0?r[0]:void 0;return function loadInitialOrDefaultValues(e,t,n){var r=d.CompositeValue.isPlaceholder(e),i=!r&&t.selectPattern,a=r&&n;return(i?function fetchInitialValues(e,t,n){return c.queryValues(e.selectPattern,t).map((function(t){var n=t.map((function(e){return d.FieldValue.fromLabeled(e)}));return n=setSizeAndFill(n,Math.max(e.minOccurs,n.length),d.FieldValue.empty)}))}(t,e).flatMap((function(e){return s.isEmpty(e)&&n.element.props.forceDefaults?lookForDefaultValues(t,n):o.constant(e)})).toProperty():a?lookForDefaultValues(t,n):o.constant([])).map((function(e){var r=Math.max(e.length,t.minOccurs);return f.FieldMapping.isComposite(n)||(r=Math.max(r,1)),setSizeAndFill(e,r,d.FieldValue.empty)}))}(e.subject,n,i).map((function(e){return{def:n,values:a.List(e)}})).flatMapErrors((function(e){return o.constant({def:n,error:"Failed to load initial values: "+formatError(e)})}))})).toArray();return 0===n.length?function noChanges(){return o.later(0,(function(e){return e}))}():o.zip(n).map((function(e){return function(t){return function(e,t){return d.CompositeValue.set(e,{fields:e.fields.withMutations((function(e){for(var n=0,r=t;n<r.length;n++){var i=r[n],a=i.def,o=i.values,u=i.error,s=e.get(a.id);o&&o.size>0?s=d.FieldState.set(s,{values:o}):u&&(s=d.FieldState.set(s,{errors:s.errors.push({kind:d.ErrorKind.Loading,message:u})})),e.set(a.id,s)}}))})}(t,e)}}))},t.tryBeginValidation=function tryBeginValidation(e,t,n){if(e.constraints&&0!==e.constraints.length){var r=t.fields.get(e.id,d.FieldState.empty).values,i=n.fields.get(e.id,d.FieldState.empty).values,u=i.map((function(t,i){var a=i<r.size?r.get(i):null;return c.validate(n.subject,e,a,t)}));return o.zip(u.toArray()).map((function(t){return function(n){var r=n.fields.get(e.id);if(!a.is(r.values,i))return n;var o=n.fields.update(e.id,(function(e){return d.FieldState.set(e,{values:a.List(t)})}));return d.CompositeValue.set(n,{fields:o})}}))}},t.fieldInitialState=function fieldInitialState(e){var t=Math.min(e.minOccurs,e.maxOccurs),n=a.List().setSize(t).map((function(){return d.FieldValue.empty}));return d.FieldState.set(d.FieldState.empty,{values:n})};var v=/[\u0000-\u0020<>:?*"|/\\&$@=+,#\u007f-\u00ff%\s]/gi,m=/_+/gi;function encodeIri(e){var t=e;return t=(t=t.replace(v,"_")).replace(m,"_")}t.encodeIri=encodeIri},1945:function(e,t,n){Object.defineProperty(t,"__esModule",{value:!0});var r,i=n(11),a=n(1),o=n(43),u=n(61),s=n(214),l=n(1553),p=n(2226),d=n(1620),f=n(1688);function mapChildToComponent(e){if(s.isValidChild(e)){var t=e;if(d.elementIsSingleValueInput(t)){var n=t.type;return{for:t.props.for,inputType:p.CardinalitySupport,singleValueInputType:n,element:a.createElement(p.CardinalitySupport,i.__assign(i.__assign({},t.props),{children:t}))}}if(d.elementHasInputType(t,d.InputKind.MultiValuesInput)){var r=t.type;return{for:t.props.for,inputType:r,element:t}}if(d.elementHasInputType(t,d.InputKind.StaticInput)){var o=t.type;return{for:t.props.for,staticType:o,element:t}}return t.props.children?{child:e,children:t.props.children}:void 0}}function collectDefinitionErrors(e,t){function store(n,r){r instanceof c&&t.push({kind:l.ErrorKind.Configuration,message:"Invalid "+n+" of field '"+e.id+"': "+r.message})}e.selectPattern&&store("selectPattern",validateQueryPattern(e.selectPattern,"SELECT")),e.valueSetPattern&&store("valueSetPattern",validateQueryPattern(e.valueSetPattern,"SELECT")),e.deletePattern&&store("deletePattern",function validateDeletePattern(e){var t=parseQuery(e);if(t instanceof c)return t;if("update"!==t.type)return new c("should be DELETE query but was: '"+t.type+"'");for(var n=0,r=t.updates;n<r.length;n++){var i=r[n];if(!(u.SparqlTypeGuards.isInsertDeleteOperation(i)&&"insertdelete"===i.updateType&&0===i.insert.length))return new c("query should include only DELETE WHERE operations")}return}(e.deletePattern)),e.insertPattern&&store("insertPattern",function validateInsertPattern(e){var t=parseQuery(e);if(t instanceof c)return t;if("update"!==t.type)return new c("should be INSERT query but was: '"+t.type+"'");for(var n=0,r=t.updates;n<r.length;n++){var i=r[n];if(!(u.SparqlTypeGuards.isInsertDeleteOperation(i)&&"insertdelete"===i.updateType&&0===i.delete.length))return new c("query should include only INSERT WHERE operations")}return}(e.insertPattern)),e.autosuggestionPattern&&store("autosuggestionPattern",validateQueryPattern(e.autosuggestionPattern,"SELECT"));for(var n=0,r=e.constraints;n<r.length;n++){store("askPattern",validateQueryPattern(r[n].validatePattern,"ASK"))}}function validateQueryPattern(e,t){var n=parseQuery(e);return n instanceof c?n:"query"!==n.type?new c("should be "+t+" query but was: '"+n.type+"'"):n.queryType!==t?new c("should be "+t+" query but was: '"+n.queryType+"'"):void 0}function parseQuery(e){try{return u.SparqlUtil.parseQuery(e)}catch(e){return new c(e.message)}}!function(e){function isInput(e){return"inputType"in e}e.isInput=isInput,e.isComposite=function isComposite(e){return isInput(e)&&d.componentHasInputType(e.singleValueInputType,d.InputKind.CompositeInput)},e.isStatic=function isStatic(e){return"staticType"in e},e.isOtherElement=function isOtherElement(e){return"child"in e&&"children"in e},e.assertNever=function assertNever(e){throw console.error("Invalid mapping",e),new Error("Invalid mapping")}}(r=t.FieldMapping||(t.FieldMapping={})),t.mapChildToComponent=mapChildToComponent,t.validateFieldConfiguration=function validateFieldConfiguration(e,t){var n=o.Map().asMutable(),u=[];return function collectFieldConfiguration(e,t,n,o){return a.Children.forEach(t,(function(t){var a=mapChildToComponent(t);if(a)if(r.isInput(a))if(a.for){e.get(a.for)||o.push({kind:l.ErrorKind.Configuration,message:"Field definition '"+a.for+"' not found"});var u=n.get(a.for);n.set(a.for,u?i.__spreadArrays(u,[a]):[a])}else o.push({kind:l.ErrorKind.Configuration,message:"Missing 'for' attribute on "+s.componentDisplayName(t)});else if(r.isStatic(a)){if(a.for)e.get(a.for)||o.push({kind:l.ErrorKind.Configuration,message:"Field definition '"+a.for+"' not found"})}else r.isOtherElement(a)?collectFieldConfiguration(e,a.children,n,o):r.assertNever(a)}))}(e,t,n,u),n.forEach((function(t,n){var r=e.get(n);r&&collectDefinitionErrors(r,u)})),{inputs:n.asImmutable(),errors:o.List(u)}},t.renderFields=function renderFields(e,t,n,o,u,p){var d=new Map;function mapChild(e){var s=mapChildToComponent(e);if(s){if(r.isInput(s)){if(!s.for)return null;var c=t.definitions.get(s.for);if(!c)return null;var v=t.fields.get(s.for,l.FieldState.empty),m=d.get(s.for)||0;d.set(s.for,m+1);var h=n.get(s.for);if(m>=h.length)throw new Error("Missing handler for field "+s.for+" (at index "+m+")");var y=h[m],g={definition:c,handler:y,dataState:o(s.for),values:v.values,errors:v.errors,updateValues:function(e){return u(c,e)}},S=i.__assign(i.__assign({},g),{ref:function(e){p(s.for,m,e)}});return a.createElement(f.InputDecorator,i.__assign(i.__assign({},s.element.props),g),a.cloneElement(s.element,S))}if(r.isStatic(s)){var C=s.element,I={model:t};if(C.props.for){var V=t.definitions.get(C.props.for);if(!V)return null;I.definition=V}return a.cloneElement(s.element,I)}if(r.isOtherElement(s)){var E=mapChildren(s.children);return a.cloneElement(s.child,{},E)}throw new Error("Invalid mapping")}return e}function mapChildren(e){return s.universalChildren(a.Children.map(e,mapChild))}return mapChildren(e)},t.collectDefinitionErrors=collectDefinitionErrors;var c=function c(e){this.message=e}},2226:function(e,t,n){Object.defineProperty(t,"__esModule",{value:!0});var r=n(11),i=n(16),a=n(43),o=n(19),u=n(1),s=n(35),l=n(7),p=n(72),d=n(214),f=n(1208),c=n(1553),v=n(1619),m=n(1631),h=n(1620),y="cardinality-support",g=function(e){function CardinalitySupport(){var t=null!==e&&e.apply(this,arguments)||this;return t.valueKeys=[],t.inputs=new Map,t.addNewValue=function(){t.onValuesChanged((function(){return t.props.values.push(c.FieldValue.empty)}))},t.removeValue=function(e){t.valueKeys.splice(e,1),t.onValuesChanged((function(){return t.props.values.remove(e)}))},t}return r.__extends(CardinalitySupport,e),CardinalitySupport.prototype.getHandler=function(){var e=this.props.handler;if(!(e instanceof S))throw new Error("Invalid value handler for CardinalitySupport");return e},CardinalitySupport.prototype.shouldComponentUpdate=function(e,t){if(this.state!==t)return!0;var n=this.props;return!(this.dataState()===this.lastRenderedDataState&&n.renderHeader===e.renderHeader&&n.definition===e.definition&&n.dataState===e.dataState&&n.errors===e.errors&&(n.values===e.values||n.values.size===e.values.size&&n.values.every((function(t,n){return t===e.values.get(n)}))))},CardinalitySupport.prototype.render=function(){var e,t=this.props.definition;if(0===t.maxOccurs)return s.div({});var n=this.props.dataState;this.lastRenderedDataState=this.dataState();var r=this.props.values.size,i=n===c.DataState.Ready||n===c.DataState.Verifying,a=i&&r<t.maxOccurs,o=i&&r>t.minOccurs&&r>0,u=(this.props.label||f.getPreferredLabel(t.label)||"value").toLowerCase();return s.div({className:y},this.renderChildren(o),a?s.a({className:l((e={},e[y+"__add-value"]=!0,e[y+"__add-value--first"]=0===r,e[y+"__add-value--another"]=r>0,e)),onClick:this.addNewValue},"+ Add "+u):null)},CardinalitySupport.prototype.renderChildren=function(e){var t=this;this.ensureValueKeys(this.props.values.size);var n=function isInputGroup(e){var t=u.Children.count(e);if(1!==t)return t>1;var n=u.Children.toArray(e)[0];if(!d.isValidChild(n))return!0;return h.elementHasInputType(n,h.InputKind.CompositeInput)||h.elementHasInputType(n,h.InputKind.FormSwitch)||!h.elementIsSingleValueInput(n)}(this.props.children),r=!1===this.props.renderHeader&&1===this.props.definition.minOccurs&&1===this.props.definition.maxOccurs,i=n&&!r?y+"__group-instance":y+"__single-instance";return this.props.values.map((function(n,r){return s.div({key:t.valueKeys[r],className:i},function renderChildInputs(e,t,n,r,i,a){var o=0;return function mapChildren(s){return d.universalChildren(u.Children.map(s,(function(s){if(d.isValidChild(s)){var l=s;if(h.elementIsSingleValueInput(l)){var p=o;if(o++,p>t.handlers.length)throw new Error("Missing handler for cardinality field "+e.for+" at index "+p);var f=t.handlers[p],c={for:e.for,handler:f,definition:e.definition,dataState:e.dataState,value:n,updateValue:i,ref:function(e){return a(r,p,e)}};return u.cloneElement(l,c)}if(l.props.children)return u.cloneElement(l,{},mapChildren(l.props.children))}return s})))}(e.children)}(t.props,t.getHandler(),n,t.valueKeys[r],(function(e){t.onValuesChanged((function(t){return t.update(r,e)}))}),(function(e,n,r){var i=t.inputs.get(e);i||(i=[],t.inputs.set(e,i)),i[n]=r})),e?u.createElement(p.Button,{className:y+"__remove-value",onClick:function(){return t.removeValue(r)}},s.span({className:"fa fa-times"})):void 0)}))},CardinalitySupport.prototype.ensureValueKeys=function(e){for(;this.valueKeys.length<e;)this.valueKeys.push(i.uniqueId())},CardinalitySupport.prototype.onValuesChanged=function(e){var t=this.getHandler();this.props.updateValues((function(n){var r=e(n.values);return t.validate({values:r,errors:n.errors},!1)}))},CardinalitySupport.prototype.dataState=function(){for(var e=c.DataState.Ready,t=0,n=this.valueKeys;t<n.length;t++){var r=n[t],i=this.inputs.get(r);if(i)for(var a=0,o=i;a<o.length;a++){var u=o[a];u&&(e=c.mergeDataState(e,u.dataState()))}else e=c.mergeDataState(e,c.DataState.Loading)}return e},CardinalitySupport.makeHandler=function(e){return new S(e)},CardinalitySupport}(m.MultipleValuesInput);t.CardinalitySupport=g;var S=function(){function CardinalitySupportHandler(e){var t=this;this.validateThoughChildInputs=function(e){if(c.FieldValue.isEmpty(e))return e;for(var n=c.FieldValue.setErrors(e,c.FieldError.noErrors),r=0,i=t.handlers;r<i.length;r++){n=i[r].validate(n)}return n},this.definition=e.definition,this.handlers=function findInputs(e){var t=[];return function collectInputs(e){u.Children.forEach(e,(function(e){if(d.isValidChild(e)){var n=e;h.elementIsSingleValueInput(n)?t.push(n):n.props.children&&collectInputs(n.props.children)}}))}(e),t}(e.baseInputProps.children).map((function(e){return v.SingleValueInput.getHandlerOrDefault(e.type,{definition:t.definition,baseInputProps:e.props})}))}return CardinalitySupportHandler.prototype.validate=function(e,t){var n=e.values;void 0===t&&(t=!0);var r=e.errors.filter((function(e){return e.kind!==c.ErrorKind.Input})).toList(),i=this.validateCardinality(n);return{values:t?n.map(this.validateThoughChildInputs):n,errors:r.concat(i)}},CardinalitySupportHandler.prototype.validateCardinality=function(e){for(var t=e,_loop_1=function(n){n.finalizeSubject&&(t=e.map((function(e){return c.FieldValue.isComposite(e)?n.finalizeSubject(c.FieldValue.empty,e):e})))},n=0,r=this.handlers;n<r.length;n++){_loop_1(r[n])}return m.checkCardinalityAndDuplicates(t,this.definition)},CardinalitySupportHandler.prototype.finalize=function(e,t){for(var n=o.constant(e),_loop_2=function(e){n=n.flatMap((function(n){var r=n.map((function(n){return e.finalize(n,t)})).toArray();return r.length>0?o.zip(r).map((function(e){return a.List(e)})).toProperty():o.constant(a.List())})).toProperty()},r=0,i=this.handlers;r<i.length;r++){_loop_2(i[r])}return n},CardinalitySupportHandler}();m.MultipleValuesInput.assertStatic(g),t.default=g}}]);
//# sourceMappingURL=semantic-form-composite-input-44f9d43c6d26c02e1212.js.map