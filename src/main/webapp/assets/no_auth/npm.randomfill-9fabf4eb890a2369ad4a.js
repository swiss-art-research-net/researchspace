(window.webpackJsonp=window.webpackJsonp||[]).push([[97],{3243:function(r,e,n){"use strict";(function(r,t){function oldBrowser(){throw new Error("secure random number generation not supported by this browser\nuse chrome, FireFox or Internet Explorer 11")}var o=n(1551),f=n(1694),i=o.Buffer,u=o.kMaxLength,s=r.crypto||r.msCrypto,a=Math.pow(2,32)-1;function assertOffset(r,e){if("number"!=typeof r||r!=r)throw new TypeError("offset must be a number");if(r>a||r<0)throw new TypeError("offset must be a uint32");if(r>u||r>e)throw new RangeError("offset out of range")}function assertSize(r,e,n){if("number"!=typeof r||r!=r)throw new TypeError("size must be a number");if(r>a||r<0)throw new TypeError("size must be a uint32");if(r+e>n||r>u)throw new RangeError("buffer too small")}function actualFill(r,e,n,o){if(t.browser){var i=r.buffer,u=new Uint8Array(i,e,n);return s.getRandomValues(u),o?void t.nextTick((function(){o(null,r)})):r}if(!o)return f(n).copy(r,e),r;f(n,(function(n,t){if(n)return o(n);t.copy(r,e),o(null,r)}))}s&&s.getRandomValues||!t.browser?(e.randomFill=function randomFill(e,n,t,o){if(!(i.isBuffer(e)||e instanceof r.Uint8Array))throw new TypeError('"buf" argument must be a Buffer or Uint8Array');if("function"==typeof n)o=n,n=0,t=e.length;else if("function"==typeof t)o=t,t=e.length-n;else if("function"!=typeof o)throw new TypeError('"cb" argument must be a function');return assertOffset(n,e.length),assertSize(t,n,e.length),actualFill(e,n,t,o)},e.randomFillSync=function randomFillSync(e,n,t){void 0===n&&(n=0);if(!(i.isBuffer(e)||e instanceof r.Uint8Array))throw new TypeError('"buf" argument must be a Buffer or Uint8Array');assertOffset(n,e.length),void 0===t&&(t=e.length-n);return assertSize(t,n,e.length),actualFill(e,n,t)}):(e.randomFill=oldBrowser,e.randomFillSync=oldBrowser)}).call(this,n(38),n(119))}}]);
//# sourceMappingURL=npm.randomfill-9fabf4eb890a2369ad4a.js.map