if(!self.define){let e,i={};const n=(n,s)=>(n=new URL(n+".js",s).href,i[n]||new Promise((i=>{if("document"in self){const e=document.createElement("script");e.src=n,e.onload=i,document.head.appendChild(e)}else e=n,importScripts(n),i()})).then((()=>{let e=i[n];if(!e)throw new Error(`Module ${n} didn’t register its module`);return e})));self.define=(s,r)=>{const d=e||("document"in self?document.currentScript.src:"")||location.href;if(i[d])return;let o={};const t=e=>n(e,d),f={module:{uri:d},exports:o,require:t};i[d]=Promise.all(s.map((e=>f[e]||t(e)))).then((e=>(r(...e),o)))}}define(["./workbox-3e911b1d"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/index-KKwPdgnD.js",revision:null},{url:"assets/index-yHUddS6b.css",revision:null},{url:"index.html",revision:"1e390f67ed215b189aa7fee3b4316a90"},{url:"registerSW.js",revision:"a5df3b0cd1c0dd01de01271414e5c8bb"},{url:"pwa-64x64.png",revision:"4f8d0593ff0ada8f295ad95773888d77"},{url:"pwa-192x192.png",revision:"964f53f4ab26093eb34fa2f9445503a8"},{url:"pwa-512x512.png",revision:"8dbee39801e82f3dae7eda7b063b5087"},{url:"maskable-icon-512x512.png",revision:"3097693e211f840df988f6416469db45"},{url:"manifest.webmanifest",revision:"5dad593d1b8e3fd8f7ea42bb293c5dc6"}],{}),e.cleanupOutdatedCaches(),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));
