importScripts("./sw-toolbox.js");
var cacheVersion = "-17104";
var staticImageCacheName = "image" + cacheVersion;
var staticAssetsCacheName = "assets" + cacheVersion;
var contentCacheName = "content" + cacheVersion;
var vendorCacheName = "vendor" + cacheVersion;
var maxEntries = 70; /* 最大缓存数量 */

// 图床缓存
self.toolbox.router.get("/(.*)", self.toolbox.networkFirst, {
  origin: /proxy\.qiupo\.workers\.dev/,
  cache: {
    name: staticImageCacheName,
    maxEntries: maxEntries,
  },
});
// 内容缓存
self.toolbox.router.get("/(.*)", self.toolbox.networkFirst, {
  origin: /qiupo\.github\.io/,
  // origin: /localhost/,
  cache: {
    name: contentCacheName,
    maxEntries: maxEntries,
  },
});

// cdn缓存
self.toolbox.router.get("/(.*)", self.toolbox.cacheFirst, {
  origin: /at\.alicdn\.com/,
  cache: {
    name: staticAssetsCacheName,
    maxEntries: maxEntries
  }
});
self.toolbox.router.get("/(.*)", self.toolbox.cacheFirst, {
  origin: /cdn\.staticfile\.org/,
  cache: {
    name: staticAssetsCacheName,
    maxEntries: maxEntries
  }
});
self.toolbox.router.get("/(.*)", self.toolbox.cacheFirst, {
  origin: /cdn\.staticfile\.org/,
  cache: {
    name: staticAssetsCacheName,
    maxEntries: maxEntries
  }
});


/* NoCache */
self.toolbox.router.get("/sw.js", self.toolbox.networkFirst);

self.addEventListener("install", function (event) {
  return event.waitUntil(self.skipWaiting());
});
self.addEventListener("activate", function (event) {
  return event.waitUntil(self.clients.claim());
});
