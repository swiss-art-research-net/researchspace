(window.webpackJsonp=window.webpackJsonp||[]).push([[100],{3174:function(t,e,i){var n=i(3175),o=i(334);n.NamedNode=function(t){this.interfaceName="NamedNode",this.nominalValue=t},n.NamedNode.prototype.equals=function(t){if("string"==typeof t)return this.nominalValue===t;if("object"==typeof t){if("RegExp"===t.constructor.name)return t.test(this.nominalValue);if(t.interfaceName===this.interfaceName)return this.nominalValue===t.nominalValue}return!1},n.NamedNode.prototype.toNT=function(){return"<"+n.encodeString(this.nominalValue)+">"},n.NamedNode.prototype.toString=function(){return this.nominalValue},n.NamedNode.prototype.valueOf=function(){return this.nominalValue},n.BlankNode=function(){this.interfaceName="BlankNode",this.nominalValue="b"+ ++n.BlankNode.nextId},n.BlankNode.prototype.equals=function(t){if("string"==typeof t)return this.nominalValue===t;if("object"==typeof t){if("RegExp"===t.constructor.name)return t.test(this.nominalValue);if(t.interfaceName===this.interfaceName)return this.nominalValue===t.nominalValue}return!1},n.BlankNode.prototype.toNT=function(){return"_:"+n.encodeString(this.nominalValue)},n.BlankNode.prototype.toString=function(){return"_:"+this.nominalValue},n.BlankNode.prototype.valueOf=function(){return this.nominalValue},n.BlankNode.nextId=0,n.Literal=function(t,e,i,o){this.interfaceName="Literal",this.nominalValue=t,e?(this.language=e,this.datatype=n.Literal.langString):(this.language=null,this.datatype=i?new n.NamedNode(i.toString()):n.Literal.string),this.native=o},n.Literal.prototype.equals=function(t){if("string"==typeof t)return this.nominalValue===t;if("object"==typeof t){if("RegExp"===t.constructor.name)return t.test(this.nominalValue);if(t.interfaceName===this.interfaceName)return this.nominalValue.toString()===t.nominalValue.toString()&&(this.language===t.language&&!(this.datatype&&!this.datatype.equals(t.datatype)))}return!1},n.Literal.prototype.toNT=function(){var t='"'+n.encodeString(this.nominalValue.toString())+'"';return this.language&&(t+="@"+this.language),!this.datatype||n.Literal.string.equals(this.datatype)||n.Literal.langString.equals(this.datatype)||(t+="^^"+this.datatype.toNT()),t},n.Literal.prototype.toString=function(){return this.nominalValue},n.Literal.langString=new n.NamedNode("http://www.w3.org/1999/02/22-rdf-syntax-ns#langString"),n.Literal.string=new n.NamedNode("http://www.w3.org/2001/XMLSchema#string"),n.Triple=function(t,e,i){this.subject=t,this.predicate=e,this.object=i},n.Triple.prototype.equals=function(t){return this.subject.equals(t.subject)&&this.predicate.equals(t.predicate)&&this.object.equals(t.object)},n.Triple.prototype.toNT=function(){return this.toString()},n.Triple.prototype.toQuad=function(t){return new n.Quad(this.subject,this.predicate,this.object,t)},n.Triple.prototype.toString=function(){return this.subject.toNT()+" "+this.predicate.toNT()+" "+this.object.toNT()+" ."},n.Quad=function(t,e,i,n){this.subject=t,this.predicate=e,this.object=i,this.graph=n},n.Quad.prototype.equals=function(t){return this.subject.equals(t.subject)&&this.predicate.equals(t.predicate)&&this.object.equals(t.object)&&this.graph.equals(t.graph)},n.Quad.prototype.toNT=function(){return this.toString()},n.Quad.prototype.toString=function(){return this.subject.toNT()+" "+this.predicate.toNT()+" "+this.object.toNT()+" "+this.graph.toNT()+" ."},n.Quad.prototype.toTriple=function(){return new n.Triple(this.subject,this.predicate,this.object)},n.Graph=function(t){this.actions=[],this._graph=[],this._gspo={},n.AbstractGraph.call(this,n.Graph,t)},o.inherits(n.Graph,n.AbstractGraph),n.Graph.prototype.add=function(t){var e=n.Graph.index(t);return this._gspo[e.g]=this._gspo[e.g]||{},this._gspo[e.g][e.s]=this._gspo[e.g][e.s]||{},this._gspo[e.g][e.s][e.p]=this._gspo[e.g][e.s][e.p]||{},this._gspo[e.g][e.s][e.p][e.o]||(this._gspo[e.g][e.s][e.p][e.o]=t,this._graph.push(t),this.actions.forEach((function(e){e.run(t)}))),this},n.Graph.prototype.addAction=function(t){},n.Graph.prototype.remove=function(t){var e=n.Graph.index(t);this._gspo[e.g][e.s][e.p][e.o]&&(delete this._gspo[e.g][e.s][e.p][e.o],this._graph.splice(this._graph.indexOf(t),1))},n.Graph.prototype.toArray=function(){return this._graph.slice(0)},n.Graph.index=function(t){return{g:t.graph?t.graph.toString():null,s:t.subject.toString(),p:t.predicate.toString(),o:t.object.toString()}},t.exports=n}}]);
//# sourceMappingURL=npm.rdf-graph-array-d3a22681050aaa1cf12a.js.map