(window.webpackJsonp=window.webpackJsonp||[]).push([[164],{1824:function(e,t,r){Object.defineProperty(t,"__esModule",{value:!0});var n=r(11),a=r(10),i=r(217),u=r(16),c=r(33),o=r(23),s=r(61),A=r(1606),E=r(1630);function DEFAULT_QUERY_PATTERN(e){return e+" ?"+E.SEMANTIC_SEARCH_VARIABLES.RELATION_VAR+" ?"+E.SEMANTIC_SEARCH_VARIABLES.RESOURCE_VAR+" ."}var l="\n   ?"+E.SEMANTIC_SEARCH_VARIABLES.SET_VAR+" "+o.vocabularies.ldp.contains+"/"+o.vocabularies.VocabPlatform.setItem+" ?"+E.SEMANTIC_SEARCH_VARIABLES.RESOURCE_VAR+" .\n";function resourceDisjunct(e){var t;return(t={})[E.SEMANTIC_SEARCH_VARIABLES.RESOURCE_VAR]=e.value.iri,t}function setDisjunct(e){var t;return(t={})[E.SEMANTIC_SEARCH_VARIABLES.SET_VAR]=e.value.iri,t}function textDisjunct(e,t){var r=E.getConfigPatternForCategory(e,t.range.iri)||{};return function(e){var t,n=s.SparqlUtil.makeLuceneQuery(e.value,r.escapeLuceneSyntax,r.tokenizeLuceneQuery);return(t={})[E.SEMANTIC_SEARCH_VARIABLES.RESOURCE_VAR]=n,t}}function dateDisjunct(e){return function(t){var r;return(r={})[E.SEMANTIC_SEARCH_VARIABLES.DATE_BEGING_VAR]=createDateLiteral(t.value,e),r[E.SEMANTIC_SEARCH_VARIABLES.DATE_END_VAR]=createDateLiteral(t.value,e),r}}function dateRangeDisjunct(e){return function(t){var r;return(r={})[E.SEMANTIC_SEARCH_VARIABLES.DATE_BEGING_VAR]=createDateLiteral(t.value.begin,e),r[E.SEMANTIC_SEARCH_VARIABLES.DATE_END_VAR]=createDateLiteral(t.value.end,e),r}}function dateDeviationDisjunct(e){return function(t){var r,n=t.value,a=n.date,i=n.deviation;return(r={})[E.SEMANTIC_SEARCH_VARIABLES.DATE_BEGING_VAR]=createDateLiteral(a.clone().subtract(i,"days"),e),r[E.SEMANTIC_SEARCH_VARIABLES.DATE_END_VAR]=createDateLiteral(a.clone().add(i,"days"),e),r}}function yearDisjunct(e){return function(t){var r,n=t.value,i=n.year*("AD"===n.epoch?1:-1),u=a({year:i,month:0,day:1}),c=a({year:i,month:11,day:31});return(r={})[E.SEMANTIC_SEARCH_VARIABLES.DATE_BEGING_VAR]=createDateLiteral(u,e),r[E.SEMANTIC_SEARCH_VARIABLES.DATE_END_VAR]=createDateLiteral(c,e),r}}function yearRangeDisjunct(e){return function(t){var r,n=t.value,i=n.begin,u=n.end,c=i.year*("AD"===i.epoch?1:-1),o=a({year:c,month:0,day:1}),s=u.year*("AD"===u.epoch?1:-1),A=a({year:s,month:11,day:31});return(r={})[E.SEMANTIC_SEARCH_VARIABLES.DATE_BEGING_VAR]=createDateLiteral(o,e),r[E.SEMANTIC_SEARCH_VARIABLES.DATE_END_VAR]=createDateLiteral(A,e),r}}function yearDeviationDisjunct(e){return function(t){var r,n=t.value,i=n.year,u=n.deviation,c=i.year*("AD"===i.epoch?1:-1),o=a({year:c}),s=o.clone().startOf("year").subtract(u,"years"),A=o.clone().endOf("year").add(u,"years");return(r={})[E.SEMANTIC_SEARCH_VARIABLES.DATE_BEGING_VAR]=createDateLiteral(s,e),r[E.SEMANTIC_SEARCH_VARIABLES.DATE_END_VAR]=createDateLiteral(A,e),r}}function distanceDisjunct(e){return function(t){var r;return(r={})[E.SEMANTIC_SEARCH_VARIABLES.GEO_CENTER_VAR]=createGeoLiteral(t.value.center,e),r[E.SEMANTIC_SEARCH_VARIABLES.GEO_CENTER_LAT_VAR]=o.Rdf.literal(""+t.value.center.lat),r[E.SEMANTIC_SEARCH_VARIABLES.GEO_CENTER_LONG_VAR]=o.Rdf.literal(""+t.value.center.long),r[E.SEMANTIC_SEARCH_VARIABLES.GEO_DISTANCE_VAR]=o.Rdf.literal(t.value.distance),r}}function boundingBoxDisjunct(e){return function(t){var r;return(r={})[E.SEMANTIC_SEARCH_VARIABLES.GEO_SOUTH_WEST]=createGeoLiteral(t.value.southWest,e),r[E.SEMANTIC_SEARCH_VARIABLES.GEO_SOUTH_WEST_LAT]=o.Rdf.literal(""+t.value.southWest.lat),r[E.SEMANTIC_SEARCH_VARIABLES.GEO_SOUTH_WEST_LONG]=o.Rdf.literal(""+t.value.southWest.long),r[E.SEMANTIC_SEARCH_VARIABLES.GEO_NORTH_EAST]=createGeoLiteral(t.value.northEast,e),r[E.SEMANTIC_SEARCH_VARIABLES.GEO_NORTH_EAST_LAT]=o.Rdf.literal(""+t.value.northEast.lat),r[E.SEMANTIC_SEARCH_VARIABLES.GEO_NORTH_EAST_LONG]=o.Rdf.literal(""+t.value.northEast.long),r}}function literalDisjunct(e){var t;return(t={})[E.SEMANTIC_SEARCH_VARIABLES.LITERAL_VAR]=e.value.literal,t}function numericRangeDisjunct(e){return function(t){var r,n=o.Rdf.iri("http://www.w3.org/2001/XMLSchema#double");return"numeric-range"===e.kind&&e.datatype&&(n=o.Rdf.iri(e.datatype)),(r={})[E.SEMANTIC_SEARCH_VARIABLES.NUMERIC_RANGE_BEGIN_VAR]=o.Rdf.literal(""+t.value.begin,n),r[E.SEMANTIC_SEARCH_VARIABLES.NUMERIC_RANGE_END_VAR]=o.Rdf.literal(""+t.value.end,n),r}}function createDateLiteral(e,t){var r="YYYY-MM-DD",n=o.vocabularies.xsd.date;return"date-range"===t.kind&&(t.datatype&&(n=o.Rdf.iri(t.datatype)),t.format&&(r=t.format)),o.Rdf.literal(function fixZeroYearIssue(e){return 0===e.year()?e.subtract(1,"year"):e}(e).format(r),n)}function createGeoLiteral(e,t){var r,n=e.lat+"#"+e.long;return"place"===t.kind&&(t.format&&(n=t.format.replace("lat",e.lat.toString()).replace("long",e.long.toString())),t.datatype&&(r=o.Rdf.iri(t.datatype))),o.Rdf.literal(n,r)}function tryGetRelationPatterns(e,t,r){return void 0===r&&(r=t.hasRange),u.has(e.relations,t.iri.toString())?e.relations[t.iri.toString()]:u.has(e.categories,r.iri.toString())?e.categories[r.iri.toString()]:[]}function applySetPattern(e,t){return t+e}t.tryGetRelationPatterns=tryGetRelationPatterns;var _=function(e){function Randomizer(t,r){var n=e.call(this)||this;return n.variablesMap={},n.subjectVariable=t,n.rewriteSubjectVariable=r,n}return n.__extends(Randomizer,e),Randomizer.prototype.variableTerm=function(e){return e===this.subjectVariable?this.rewriteSubjectVariable?this.rewriteSubjectVariable:e:(u.has(this.variablesMap,e)||(this.variablesMap[e]=e+"_"+i.v4().replace(/-/g,"_")),this.variablesMap[e])},Randomizer}(s.QueryVisitor);function randomizeVariables(e,t,r){return new _(t,r).query(e),e}function disjunctToQueryPattern(e,t,r){return function(n){return function(a){return a.kind===A.EntityDisjunctKinds.Search?function complexDisjunctToQueryPattern(e,t,r,n,a){var i=function generateSelectQueryPattern(e,t,r){var n=conjunctsToQueryPatterns(t,e,r.domain,r.conjuncts);return{prefixes:{},type:"query",queryType:"SELECT",variables:[e],where:n}}(t,e,a.value);return nestedQueryPattern(e,t,r,i,n,a)}(e,t,r,n,a):a.kind===A.EntityDisjunctKinds.SavedSearch?nestedQueryPattern(e,t,r,a.value.query,n,a):function simpleDisjunctToQueryPattern(e,t,r,n,a){return randomizeVariables(simpleDisjunctPatternQuery(e,t,r,n,a),t).where[0]}(e,t,r,n,a)}}}function nestedQueryPattern(e,t,r,n,a,i){var u=simpleDisjunctPatternQuery(e,t,r,a,i),c=u.where;return c.unshift.apply(c,randomizeVariables(n,t,"?"+E.SEMANTIC_SEARCH_VARIABLES.RESOURCE_VAR).where),u.where=[{type:"group",patterns:c}],randomizeVariables(u,t).where[0]}function simpleDisjunctPatternQuery(e,t,r,n,a){var i,c=function getMatchingPatternConfig(e,t,r,n){var a=r.range;return A.matchConjunct({Relation:function(r){var i=r.relation,c=tryGetRelationPatterns(e,i,a);if(0===c.length)return A.isSetDisjunct(n)?{kind:"set",queryPattern:applySetPattern(DEFAULT_QUERY_PATTERN(t),l)}:{kind:"resource",queryPattern:DEFAULT_QUERY_PATTERN(t)};if(A.isTemporalDisjunct(n))return u.find(c,(function(e){return"date-range"===e.kind}));if(A.isSpatialDisjunct(n))return u.find(c,(function(e){return"place"===e.kind}));var o=u.find(c,(function(e){return"hierarchy"===e.kind})),s=u.find(c,(function(e){return"resource"===e.kind})),E=u.find(c,(function(e){return"set"===e.kind})),_=u.find(c,(function(e){return"literal"===e.kind})),R=u.find(c,(function(e){return"numeric-range"===e.kind}));return A.isSetDisjunct(n)?o?{kind:"set",queryPattern:applySetPattern(o.queryPattern,E?E.queryPattern:l)}:s?{kind:"set",queryPattern:applySetPattern(s.queryPattern,E?E.queryPattern:l)}:{kind:"set",queryPattern:applySetPattern(DEFAULT_QUERY_PATTERN(t),l)}:o||(s||(_||(R||{kind:"resource",queryPattern:DEFAULT_QUERY_PATTERN(t)})))},Text:function(){return E.getConfigPatternForCategory(e,a.iri)}})(r)}(e,t,n,a);"place"===c.kind?a.kind===A.SpatialDisjunctKinds.Distance?i=c.distanceQueryPattern:a.kind===A.SpatialDisjunctKinds.BoundingBox&&(i=c.boundingBoxQueryPattern):i=c.queryPattern;var o=function parseQueryPattern(e,t){return rewriteProjectionVariable(s.SparqlUtil.parseQuerySync("SELECT * {{ "+e+" }}"),t)}(i,t),_=u.assign(function getGenericVariables(e,t){return A.matchConjunct({Relation:function(t){var r;return(r={})[E.SEMANTIC_SEARCH_VARIABLES.DOMAIN_VAR]=e.iri,r[E.SEMANTIC_SEARCH_VARIABLES.RANGE_VAR]=t.range.iri,r[E.SEMANTIC_SEARCH_VARIABLES.RELATION_VAR]=t.relation.iri,r},Text:function(){var t;return(t={})[E.SEMANTIC_SEARCH_VARIABLES.DOMAIN_VAR]=e.iri,t}})(t)}(r,n),function disjunctToVariables(e,t,r){return A.matchDisjunct({Resource:resourceDisjunct,Set:setDisjunct,Search:function(){return{}},SavedSearch:function(){return{}},Date:dateDisjunct(t),DateRange:dateRangeDisjunct(t),DateDeviation:dateDeviationDisjunct(t),Year:yearDisjunct(t),YearRange:yearRangeDisjunct(t),YearDeviation:yearDeviationDisjunct(t),Text:textDisjunct(e,r),Distance:distanceDisjunct(t),BoundingBox:boundingBoxDisjunct(t),Literal:literalDisjunct,NumericRange:numericRangeDisjunct(t)})}(e,c,n)(a));return s.SparqlClient.setBindings(o,_)}function conjunctToQueryPattern(e,t,r){return function(n){var a=u.map(n.disjuncts,disjunctToQueryPattern(e,t,r)(n)),i=u.map(a,(function(e){return s.SparqlTypeGuards.isBlockPattern(e)&&1===e.patterns.length?e.patterns[0]:e}));return 1===i.length?i[0]:{type:"union",patterns:i}}}function conjunctsToQueryPatterns(e,t,r,n){var a=u.map(n,conjunctToQueryPattern(e,t,r));return u.flatten(u.map(a,(function(e){return s.SparqlTypeGuards.isGroupPattern(e)?e.patterns:e})))}function rewriteProjectionVariable(e,t){var r=s.cloneQuery(e);return(new(function(e){function class_1(){return null!==e&&e.apply(this,arguments)||this}return n.__extends(class_1,e),class_1.prototype.variableTerm=function(e){if(e.substring(1)===E.SEMANTIC_SEARCH_VARIABLES.PROJECTION_ALIAS_VAR)return t},class_1}(s.QueryVisitor))).query(r),r}function generateFederatedQueryPatterns(e,t,r){var n=t.map((function(t){return function generatePatternForDataset(e,t,r){return r&&r.federated?void 0===e.iri&&void 0===e.id?{type:"group",patterns:t}:function wrapIntoService(e,t,r){void 0===r&&(r=!1);return{type:"service",name:t,silent:r,patterns:e}}(t,e.iri.value,e.silent):function generateNonFederatedPatternForDataset(e,t,r){var n=c.fromNullable(r).chain((function(e){return c.fromNullable(e.datasetPattern)})).getOrElse("\n  GRAPH ?__dataset__ {\n    ?subject a ?t .\n  }\n"),a=s.SparqlUtil.parsePatterns(n).concat(t);return{type:"group",patterns:s.SparqlClient.setBindings({prefixes:{},type:"query",queryType:"SELECT",variables:["*"],where:a},{__dataset__:e.iri}).where}}(e,t,r)}(t,e,r)}));return n.length>1?[{type:"union",patterns:u.clone(n)}]:1===n.length?n:e}t.disjunctToQueryPattern=disjunctToQueryPattern,t.conjunctToQueryPattern=conjunctToQueryPattern,t.conjunctsToQueryPatterns=conjunctsToQueryPatterns,t.rewriteProjectionVariable=rewriteProjectionVariable,t.generateSelectQuery=function generateSelectQuery(e,t,r){var n="?"+t;return{prefixes:{},type:"query",queryType:"SELECT",distinct:!0,variables:[n],where:conjunctsToQueryPatterns(e,n,r.domain,r.conjuncts),limit:e.limit}},t.blazegraphNoOptimizePattern=function blazegraphNoOptimizePattern(){return{type:"bgp",triples:[{subject:"http://www.bigdata.com/queryHints#Query",predicate:"http://www.bigdata.com/queryHints#optimizer",object:'"None"'}]}},t.generateQueryForMultipleDatasets=function generateQueryForMultipleDatasets(e,t,r){void 0===t&&(t=[]);var a=generateFederatedQueryPatterns(e.where,t,r);return n.__assign(n.__assign({},e),{where:a})},t.generateFederatedQueryPatterns=generateFederatedQueryPatterns}}]);
//# sourceMappingURL=default~semantic-search-facet~semantic-search-query-builder~semantic-search-result-2c75b20098e2ad246458.js.map