(window.webpackJsonp=window.webpackJsonp||[]).push([[296],{3525:function(e,t,r){"use strict";r.r(t);var d=r(2391),o=r(2390),c={bold:"mod+b",compose:["down","left","right","up","backspace","enter"],moveBackward:"left",moveForward:"right",moveWordBackward:"ctrl+left",moveWordForward:"ctrl+right",deleteBackward:"shift?+backspace",deleteForward:"shift?+delete",extendBackward:"shift+left",extendForward:"shift+right",italic:"mod+i",splitBlock:"shift?+enter",undo:"mod+z"},a={moveLineBackward:"opt+up",moveLineForward:"opt+down",moveWordBackward:"opt+left",moveWordForward:"opt+right",deleteBackward:["ctrl+backspace","ctrl+h"],deleteForward:["ctrl+delete","ctrl+d"],deleteLineBackward:"cmd+shift?+backspace",deleteLineForward:["cmd+shift?+delete","ctrl+k"],deleteWordBackward:"opt+shift?+backspace",deleteWordForward:"opt+shift?+delete",extendLineBackward:"opt+shift+up",extendLineForward:"opt+shift+down",redo:"cmd+shift+z",transposeCharacter:"ctrl+t"},i={deleteWordBackward:"ctrl+shift?+backspace",deleteWordForward:"ctrl+shift?+delete",redo:"ctrl+y"},s={},l=o.IS_IOS||o.IS_MAC,n=!l;[].concat(Object.keys(c)).concat(Object.keys(a)).concat(Object.keys(i)).forEach((function(e){var t="is"+e[0].toUpperCase()+e.slice(1);if(!s[t]){var r=c[e],o=a[e],w=i[e],k=r&&Object(d.isKeyHotkey)(r),p=o&&Object(d.isKeyHotkey)(o),f=w&&Object(d.isKeyHotkey)(w);s[t]=function(e){return!(!k||!k(e))||(!!(l&&p&&p(e))||!!(n&&f&&f(e)))}}})),t.default=s}}]);
//# sourceMappingURL=npm.slate-hotkeys-51d918a19b3727638c7d.js.map