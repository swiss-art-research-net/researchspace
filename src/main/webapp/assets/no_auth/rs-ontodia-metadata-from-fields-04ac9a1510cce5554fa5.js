(window.webpackJsonp=window.webpackJsonp||[]).push([[462],{1530:function(e,r,t){Object.defineProperty(r,"__esModule",{value:!0});var a=t(11),i=t(43),n=t(1),l=t(23),s=t(61),o=t(1751),d=t(1987),u=t(1637),f=function(e){function MetadataFromFields(){return null!==e&&e.apply(this,arguments)||this}return a.__extends(MetadataFromFields,e),MetadataFromFields.prototype.render=function(){return null},MetadataFromFields.getRequiredFields=function(e,r){return a.__awaiter(this,void 0,Promise,(function(){var t,i,n,l,d,u,f;return a.__generator(this,(function(a){switch(a.label){case 0:return t=e.fieldsQuery,i=void 0===t?"PREFIX field: <http://www.researchspace.org/resource/system/fields/>\nSELECT REDUCED ?field WHERE {\n  ?field a field:Field\n}":t,[4,o.observableToCancellablePromise(s.SparqlClient.select(i,{context:{repository:"assets"}}),r)];case 1:for(n=a.sent().results,l=[],d=0,u=n.bindings;d<u.length;d++)(f=u[d].field)&&f.isIri()&&l.push(f);return[2,l]}}))}))},MetadataFromFields.configure=function(e,r){return a.__awaiter(this,void 0,Promise,(function(){var e,t,n,l,s,u,f,c,p,y,m,h,b,w;return a.__generator(this,(function(F){switch(F.label){case 0:if(e=r.fieldByIri,t=r.cancellationToken,!(n=e.get(r.typeIri)))throw new Error("<rs-metadata-from-fields>: missing type field <"+r.typeIri+">");if(!(l=e.get(r.defaultLabelIri)))throw new Error("<rs-metadata-from-fields>: missing label field <"+r.defaultLabelIri+">");return s=r.defaultImageIri?e.get(r.defaultImageIri):void 0,u=new Set,r.fieldByIri.forEach((function(e){if(e.domain)for(var r=0,t=e.domain;r<t.length;r++){var a=t[r];u.add(a.value)}})),[4,o.observableToCancellablePromise(queryAllRelatedTypes(u),t)];case 1:return f=F.sent(),c=Array.from(f),(p=new d.BaseTypeClosureRequest).addAll(c),[4,o.observableToCancellablePromise(p.query(),t)];case 2:for(y=F.sent(),m=function(t){if(r.collectedMetadata.has(t))return"continue";var o=[n,l];l&&o.push(s);var u=e.filter((function(e){return e.iri!==n.iri&&(e.iri!==l.iri&&((!s||e.iri!==s.iri)&&(!e.domain||d.hasCompatibleType(e.domain,[t],y))))})).sortBy((function(e){return e.iri})).sortBy((function(e){return e.order})).toArray(),f=a.__spreadArrays(o,u);r.collectedMetadata.set(t,{entityType:t,fields:f,fieldByIri:i.Map(f.map((function(e){return[e.iri,e]}))),typeField:n,newSubjectTemplate:r.defaultSubjectTemplate,labelField:l,imageField:s,datatypeFields:i.Set(r.datatypeFields),formChildren:void 0})},h=0,b=c;h<b.length;h++)w=b[h],m(w);return[2]}}))}))},MetadataFromFields}(n.Component);r.MetadataFromFields=f,u.assertFieldConfigurationItem(f);var c=s.SparqlUtil.parseQuerySync("\n  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>\n  SELECT REDUCED ?relatedType WHERE {\n    { ?type rdfs:subClassOf* ?relatedType }\n    UNION\n    { ?relatedType rdfs:subClassOf* ?type }\n  }");function queryAllRelatedTypes(e){var r=[];e.forEach((function(e){r.push({type:l.Rdf.iri(e)})}));var t=s.SparqlClient.prepareParsedQuery(r)(c);return s.SparqlClient.select(t).map((function(e){for(var r=e.results,t=new Set,a=0,i=r.bindings;a<i.length;a++){var n=i[a].relatedType;n&&n.isIri()&&t.add(n.value)}return t}))}r.default=f}}]);
//# sourceMappingURL=rs-ontodia-metadata-from-fields-04ac9a1510cce5554fa5.js.map