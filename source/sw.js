importScripts("./sw-toolbox.js");
var cacheVersion = "-17104";
var staticImageCacheName = "image" + cacheVersion;
var staticAssetsCacheName = "assets" + cacheVersion;
var contentCacheName = "content" + cacheVersion;
var vendorCacheName = "vendor" + cacheVersion; 
var maxEntries = 70; /* 最大缓存数量 */

// 图床缓存
self.toolbox.router.get("/(.*)", self.toolbox.cacheFirst, {
    origin: /proxy\.qiupo\.workers\.dev\/\?https\:\/\/raw\.githubusercontent\.com\/qiupo\/myImages\/master\/img/,
    cache: {
        name: staticImageCacheName,
        maxEntries: maxEntries
      }
  });
  // 内容缓存
self.toolbox.router.get("/(.*)", self.toolbox.cacheFirst, {
    origin: /qiupo\.github\.io/,
    cache: {
       name: contentCacheName,
       maxEntries: maxEntries
}
  });


/* 缓存cdn静态资源，自行修改对于你的静态文件资源路径 */
/* cdn.tangruiping.com/lib/中存放静态文件资源则有如下写法 */
// self.toolbox.router.get("/lib/(.*)", self.toolbox.fastest, {origin: /cdn\.qiupo.github.io\.com/,});


/* NoCache */
self.toolbox.router.get("/sw.js",self.toolbox.networkFirst);

self.addEventListener("install",
function(event) {return event.waitUntil(self.skipWaiting())
});
self.addEventListener("activate",
function(event) {return event.waitUntil(self.clients.claim())
})