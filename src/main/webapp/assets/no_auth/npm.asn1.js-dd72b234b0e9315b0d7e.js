(window.webpackJsonp=window.webpackJsonp||[]).push([[66],{1746:function(e,t,r){var o=t;o.bignum=r(1563),o.define=r(3227).define,o.base=r(1747),o.constants=r(2302),o.decoders=r(3231),o.encoders=r(3233)},1747:function(e,t,r){var o=t;o.Reporter=r(3228).Reporter,o.DecoderBuffer=r(2301).DecoderBuffer,o.EncoderBuffer=r(2301).EncoderBuffer,o.Node=r(3229)},2301:function(e,t,r){var o=r(62),n=r(1747).Reporter,i=r(163).Buffer;function DecoderBuffer(e,t){n.call(this,t),i.isBuffer(e)?(this.base=e,this.offset=0,this.length=e.length):this.error("Input not Buffer")}function EncoderBuffer(e,t){if(Array.isArray(e))this.length=0,this.value=e.map((function(e){return e instanceof EncoderBuffer||(e=new EncoderBuffer(e,t)),this.length+=e.length,e}),this);else if("number"==typeof e){if(!(0<=e&&e<=255))return t.error("non-byte EncoderBuffer value");this.value=e,this.length=1}else if("string"==typeof e)this.value=e,this.length=i.byteLength(e);else{if(!i.isBuffer(e))return t.error("Unsupported type: "+typeof e);this.value=e,this.length=e.length}}o(DecoderBuffer,n),t.DecoderBuffer=DecoderBuffer,DecoderBuffer.prototype.save=function save(){return{offset:this.offset,reporter:n.prototype.save.call(this)}},DecoderBuffer.prototype.restore=function restore(e){var t=new DecoderBuffer(this.base);return t.offset=e.offset,t.length=this.offset,this.offset=e.offset,n.prototype.restore.call(this,e.reporter),t},DecoderBuffer.prototype.isEmpty=function isEmpty(){return this.offset===this.length},DecoderBuffer.prototype.readUInt8=function readUInt8(e){return this.offset+1<=this.length?this.base.readUInt8(this.offset++,!0):this.error(e||"DecoderBuffer overrun")},DecoderBuffer.prototype.skip=function skip(e,t){if(!(this.offset+e<=this.length))return this.error(t||"DecoderBuffer overrun");var r=new DecoderBuffer(this.base);return r._reporterState=this._reporterState,r.offset=this.offset,r.length=this.offset+e,this.offset+=e,r},DecoderBuffer.prototype.raw=function raw(e){return this.base.slice(e?e.offset:this.offset,this.length)},t.EncoderBuffer=EncoderBuffer,EncoderBuffer.prototype.join=function join(e,t){return e||(e=new i(this.length)),t||(t=0),0===this.length||(Array.isArray(this.value)?this.value.forEach((function(r){r.join(e,t),t+=r.length})):("number"==typeof this.value?e[t]=this.value:"string"==typeof this.value?e.write(this.value,t):i.isBuffer(this.value)&&this.value.copy(e,t),t+=this.length)),e}},2302:function(e,t,r){var o=t;o._reverse=function reverse(e){var t={};return Object.keys(e).forEach((function(r){(0|r)==r&&(r|=0);var o=e[r];t[o]=r})),t},o.der=r(3230)},2303:function(e,t,r){var o=r(62),n=r(1746),i=n.base,s=n.bignum,a=n.constants.der;function DERDecoder(e){this.enc="der",this.name=e.name,this.entity=e,this.tree=new DERNode,this.tree._init(e.body)}function DERNode(e){i.Node.call(this,"der",e)}function derDecodeTag(e,t){var r=e.readUInt8(t);if(e.isError(r))return r;var o=a.tagClass[r>>6],n=0==(32&r);if(31==(31&r)){var i=r;for(r=0;128==(128&i);){if(i=e.readUInt8(t),e.isError(i))return i;r<<=7,r|=127&i}}else r&=31;return{cls:o,primitive:n,tag:r,tagStr:a.tag[r]}}function derDecodeLen(e,t,r){var o=e.readUInt8(r);if(e.isError(o))return o;if(!t&&128===o)return null;if(0==(128&o))return o;var n=127&o;if(n>4)return e.error("length octect is too long");o=0;for(var i=0;i<n;i++){o<<=8;var s=e.readUInt8(r);if(e.isError(s))return s;o|=s}return o}e.exports=DERDecoder,DERDecoder.prototype.decode=function decode(e,t){return e instanceof i.DecoderBuffer||(e=new i.DecoderBuffer(e,t)),this.tree._decode(e,t)},o(DERNode,i.Node),DERNode.prototype._peekTag=function peekTag(e,t,r){if(e.isEmpty())return!1;var o=e.save(),n=derDecodeTag(e,'Failed to peek tag: "'+t+'"');return e.isError(n)?n:(e.restore(o),n.tag===t||n.tagStr===t||n.tagStr+"of"===t||r)},DERNode.prototype._decodeTag=function decodeTag(e,t,r){var o=derDecodeTag(e,'Failed to decode tag of "'+t+'"');if(e.isError(o))return o;var n=derDecodeLen(e,o.primitive,'Failed to get length of "'+t+'"');if(e.isError(n))return n;if(!r&&o.tag!==t&&o.tagStr!==t&&o.tagStr+"of"!==t)return e.error('Failed to match tag: "'+t+'"');if(o.primitive||null!==n)return e.skip(n,'Failed to match body of: "'+t+'"');var i=e.save(),s=this._skipUntilEnd(e,'Failed to skip indefinite length body: "'+this.tag+'"');return e.isError(s)?s:(n=e.offset-i.offset,e.restore(i),e.skip(n,'Failed to match body of: "'+t+'"'))},DERNode.prototype._skipUntilEnd=function skipUntilEnd(e,t){for(;;){var r=derDecodeTag(e,t);if(e.isError(r))return r;var o,n=derDecodeLen(e,r.primitive,t);if(e.isError(n))return n;if(o=r.primitive||null!==n?e.skip(n):this._skipUntilEnd(e,t),e.isError(o))return o;if("end"===r.tagStr)break}},DERNode.prototype._decodeList=function decodeList(e,t,r,o){for(var n=[];!e.isEmpty();){var i=this._peekTag(e,"end");if(e.isError(i))return i;var s=r.decode(e,"der",o);if(e.isError(s)&&i)break;n.push(s)}return n},DERNode.prototype._decodeStr=function decodeStr(e,t){if("bitstr"===t){var r=e.readUInt8();return e.isError(r)?r:{unused:r,data:e.raw()}}if("bmpstr"===t){var o=e.raw();if(o.length%2==1)return e.error("Decoding of string type: bmpstr length mismatch");for(var n="",i=0;i<o.length/2;i++)n+=String.fromCharCode(o.readUInt16BE(2*i));return n}if("numstr"===t){var s=e.raw().toString("ascii");return this._isNumstr(s)?s:e.error("Decoding of string type: numstr unsupported characters")}if("octstr"===t)return e.raw();if("objDesc"===t)return e.raw();if("printstr"===t){var a=e.raw().toString("ascii");return this._isPrintstr(a)?a:e.error("Decoding of string type: printstr unsupported characters")}return/str$/.test(t)?e.raw().toString():e.error("Decoding of string type: "+t+" unsupported")},DERNode.prototype._decodeObjid=function decodeObjid(e,t,r){for(var o,n=[],i=0;!e.isEmpty();){var s=e.readUInt8();i<<=7,i|=127&s,0==(128&s)&&(n.push(i),i=0)}128&s&&n.push(i);var a=n[0]/40|0,c=n[0]%40;if(o=r?n:[a,c].concat(n.slice(1)),t){var u=t[o.join(" ")];void 0===u&&(u=t[o.join(".")]),void 0!==u&&(o=u)}return o},DERNode.prototype._decodeTime=function decodeTime(e,t){var r=e.raw().toString();if("gentime"===t)var o=0|r.slice(0,4),n=0|r.slice(4,6),i=0|r.slice(6,8),s=0|r.slice(8,10),a=0|r.slice(10,12),c=0|r.slice(12,14);else{if("utctime"!==t)return e.error("Decoding "+t+" time is not supported yet");o=0|r.slice(0,2),n=0|r.slice(2,4),i=0|r.slice(4,6),s=0|r.slice(6,8),a=0|r.slice(8,10),c=0|r.slice(10,12);o=o<70?2e3+o:1900+o}return Date.UTC(o,n-1,i,s,a,c,0)},DERNode.prototype._decodeNull=function decodeNull(e){return null},DERNode.prototype._decodeBool=function decodeBool(e){var t=e.readUInt8();return e.isError(t)?t:0!==t},DERNode.prototype._decodeInt=function decodeInt(e,t){var r=e.raw(),o=new s(r);return t&&(o=t[o.toString(10)]||o),o},DERNode.prototype._use=function use(e,t){return"function"==typeof e&&(e=e(t)),e._getDecoder("der").tree}},2304:function(e,t,r){var o=r(62),n=r(163).Buffer,i=r(1746),s=i.base,a=i.constants.der;function DEREncoder(e){this.enc="der",this.name=e.name,this.entity=e,this.tree=new DERNode,this.tree._init(e.body)}function DERNode(e){s.Node.call(this,"der",e)}function two(e){return e<10?"0"+e:e}e.exports=DEREncoder,DEREncoder.prototype.encode=function encode(e,t){return this.tree._encode(e,t).join()},o(DERNode,s.Node),DERNode.prototype._encodeComposite=function encodeComposite(e,t,r,o){var i,s=function encodeTag(e,t,r,o){var n;"seqof"===e?e="seq":"setof"===e&&(e="set");if(a.tagByName.hasOwnProperty(e))n=a.tagByName[e];else{if("number"!=typeof e||(0|e)!==e)return o.error("Unknown tag: "+e);n=e}if(n>=31)return o.error("Multi-octet tag encoding unsupported");t||(n|=32);return n|=a.tagClassByName[r||"universal"]<<6}(e,t,r,this.reporter);if(o.length<128)return(i=new n(2))[0]=s,i[1]=o.length,this._createEncoderBuffer([i,o]);for(var c=1,u=o.length;u>=256;u>>=8)c++;(i=new n(2+c))[0]=s,i[1]=128|c;u=1+c;for(var d=o.length;d>0;u--,d>>=8)i[u]=255&d;return this._createEncoderBuffer([i,o])},DERNode.prototype._encodeStr=function encodeStr(e,t){if("bitstr"===t)return this._createEncoderBuffer([0|e.unused,e.data]);if("bmpstr"===t){for(var r=new n(2*e.length),o=0;o<e.length;o++)r.writeUInt16BE(e.charCodeAt(o),2*o);return this._createEncoderBuffer(r)}return"numstr"===t?this._isNumstr(e)?this._createEncoderBuffer(e):this.reporter.error("Encoding of string type: numstr supports only digits and space"):"printstr"===t?this._isPrintstr(e)?this._createEncoderBuffer(e):this.reporter.error("Encoding of string type: printstr supports only latin upper and lower case letters, digits, space, apostrophe, left and rigth parenthesis, plus sign, comma, hyphen, dot, slash, colon, equal sign, question mark"):/str$/.test(t)||"objDesc"===t?this._createEncoderBuffer(e):this.reporter.error("Encoding of string type: "+t+" unsupported")},DERNode.prototype._encodeObjid=function encodeObjid(e,t,r){if("string"==typeof e){if(!t)return this.reporter.error("string objid given, but no values map found");if(!t.hasOwnProperty(e))return this.reporter.error("objid not found in values map");e=t[e].split(/[\s\.]+/g);for(var o=0;o<e.length;o++)e[o]|=0}else if(Array.isArray(e)){e=e.slice();for(o=0;o<e.length;o++)e[o]|=0}if(!Array.isArray(e))return this.reporter.error("objid() should be either array or string, got: "+JSON.stringify(e));if(!r){if(e[1]>=40)return this.reporter.error("Second objid identifier OOB");e.splice(0,2,40*e[0]+e[1])}var i=0;for(o=0;o<e.length;o++){var s=e[o];for(i++;s>=128;s>>=7)i++}var a=new n(i),c=a.length-1;for(o=e.length-1;o>=0;o--){s=e[o];for(a[c--]=127&s;(s>>=7)>0;)a[c--]=128|127&s}return this._createEncoderBuffer(a)},DERNode.prototype._encodeTime=function encodeTime(e,t){var r,o=new Date(e);return"gentime"===t?r=[two(o.getFullYear()),two(o.getUTCMonth()+1),two(o.getUTCDate()),two(o.getUTCHours()),two(o.getUTCMinutes()),two(o.getUTCSeconds()),"Z"].join(""):"utctime"===t?r=[two(o.getFullYear()%100),two(o.getUTCMonth()+1),two(o.getUTCDate()),two(o.getUTCHours()),two(o.getUTCMinutes()),two(o.getUTCSeconds()),"Z"].join(""):this.reporter.error("Encoding "+t+" time is not supported yet"),this._encodeStr(r,"octstr")},DERNode.prototype._encodeNull=function encodeNull(){return this._createEncoderBuffer("")},DERNode.prototype._encodeInt=function encodeInt(e,t){if("string"==typeof e){if(!t)return this.reporter.error("String int or enum given, but no values map");if(!t.hasOwnProperty(e))return this.reporter.error("Values map doesn't contain: "+JSON.stringify(e));e=t[e]}if("number"!=typeof e&&!n.isBuffer(e)){var r=e.toArray();!e.sign&&128&r[0]&&r.unshift(0),e=new n(r)}if(n.isBuffer(e)){var o=e.length;0===e.length&&o++;var i=new n(o);return e.copy(i),0===e.length&&(i[0]=0),this._createEncoderBuffer(i)}if(e<128)return this._createEncoderBuffer(e);if(e<256)return this._createEncoderBuffer([0,e]);o=1;for(var s=e;s>=256;s>>=8)o++;for(s=(i=new Array(o)).length-1;s>=0;s--)i[s]=255&e,e>>=8;return 128&i[0]&&i.unshift(0),this._createEncoderBuffer(new n(i))},DERNode.prototype._encodeBool=function encodeBool(e){return this._createEncoderBuffer(e?255:0)},DERNode.prototype._use=function use(e,t){return"function"==typeof e&&(e=e(t)),e._getEncoder("der").tree},DERNode.prototype._skipDefault=function skipDefault(e,t,r){var o,n=this._baseState;if(null===n.default)return!1;var i=e.join();if(void 0===n.defaultBuffer&&(n.defaultBuffer=this._encodeValue(n.default,t,r).join()),i.length!==n.defaultBuffer.length)return!1;for(o=0;o<i.length;o++)if(i[o]!==n.defaultBuffer[o])return!1;return!0}},3227:function(e,t,r){var o=r(1746),n=r(62);function Entity(e,t){this.name=e,this.body=t,this.decoders={},this.encoders={}}t.define=function define(e,t){return new Entity(e,t)},Entity.prototype._createNamed=function createNamed(e){var t;try{t=r(1456).runInThisContext("(function "+this.name+"(entity) {\n  this._initNamed(entity);\n})")}catch(e){t=function(e){this._initNamed(e)}}return n(t,e),t.prototype._initNamed=function initnamed(t){e.call(this,t)},new t(this)},Entity.prototype._getDecoder=function _getDecoder(e){return e=e||"der",this.decoders.hasOwnProperty(e)||(this.decoders[e]=this._createNamed(o.decoders[e])),this.decoders[e]},Entity.prototype.decode=function decode(e,t,r){return this._getDecoder(t).decode(e,r)},Entity.prototype._getEncoder=function _getEncoder(e){return e=e||"der",this.encoders.hasOwnProperty(e)||(this.encoders[e]=this._createNamed(o.encoders[e])),this.encoders[e]},Entity.prototype.encode=function encode(e,t,r){return this._getEncoder(t).encode(e,r)}},3228:function(e,t,r){var o=r(62);function Reporter(e){this._reporterState={obj:null,path:[],options:e||{},errors:[]}}function ReporterError(e,t){this.path=e,this.rethrow(t)}t.Reporter=Reporter,Reporter.prototype.isError=function isError(e){return e instanceof ReporterError},Reporter.prototype.save=function save(){var e=this._reporterState;return{obj:e.obj,pathLen:e.path.length}},Reporter.prototype.restore=function restore(e){var t=this._reporterState;t.obj=e.obj,t.path=t.path.slice(0,e.pathLen)},Reporter.prototype.enterKey=function enterKey(e){return this._reporterState.path.push(e)},Reporter.prototype.exitKey=function exitKey(e){var t=this._reporterState;t.path=t.path.slice(0,e-1)},Reporter.prototype.leaveKey=function leaveKey(e,t,r){var o=this._reporterState;this.exitKey(e),null!==o.obj&&(o.obj[t]=r)},Reporter.prototype.path=function path(){return this._reporterState.path.join("/")},Reporter.prototype.enterObject=function enterObject(){var e=this._reporterState,t=e.obj;return e.obj={},t},Reporter.prototype.leaveObject=function leaveObject(e){var t=this._reporterState,r=t.obj;return t.obj=e,r},Reporter.prototype.error=function error(e){var t,r=this._reporterState,o=e instanceof ReporterError;if(t=o?e:new ReporterError(r.path.map((function(e){return"["+JSON.stringify(e)+"]"})).join(""),e.message||e,e.stack),!r.options.partial)throw t;return o||r.errors.push(t),t},Reporter.prototype.wrapResult=function wrapResult(e){var t=this._reporterState;return t.options.partial?{result:this.isError(e)?null:e,errors:t.errors}:e},o(ReporterError,Error),ReporterError.prototype.rethrow=function rethrow(e){if(this.message=e+" at: "+(this.path||"(shallow)"),Error.captureStackTrace&&Error.captureStackTrace(this,ReporterError),!this.stack)try{throw new Error(this.message)}catch(e){this.stack=e.stack}return this}},3229:function(e,t,r){var o=r(1747).Reporter,n=r(1747).EncoderBuffer,i=r(1747).DecoderBuffer,s=r(1586),a=["seq","seqof","set","setof","objid","bool","gentime","utctime","null_","enum","int","objDesc","bitstr","bmpstr","charstr","genstr","graphstr","ia5str","iso646str","numstr","octstr","printstr","t61str","unistr","utf8str","videostr"],c=["key","obj","use","optional","explicit","implicit","def","choice","any","contains"].concat(a);function Node(e,t){var r={};this._baseState=r,r.enc=e,r.parent=t||null,r.children=null,r.tag=null,r.args=null,r.reverseArgs=null,r.choice=null,r.optional=!1,r.any=!1,r.obj=!1,r.use=null,r.useDecoder=null,r.key=null,r.default=null,r.explicit=null,r.implicit=null,r.contains=null,r.parent||(r.children=[],this._wrap())}e.exports=Node;var u=["enc","parent","children","tag","args","reverseArgs","choice","optional","any","obj","use","alteredUse","key","default","explicit","implicit","contains"];Node.prototype.clone=function clone(){var e=this._baseState,t={};u.forEach((function(r){t[r]=e[r]}));var r=new this.constructor(t.parent);return r._baseState=t,r},Node.prototype._wrap=function wrap(){var e=this._baseState;c.forEach((function(t){this[t]=function _wrappedMethod(){var r=new this.constructor(this);return e.children.push(r),r[t].apply(r,arguments)}}),this)},Node.prototype._init=function init(e){var t=this._baseState;s(null===t.parent),e.call(this),t.children=t.children.filter((function(e){return e._baseState.parent===this}),this),s.equal(t.children.length,1,"Root node can have only one child")},Node.prototype._useArgs=function useArgs(e){var t=this._baseState,r=e.filter((function(e){return e instanceof this.constructor}),this);e=e.filter((function(e){return!(e instanceof this.constructor)}),this),0!==r.length&&(s(null===t.children),t.children=r,r.forEach((function(e){e._baseState.parent=this}),this)),0!==e.length&&(s(null===t.args),t.args=e,t.reverseArgs=e.map((function(e){if("object"!=typeof e||e.constructor!==Object)return e;var t={};return Object.keys(e).forEach((function(r){r==(0|r)&&(r|=0);var o=e[r];t[o]=r})),t})))},["_peekTag","_decodeTag","_use","_decodeStr","_decodeObjid","_decodeTime","_decodeNull","_decodeInt","_decodeBool","_decodeList","_encodeComposite","_encodeStr","_encodeObjid","_encodeTime","_encodeNull","_encodeInt","_encodeBool"].forEach((function(e){Node.prototype[e]=function _overrided(){var t=this._baseState;throw new Error(e+" not implemented for encoding: "+t.enc)}})),a.forEach((function(e){Node.prototype[e]=function _tagMethod(){var t=this._baseState,r=Array.prototype.slice.call(arguments);return s(null===t.tag),t.tag=e,this._useArgs(r),this}})),Node.prototype.use=function use(e){s(e);var t=this._baseState;return s(null===t.use),t.use=e,this},Node.prototype.optional=function optional(){return this._baseState.optional=!0,this},Node.prototype.def=function def(e){var t=this._baseState;return s(null===t.default),t.default=e,t.optional=!0,this},Node.prototype.explicit=function explicit(e){var t=this._baseState;return s(null===t.explicit&&null===t.implicit),t.explicit=e,this},Node.prototype.implicit=function implicit(e){var t=this._baseState;return s(null===t.explicit&&null===t.implicit),t.implicit=e,this},Node.prototype.obj=function obj(){var e=this._baseState,t=Array.prototype.slice.call(arguments);return e.obj=!0,0!==t.length&&this._useArgs(t),this},Node.prototype.key=function key(e){var t=this._baseState;return s(null===t.key),t.key=e,this},Node.prototype.any=function any(){return this._baseState.any=!0,this},Node.prototype.choice=function choice(e){var t=this._baseState;return s(null===t.choice),t.choice=e,this._useArgs(Object.keys(e).map((function(t){return e[t]}))),this},Node.prototype.contains=function contains(e){var t=this._baseState;return s(null===t.use),t.contains=e,this},Node.prototype._decode=function decode(e,t){var r=this._baseState;if(null===r.parent)return e.wrapResult(r.children[0]._decode(e,t));var o,n=r.default,s=!0,a=null;if(null!==r.key&&(a=e.enterKey(r.key)),r.optional){var c=null;if(null!==r.explicit?c=r.explicit:null!==r.implicit?c=r.implicit:null!==r.tag&&(c=r.tag),null!==c||r.any){if(s=this._peekTag(e,c,r.any),e.isError(s))return s}else{var u=e.save();try{null===r.choice?this._decodeGeneric(r.tag,e,t):this._decodeChoice(e,t),s=!0}catch(e){s=!1}e.restore(u)}}if(r.obj&&s&&(o=e.enterObject()),s){if(null!==r.explicit){var d=this._decodeTag(e,r.explicit);if(e.isError(d))return d;e=d}var f=e.offset;if(null===r.use&&null===r.choice){if(r.any)u=e.save();var l=this._decodeTag(e,null!==r.implicit?r.implicit:r.tag,r.any);if(e.isError(l))return l;r.any?n=e.raw(u):e=l}if(t&&t.track&&null!==r.tag&&t.track(e.path(),f,e.length,"tagged"),t&&t.track&&null!==r.tag&&t.track(e.path(),e.offset,e.length,"content"),n=r.any?n:null===r.choice?this._decodeGeneric(r.tag,e,t):this._decodeChoice(e,t),e.isError(n))return n;if(r.any||null!==r.choice||null===r.children||r.children.forEach((function decodeChildren(r){r._decode(e,t)})),r.contains&&("octstr"===r.tag||"bitstr"===r.tag)){var p=new i(n);n=this._getUse(r.contains,e._reporterState.obj)._decode(p,t)}}return r.obj&&s&&(n=e.leaveObject(o)),null===r.key||null===n&&!0!==s?null!==a&&e.exitKey(a):e.leaveKey(a,r.key,n),n},Node.prototype._decodeGeneric=function decodeGeneric(e,t,r){var o=this._baseState;return"seq"===e||"set"===e?null:"seqof"===e||"setof"===e?this._decodeList(t,e,o.args[0],r):/str$/.test(e)?this._decodeStr(t,e,r):"objid"===e&&o.args?this._decodeObjid(t,o.args[0],o.args[1],r):"objid"===e?this._decodeObjid(t,null,null,r):"gentime"===e||"utctime"===e?this._decodeTime(t,e,r):"null_"===e?this._decodeNull(t,r):"bool"===e?this._decodeBool(t,r):"objDesc"===e?this._decodeStr(t,e,r):"int"===e||"enum"===e?this._decodeInt(t,o.args&&o.args[0],r):null!==o.use?this._getUse(o.use,t._reporterState.obj)._decode(t,r):t.error("unknown tag: "+e)},Node.prototype._getUse=function _getUse(e,t){var r=this._baseState;return r.useDecoder=this._use(e,t),s(null===r.useDecoder._baseState.parent),r.useDecoder=r.useDecoder._baseState.children[0],r.implicit!==r.useDecoder._baseState.implicit&&(r.useDecoder=r.useDecoder.clone(),r.useDecoder._baseState.implicit=r.implicit),r.useDecoder},Node.prototype._decodeChoice=function decodeChoice(e,t){var r=this._baseState,o=null,n=!1;return Object.keys(r.choice).some((function(i){var s=e.save(),a=r.choice[i];try{var c=a._decode(e,t);if(e.isError(c))return!1;o={type:i,value:c},n=!0}catch(t){return e.restore(s),!1}return!0}),this),n?o:e.error("Choice not matched")},Node.prototype._createEncoderBuffer=function createEncoderBuffer(e){return new n(e,this.reporter)},Node.prototype._encode=function encode(e,t,r){var o=this._baseState;if(null===o.default||o.default!==e){var n=this._encodeValue(e,t,r);if(void 0!==n&&!this._skipDefault(n,t,r))return n}},Node.prototype._encodeValue=function encode(e,t,r){var n=this._baseState;if(null===n.parent)return n.children[0]._encode(e,t||new o);var i=null;if(this.reporter=t,n.optional&&void 0===e){if(null===n.default)return;e=n.default}var s=null,a=!1;if(n.any)i=this._createEncoderBuffer(e);else if(n.choice)i=this._encodeChoice(e,t);else if(n.contains)s=this._getUse(n.contains,r)._encode(e,t),a=!0;else if(n.children)s=n.children.map((function(r){if("null_"===r._baseState.tag)return r._encode(null,t,e);if(null===r._baseState.key)return t.error("Child should have a key");var o=t.enterKey(r._baseState.key);if("object"!=typeof e)return t.error("Child expected, but input is not object");var n=r._encode(e[r._baseState.key],t,e);return t.leaveKey(o),n}),this).filter((function(e){return e})),s=this._createEncoderBuffer(s);else if("seqof"===n.tag||"setof"===n.tag){if(!n.args||1!==n.args.length)return t.error("Too many args for : "+n.tag);if(!Array.isArray(e))return t.error("seqof/setof, but data is not Array");var c=this.clone();c._baseState.implicit=null,s=this._createEncoderBuffer(e.map((function(r){var o=this._baseState;return this._getUse(o.args[0],e)._encode(r,t)}),c))}else null!==n.use?i=this._getUse(n.use,r)._encode(e,t):(s=this._encodePrimitive(n.tag,e),a=!0);if(!n.any&&null===n.choice){var u=null!==n.implicit?n.implicit:n.tag,d=null===n.implicit?"universal":"context";null===u?null===n.use&&t.error("Tag could be omitted only for .use()"):null===n.use&&(i=this._encodeComposite(u,a,d,s))}return null!==n.explicit&&(i=this._encodeComposite(n.explicit,!1,"context",i)),i},Node.prototype._encodeChoice=function encodeChoice(e,t){var r=this._baseState,o=r.choice[e.type];return o||s(!1,e.type+" not found in "+JSON.stringify(Object.keys(r.choice))),o._encode(e.value,t)},Node.prototype._encodePrimitive=function encodePrimitive(e,t){var r=this._baseState;if(/str$/.test(e))return this._encodeStr(t,e);if("objid"===e&&r.args)return this._encodeObjid(t,r.reverseArgs[0],r.args[1]);if("objid"===e)return this._encodeObjid(t,null,null);if("gentime"===e||"utctime"===e)return this._encodeTime(t,e);if("null_"===e)return this._encodeNull();if("int"===e||"enum"===e)return this._encodeInt(t,r.args&&r.reverseArgs[0]);if("bool"===e)return this._encodeBool(t);if("objDesc"===e)return this._encodeStr(t,e);throw new Error("Unsupported tag: "+e)},Node.prototype._isNumstr=function isNumstr(e){return/^[0-9 ]*$/.test(e)},Node.prototype._isPrintstr=function isPrintstr(e){return/^[A-Za-z0-9 '\(\)\+,\-\.\/:=\?]*$/.test(e)}},3230:function(e,t,r){var o=r(2302);t.tagClass={0:"universal",1:"application",2:"context",3:"private"},t.tagClassByName=o._reverse(t.tagClass),t.tag={0:"end",1:"bool",2:"int",3:"bitstr",4:"octstr",5:"null_",6:"objid",7:"objDesc",8:"external",9:"real",10:"enum",11:"embed",12:"utf8str",13:"relativeOid",16:"seq",17:"set",18:"numstr",19:"printstr",20:"t61str",21:"videostr",22:"ia5str",23:"utctime",24:"gentime",25:"graphstr",26:"iso646str",27:"genstr",28:"unistr",29:"charstr",30:"bmpstr"},t.tagByName=o._reverse(t.tag)},3231:function(e,t,r){var o=t;o.der=r(2303),o.pem=r(3232)},3232:function(e,t,r){var o=r(62),n=r(163).Buffer,i=r(2303);function PEMDecoder(e){i.call(this,e),this.enc="pem"}o(PEMDecoder,i),e.exports=PEMDecoder,PEMDecoder.prototype.decode=function decode(e,t){for(var r=e.toString().split(/[\r\n]+/g),o=t.label.toUpperCase(),s=/^-----(BEGIN|END) ([^-]+)-----$/,a=-1,c=-1,u=0;u<r.length;u++){var d=r[u].match(s);if(null!==d&&d[2]===o){if(-1!==a){if("END"!==d[1])break;c=u;break}if("BEGIN"!==d[1])break;a=u}}if(-1===a||-1===c)throw new Error("PEM section not found for: "+o);var f=r.slice(a+1,c).join("");f.replace(/[^a-z0-9\+\/=]+/gi,"");var l=new n(f,"base64");return i.prototype.decode.call(this,l,t)}},3233:function(e,t,r){var o=t;o.der=r(2304),o.pem=r(3234)},3234:function(e,t,r){var o=r(62),n=r(2304);function PEMEncoder(e){n.call(this,e),this.enc="pem"}o(PEMEncoder,n),e.exports=PEMEncoder,PEMEncoder.prototype.encode=function encode(e,t){for(var r=n.prototype.encode.call(this,e).toString("base64"),o=["-----BEGIN "+t.label+"-----"],i=0;i<r.length;i+=64)o.push(r.slice(i,i+64));return o.push("-----END "+t.label+"-----"),o.join("\n")}}}]);
//# sourceMappingURL=npm.asn1.js-dd72b234b0e9315b0d7e.js.map