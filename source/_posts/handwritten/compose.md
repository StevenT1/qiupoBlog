---
title: compose
author: Taoqiupo
date: 2022-04-07 16:41:19
tags: 手写系列
category: 手写
index_img: https://proxy.qiupo.workers.dev/?https://raw.githubusercontent.com/qiupo/myImages/master/img/202204071625666.png
---
koa里的compose函数实现
```javascript
function compose(middleList) {
  return function fn(ctx, next) {
    let index = -1;
    return dispatch(0);
    function dispatch(i) {
      index = i;
      let middle = middleList[i];
      if (i === middleList.length) return next;
      if(!middle) return Promise.resolve();
      try {
        return Promise.resolve(middle(ctx, dispatch.bind(null, i + 1)));
      } catch (e) {
        return Promise.reject(e);
      }
    }
  };
}

```