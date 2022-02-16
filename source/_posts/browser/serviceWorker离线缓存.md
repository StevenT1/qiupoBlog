---
title: serviceWork离线缓存
date: 2022-02-15 14:02:29
tags: 浏览器系列
category:   浏览器
index_img: https://proxy.qiupo.workers.dev/?https://raw.githubusercontent.com/qiupo/myImages/master/img/202202151427467.png
author: Taoqiupo
---
## 什么是service Worker
&emsp;&emsp;Service Worker 是浏览器在后台独立于网页运行的脚本，它打开了通向不需要网页或用户交互的功能的大门。 现在，它们已包括如推送通知和后台同步等功能。 将来，Service Worker 将会支持如定期同步或地理围栏等其他功能。一般情况下我是考虑通过service Worker进行一些资源的缓存。
&emsp;&emsp;在使用service Worker的时候我们需要知道如何进行拦截网络请求和处理拦截到的网络请求。
+ 首先我们需要知道service Worker说到底他也是个worker，是web worker的一种。具备worker的特性，无法直接访问DOM（在worker中document是不存在的，但是我们可以间接的操作dom，因为javascript的单线程可以保证dom不会被多个操作方修改，不然发生资源抢占的情况太麻烦了，还得处理锁的问题，人家作者当初就没搞的这么复杂），并且通过postMessage来进行通信。
+ service worker安装启动也可以被中止，然后再次需要的时候就是重启的时候了，所有不能保证它里面保存的信息一直有效。不过我们可以通过self.IndexedDB来存储JSON之类的数据，通过Cache接口来缓存url可寻址资源。
```javascript
event.waitUntil(
    caches.open('v1').then(function(cache) {
      return cache.addAll([
        './index.html',
        './img/1.jpg'
        //...
        ]);
    })
  );

//...
self.addEventListener('fetch', function(event) {
  event.respondWith(caches.match(event.request).then(function(response) {
    if (response !== undefined) {
        //如果能访问直接走正常的请求
      return response;
    } else {
        //不能就走cache里存好的资源
      return fetch(event.request).then(function (response) {
        // response 只能使用一次，所以我们先创建个拷贝，把cache的资源放进去后在返回
        let responseClone = response.clone();
        caches.open('v1').then(function (cache) {
          cache.put(event.request, responseClone);
        });
        return response;
      }).catch(function () {
        return caches.match('./error.jpg');
      });
    }
  }));
});

```

## service worker的生命周期
&emsp;&emsp;因为service worker会对请求进行拦截，为了安全考虑，一定需要使用HTTPS来保障请求的安全性（本地调试是可以通过localhost使用的）。下面是service worker的生命周期，我们在使用时就是通过这些生命周期的钩子进行一些操作。
![](https://proxy.qiupo.workers.dev/?https://raw.githubusercontent.com/qiupo/myImages/master/img/202202151533004.png 'service worker生命周期')
![](https://proxy.qiupo.workers.dev/?https://raw.githubusercontent.com/qiupo/myImages/master/img/202202151534335.png '支持的事件')
### 使用流程
1. 首先我们需要注册service worker，在页面中注册
```javascript
if('serviceWorker' in navigator){
    widnow.addEventListener('load',funciton(){
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
            // 注册成功
            console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }, function(err) {
            // 注册失败
            console.log('ServiceWorker registration failed: ', err);
        });
    })
}
```
在注册时的sw文件的位置代表着service worker的作用位置，如果是位于`/user/sw.js`，那么service worker上就只能看到以`/user`开头的网址，所以我们可以通过针对不同内容进行不同的service worker操作，也可以直接作用在根网域实现全面的拦截。

2. isntall
然后进入到我们的sw文件中，此时我们可以在install的生命周期中做一些操作，比如初始化indexedDB的操作。
```javascript
self.addEventListener('install',funciton(event){
    //我们的操作可以决定要缓存哪些文件
    event.waitUntil(
        caches.open('v1').then(function(cache) {
            console.log('cache打开');
            return cache.addAll([
                './index.html',
                './img/1.jpg'
                //...
            ]);
        })
    )
})
```
3. 更新service worker
在有新的service worker时，我们需要摆除旧worker，然后加载新的worker。
+ 在导航到网站时，新的worker会被下载并且启动从而触发install事件
+ 但是因为现在这个页面已经被旧worker控制了，所以新的worker会进入waiting状态。（如果使用self.skipWaiting可以不用等待当前控制页面的worker关闭，从而跳过等待状态，然后让新的worker跳到activating状态）
+ 如果旧的worker被中止了（页面关闭了），新的worker就会获得控制权了
+ 新的worker触发activate事件

## 借助workbox
&emsp;&emsp;如果我们自己写sw的过滤规则那真的是有点麻烦，好在已经有人已经写好了一组库帮助我们进行service worker的使用。[workbox](https://developers.google.com/web/tools/workbox/guides/get-started),可以帮助我们进行编写和管理service worker来进行缓存任务。



