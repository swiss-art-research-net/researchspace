(window.webpackJsonp=window.webpackJsonp||[]).push([[259],{46:function(e,o){function keyCode(e){if(e&&"object"==typeof e){var o=e.which||e.keyCode||e.charCode;o&&(e=o)}if("number"==typeof e)return t[e];var a,c=String(e);return(a=r[c.toLowerCase()])?a:(a=n[c.toLowerCase()])||(1===c.length?c.charCodeAt(0):void 0)}keyCode.isEventKey=function isEventKey(e,o){if(e&&"object"==typeof e){var a=e.which||e.keyCode||e.charCode;if(null==a)return!1;if("string"==typeof o){var t;if(t=r[o.toLowerCase()])return t===a;if(t=n[o.toLowerCase()])return t===a}else if("number"==typeof o)return o===a;return!1}};var r=(o=e.exports=keyCode).code=o.codes={backspace:8,tab:9,enter:13,shift:16,ctrl:17,alt:18,"pause/break":19,"caps lock":20,esc:27,space:32,"page up":33,"page down":34,end:35,home:36,left:37,up:38,right:39,down:40,insert:45,delete:46,command:91,"left command":91,"right command":93,"numpad *":106,"numpad +":107,"numpad -":109,"numpad .":110,"numpad /":111,"num lock":144,"scroll lock":145,"my computer":182,"my calculator":183,";":186,"=":187,",":188,"-":189,".":190,"/":191,"`":192,"[":219,"\\":220,"]":221,"'":222},n=o.aliases={windows:91,"⇧":16,"⌥":18,"⌃":17,"⌘":91,ctl:17,control:17,option:18,pause:19,break:19,caps:20,return:13,escape:27,spc:32,spacebar:32,pgup:33,pgdn:34,ins:45,del:46,cmd:91};for(a=97;a<123;a++)r[String.fromCharCode(a)]=a-32;for(var a=48;a<58;a++)r[a-48]=a;for(a=1;a<13;a++)r["f"+a]=a+111;for(a=0;a<10;a++)r["numpad "+a]=a+96;var t=o.names=o.title={};for(a in r)t[r[a]]=a;for(var c in n)r[c]=n[c]}}]);
//# sourceMappingURL=npm.keycode-d577dcc8439db8a1c938.js.map