---
title: webWorker是个啥？
author: Taoqiupo
date: 2022-02-15 16:23:16
tags: 浏览器系列
category:   浏览器
index_img: https://proxy.qiupo.workers.dev/?https://raw.githubusercontent.com/qiupo/myImages/master/img/202202151624871.png
---
## 什么是web worker
&emsp;&emsp;总所周知，javascript是一门单线程的语言，我们是不能像操作系统一样同时跑多个程序或者任务，那么势必会因此出现运行中因为某些计算大的任务而导致后面的操作被停滞，虽然有事件循环机制eventloop来解决平时的冲突问题(可以看[事件循环](https://qiupo.github.io/2020/11/25/browser/%E4%BA%8B%E4%BB%B6%E5%BE%AA%E7%8E%AF/))，但是并不能解决根本问题。而web worker就是一种可以使操作并行执行的线程技术。通过web worker执行一些长时间运行的脚本或者处理计算密集型任务，同时又不会阻碍UI获取他脚本处理用户互动。
&emsp;&emsp;就这种功能来说的worker有两种，分别是专用 Worker 和 共享 Worker。专用worker就是只能被首次生成他的脚本使用，但是共享worker是可以被多个脚本使用的，他的上下文是sharedWorkerGlobalScop对象。就 Worker 来说，self 和 this 指的都是 Worker 的全局作用域。但是因为worker本身是独立的，所以worker只能操作javascript功能的子集。
+ worker无法使用的部分
    + DOM
    + window对象
    + document对象
    + parent对象
+ worker可以使用的部分
    + navigator对象
    + location对象（只读）
    + XMLHttpRequest
    + setTimeout()/clearTimeout()和setInterval()/clearInterval()
    + Appcache
    + 使用importScript()导入外部脚本
    + 生成其他web Worker

1. 专用 worker
    专用worker很好处理，直接生成然后使用postMessage进行通信即可。
    **main.js**
    ```javascript
    //生成新的worker
    if(!!window.Worker){
        let myWorker = new Worker('worker.js');
    }else{
        //...
    }
    //发送消息
    myWorker.postMessage([value1,value2])

    myWorker.onmessage = function(e){
        let result = e.data;
        //处理
    }

    //可手动关闭
    myWorker.terminate();

    ```
    **worker.js**
    ```javascript
    self.addEventListener('message', function(e) {
        //发送数据
        let data = e.data;
        //操作

        self.postMessage(data);
        }, false);


    //或者直接
    onmessage = function(e){
        let data = e.data;
        //...
    }
    ```

2. 共享 worker
    共享 worker和专用worker很相似
    main.js
    ```javascript
    if(!!window.SharedWorker){
        let myWorker = new SharedWorker('worker.js')
    }

    myWorker.port.postMessage([value1,value2]);

    myWorker.port.onmessage = function(e){
        let result = e.data;
        //...
    }
    ```
    worker.js
    ```javascript
    onconnect = function(e){
        let port = e.port[0];
        port.onmessage = function(e){
            let result = e.data;
            // ... 
            port.postMessage(result);
        }
    }
    ```
    如果使用addEventListen方法，就需要使用
    >port.start()  //worker线程
    myWorker.port.start() //父线程
    
    方法来调用