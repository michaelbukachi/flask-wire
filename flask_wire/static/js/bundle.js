!function(){var t={};Object.defineProperty(t,"__esModule",{value:!0}),t.fetch=_;var e="undefined"!=typeof globalThis&&globalThis||"undefined"!=typeof self&&self||void 0!==e&&e,r="URLSearchParams"in e,n="Symbol"in e&&"iterator"in Symbol,o="FileReader"in e&&"Blob"in e&&function(){try{return new Blob,!0}catch(t){return!1}}(),i="FormData"in e,s="ArrayBuffer"in e;if(s)var a=["[object Int8Array]","[object Uint8Array]","[object Uint8ClampedArray]","[object Int16Array]","[object Uint16Array]","[object Int32Array]","[object Uint32Array]","[object Float32Array]","[object Float64Array]"],u=ArrayBuffer.isView||function(t){return t&&a.indexOf(Object.prototype.toString.call(t))>-1};function h(t){if("string"!=typeof t&&(t=String(t)),/[^a-z0-9\-#$%&'*+.^_`|~!]/i.test(t)||""===t)throw new TypeError("Invalid character in header field name");return t.toLowerCase()}function c(t){return"string"!=typeof t&&(t=String(t)),t}function l(t){var e={next:function(){var e=t.shift();return{done:void 0===e,value:e}}};return n&&(e[Symbol.iterator]=function(){return e}),e}function f(t){this.map={},t instanceof f?t.forEach((function(t,e){this.append(e,t)}),this):Array.isArray(t)?t.forEach((function(t){this.append(t[0],t[1])}),this):t&&Object.getOwnPropertyNames(t).forEach((function(e){this.append(e,t[e])}),this)}function d(t){if(t.bodyUsed)return Promise.reject(new TypeError("Already read"));t.bodyUsed=!0}function p(t){return new Promise((function(e,r){t.onload=function(){e(t.result)},t.onerror=function(){r(t.error)}}))}function y(t){var e=new FileReader,r=p(e);return e.readAsArrayBuffer(t),r}function m(t){if(t.slice)return t.slice(0);var e=new Uint8Array(t.byteLength);return e.set(new Uint8Array(t)),e.buffer}function b(){return this.bodyUsed=!1,this._initBody=function(t){var e;this.bodyUsed=this.bodyUsed,this._bodyInit=t,t?"string"==typeof t?this._bodyText=t:o&&Blob.prototype.isPrototypeOf(t)?this._bodyBlob=t:i&&FormData.prototype.isPrototypeOf(t)?this._bodyFormData=t:r&&URLSearchParams.prototype.isPrototypeOf(t)?this._bodyText=t.toString():s&&o&&(e=t)&&DataView.prototype.isPrototypeOf(e)?(this._bodyArrayBuffer=m(t.buffer),this._bodyInit=new Blob([this._bodyArrayBuffer])):s&&(ArrayBuffer.prototype.isPrototypeOf(t)||u(t))?this._bodyArrayBuffer=m(t):this._bodyText=t=Object.prototype.toString.call(t):this._bodyText="",this.headers.get("content-type")||("string"==typeof t?this.headers.set("content-type","text/plain;charset=UTF-8"):this._bodyBlob&&this._bodyBlob.type?this.headers.set("content-type",this._bodyBlob.type):r&&URLSearchParams.prototype.isPrototypeOf(t)&&this.headers.set("content-type","application/x-www-form-urlencoded;charset=UTF-8"))},o&&(this.blob=function(){var t=d(this);if(t)return t;if(this._bodyBlob)return Promise.resolve(this._bodyBlob);if(this._bodyArrayBuffer)return Promise.resolve(new Blob([this._bodyArrayBuffer]));if(this._bodyFormData)throw new Error("could not read FormData body as blob");return Promise.resolve(new Blob([this._bodyText]))},this.arrayBuffer=function(){return this._bodyArrayBuffer?d(this)||(ArrayBuffer.isView(this._bodyArrayBuffer)?Promise.resolve(this._bodyArrayBuffer.buffer.slice(this._bodyArrayBuffer.byteOffset,this._bodyArrayBuffer.byteOffset+this._bodyArrayBuffer.byteLength)):Promise.resolve(this._bodyArrayBuffer)):this.blob().then(y)}),this.text=function(){var t,e,r,n=d(this);if(n)return n;if(this._bodyBlob)return t=this._bodyBlob,r=p(e=new FileReader),e.readAsText(t),r;if(this._bodyArrayBuffer)return Promise.resolve(function(t){for(var e=new Uint8Array(t),r=new Array(e.length),n=0;n<e.length;n++)r[n]=String.fromCharCode(e[n]);return r.join("")}(this._bodyArrayBuffer));if(this._bodyFormData)throw new Error("could not read FormData body as text");return Promise.resolve(this._bodyText)},i&&(this.formData=function(){return this.text().then(v)}),this.json=function(){return this.text().then(JSON.parse)},this}f.prototype.append=function(t,e){t=h(t),e=c(e);var r=this.map[t];this.map[t]=r?r+", "+e:e},f.prototype.delete=function(t){delete this.map[h(t)]},f.prototype.get=function(t){return t=h(t),this.has(t)?this.map[t]:null},f.prototype.has=function(t){return this.map.hasOwnProperty(h(t))},f.prototype.set=function(t,e){this.map[h(t)]=c(e)},f.prototype.forEach=function(t,e){for(var r in this.map)this.map.hasOwnProperty(r)&&t.call(e,this.map[r],r,this)},f.prototype.keys=function(){var t=[];return this.forEach((function(e,r){t.push(r)})),l(t)},f.prototype.values=function(){var t=[];return this.forEach((function(e){t.push(e)})),l(t)},f.prototype.entries=function(){var t=[];return this.forEach((function(e,r){t.push([r,e])})),l(t)},n&&(f.prototype[Symbol.iterator]=f.prototype.entries);var g=["DELETE","GET","HEAD","OPTIONS","POST","PUT"];function w(t,e){if(!(this instanceof w))throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');var r,n,o=(e=e||{}).body;if(t instanceof w){if(t.bodyUsed)throw new TypeError("Already read");this.url=t.url,this.credentials=t.credentials,e.headers||(this.headers=new f(t.headers)),this.method=t.method,this.mode=t.mode,this.signal=t.signal,o||null==t._bodyInit||(o=t._bodyInit,t.bodyUsed=!0)}else this.url=String(t);if(this.credentials=e.credentials||this.credentials||"same-origin",!e.headers&&this.headers||(this.headers=new f(e.headers)),this.method=(n=(r=e.method||this.method||"GET").toUpperCase(),g.indexOf(n)>-1?n:r),this.mode=e.mode||this.mode||null,this.signal=e.signal||this.signal,this.referrer=null,("GET"===this.method||"HEAD"===this.method)&&o)throw new TypeError("Body not allowed for GET or HEAD requests");if(this._initBody(o),!("GET"!==this.method&&"HEAD"!==this.method||"no-store"!==e.cache&&"no-cache"!==e.cache)){var i=/([?&])_=[^&]*/;i.test(this.url)?this.url=this.url.replace(i,"$1_="+(new Date).getTime()):this.url+=(/\?/.test(this.url)?"&":"?")+"_="+(new Date).getTime()}}function v(t){var e=new FormData;return t.trim().split("&").forEach((function(t){if(t){var r=t.split("="),n=r.shift().replace(/\+/g," "),o=r.join("=").replace(/\+/g," ");e.append(decodeURIComponent(n),decodeURIComponent(o))}})),e}function A(t,e){if(!(this instanceof A))throw new TypeError('Please use the "new" operator, this DOM object constructor cannot be called as a function.');e||(e={}),this.type="default",this.status=void 0===e.status?200:e.status,this.ok=this.status>=200&&this.status<300,this.statusText="statusText"in e?e.statusText:"",this.headers=new f(e.headers),this.url=e.url||"",this._initBody(t)}w.prototype.clone=function(){return new w(this,{body:this._bodyInit})},b.call(w.prototype),b.call(A.prototype),A.prototype.clone=function(){return new A(this._bodyInit,{status:this.status,statusText:this.statusText,headers:new f(this.headers),url:this.url})},A.error=function(){var t=new A(null,{status:0,statusText:""});return t.type="error",t};var E=[301,302,303,307,308];A.redirect=function(t,e){if(-1===E.indexOf(e))throw new RangeError("Invalid status code");return new A(null,{status:e,headers:{location:t}})};var T=e.DOMException;try{new T}catch(P){(T=function(t,e){this.message=t,this.name=e;var r=Error(t);this.stack=r.stack}).prototype=Object.create(Error.prototype),T.prototype.constructor=T}function _(t,r){return new Promise((function(n,i){var a=new w(t,r);if(a.signal&&a.signal.aborted)return i(new T("Aborted","AbortError"));var u=new XMLHttpRequest;function h(){u.abort()}u.onload=function(){var t,e,r={status:u.status,statusText:u.statusText,headers:(t=u.getAllResponseHeaders()||"",e=new f,t.replace(/\r?\n[\t ]+/g," ").split("\r").map((function(t){return 0===t.indexOf("\n")?t.substr(1,t.length):t})).forEach((function(t){var r=t.split(":"),n=r.shift().trim();if(n){var o=r.join(":").trim();e.append(n,o)}})),e)};r.url="responseURL"in u?u.responseURL:r.headers.get("X-Request-URL");var o="response"in u?u.response:u.responseText;setTimeout((function(){n(new A(o,r))}),0)},u.onerror=function(){setTimeout((function(){i(new TypeError("Network request failed"))}),0)},u.ontimeout=function(){setTimeout((function(){i(new TypeError("Network request failed"))}),0)},u.onabort=function(){setTimeout((function(){i(new T("Aborted","AbortError"))}),0)},u.open(a.method,function(t){try{return""===t&&e.location.href?e.location.href:t}catch(r){return t}}(a.url),!0),"include"===a.credentials?u.withCredentials=!0:"omit"===a.credentials&&(u.withCredentials=!1),"responseType"in u&&(o?u.responseType="blob":s&&a.headers.get("Content-Type")&&-1!==a.headers.get("Content-Type").indexOf("application/octet-stream")&&(u.responseType="arraybuffer")),!r||"object"!=typeof r.headers||r.headers instanceof f?a.headers.forEach((function(t,e){u.setRequestHeader(e,t)})):Object.getOwnPropertyNames(r.headers).forEach((function(t){u.setRequestHeader(t,c(r.headers[t]))})),a.signal&&(a.signal.addEventListener("abort",h),u.onreadystatechange=function(){4===u.readyState&&a.signal.removeEventListener("abort",h)}),u.send(void 0===a._bodyInit?null:a._bodyInit)}))}_.polyfill=!0,e.fetch||(e.fetch=_,e.Headers=f,e.Request=w,e.Response=A);class B{constructor(t,e,r=null,n=null){this.id=t,this.element=e,this.initial=r,this.source=null,this.events=null===n?[]:n}updateBody(t){this.element.innerHTML=t}updateSource(t,e=null){this.fetchDataFromSource(t,e)}stringToElement(t){const e=document.createElement("template");return e.innerHTML=t.trim(),e.content.firstChild}fetchDataFromSource(e,r,n=null){(0,t.fetch)(e).then(t=>t.text()).then(t=>{if(this.updateBody(t),this.source=e,null!==n){const e=this.stringToElement(t);n(e)}}).catch((function(t){console.log(t)}))}handleEvent(t){this.events.map(t=>t.name).includes(t)&&null!==this.source&&this.updateSource(this.source)}}class O{constructor(t){this.name=t}}class x{constructor(){this.frames={}}load(){this.loadFrames(),this.prepareTriggers(),this.setupDocumentListeners()}loadFrames(t=document){this.getAllWireFrames(t).forEach(t=>{const e=t.getAttribute("wire:frame"),r=t.getAttribute("wire:init"),n=t.getAttribute("wire:on-event");let o=null;null!==n&&(o=n.split(",").map(t=>new O(t))),e in this.frames||(this.frames[e]=new B(e,t,r,o),null!==r&&this.frames[e].updateSource(r,t=>{this.loadFrames(t),this.prepareTriggers(t)}))})}prepareTriggers(t=document){this.getAllWireTriggers(t).forEach(t=>{if(null===t.getAttribute("wire:target"))throw Error('All wire triggers must have a "wire:target" attribute.');"A"===t.tagName&&t.setAttribute("href","javascript:")})}interceptClickEvent(){const t=this,e=e=>{const r=e.target;if("A"===r.tagName){const e=r.getAttribute("wire:source"),n=r.getAttribute("wire:target");if(null===e)throw Error("Trigger is missing the 'wire:source' attribute");n in t.frames&&t.frames[n].updateSource(e)}};document.addEventListener?document.addEventListener("click",e):document.attachEvent&&document.attachEvent("onclick",e)}interceptSubmitEvent(){const t=this,e=e=>{const r=e.target;if("FORM"===r.tagName&&null!==r.getAttribute("wire:mutate")){const n=r.getAttribute("wire:event");e.preventDefault&&e.preventDefault();const o=r.getAttribute("action")||window.location.pathname,i=r.getAttribute("method")||"POST",s=new FormData(r);return this.performMutation(o,s,i,()=>{if(null!==n){const e=n.split(",");t.fireEvents(e)}}),!1}};document.addEventListener?document.addEventListener("submit",e):document.attachEvent&&document.attachEvent("submit",e)}fireEvents(t){for(let e of t)for(let t of Object.keys(this.frames))this.frames[t].handleEvent(e)}performMutation(e,r,n,o=null){(0,t.fetch)(e,{method:n,body:r}).then((function(t){null!==o&&o()})).catch((function(t){console.log(t)}))}setupDocumentListeners(){this.interceptClickEvent(),this.interceptSubmitEvent()}getElementsWithAttribute(t,e){return[].filter.call(t.getElementsByTagName("*"),t=>null!==t.getAttribute(e))}getAllWireFrames(t=document){return this.getElementsWithAttribute(t,"wire:frame")}getAllWireTriggers(t=document){return this.getElementsWithAttribute(t,"wire:trigger")}}window.addEventListener("DOMContentLoaded",(function(){(new x).load()}))}();