(window.webpackJsonp=window.webpackJsonp||[]).push([[24],{1213:function(t,e,n){var o,r=r||function(t){"use strict";if(!(void 0===t||"undefined"!=typeof navigator&&/MSIE [1-9]\./.test(navigator.userAgent))){var e=t.document,get_URL=function(){return t.URL||t.webkitURL||t},n=e.createElementNS("http://www.w3.org/1999/xhtml","a"),o="download"in n,r=/constructor/i.test(t.HTMLElement),a=/CriOS\/[\d]+/.test(navigator.userAgent),throw_outside=function(e){(t.setImmediate||t.setTimeout)((function(){throw e}),0)},revoke=function(t){setTimeout((function(){"string"==typeof t?get_URL().revokeObjectURL(t):t.remove()}),4e4)},auto_bom=function(t){return/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(t.type)?new Blob([String.fromCharCode(65279),t],{type:t.type}):t},FileSaver=function(e,i,c){c||(e=auto_bom(e));var u,s=this,d="application/octet-stream"===e.type,dispatch_all=function(){!function(t,e,n){for(var o=(e=[].concat(e)).length;o--;){var r=t["on"+e[o]];if("function"==typeof r)try{r.call(t,n||t)}catch(t){throw_outside(t)}}}(s,"writestart progress write writeend".split(" "))};if(s.readyState=s.INIT,o)return u=get_URL().createObjectURL(e),void setTimeout((function(){var t,e;n.href=u,n.download=i,t=n,e=new MouseEvent("click"),t.dispatchEvent(e),dispatch_all(),revoke(u),s.readyState=s.DONE}));!function(){if((a||d&&r)&&t.FileReader){var n=new FileReader;return n.onloadend=function(){var e=a?n.result:n.result.replace(/^data:[^;]*;/,"data:attachment/file;");t.open(e,"_blank")||(t.location.href=e),e=void 0,s.readyState=s.DONE,dispatch_all()},n.readAsDataURL(e),void(s.readyState=s.INIT)}(u||(u=get_URL().createObjectURL(e)),d)?t.location.href=u:t.open(u,"_blank")||(t.location.href=u);s.readyState=s.DONE,dispatch_all(),revoke(u)}()},i=FileSaver.prototype;return"undefined"!=typeof navigator&&navigator.msSaveOrOpenBlob?function(t,e,n){return e=e||t.name||"download",n||(t=auto_bom(t)),navigator.msSaveOrOpenBlob(t,e)}:(i.abort=function(){},i.readyState=i.INIT=0,i.WRITING=1,i.DONE=2,i.error=i.onwritestart=i.onprogress=i.onwrite=i.onabort=i.onerror=i.onwriteend=null,function(t,e,n){return new FileSaver(t,e||t.name||"download",n)})}}("undefined"!=typeof self&&self||"undefined"!=typeof window&&window||this.content);t.exports?t.exports.saveAs=r:null!==n(1252)&&null!==n(1356)&&(void 0===(o=function(){return r}.apply(e,[]))||(t.exports=o))}}]);
//# sourceMappingURL=npm.file-saver-ef2e25f88180f4a549bf.js.map