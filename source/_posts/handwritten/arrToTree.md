---
title: arrToTree
author: Taoqiupo
date: 2022-04-07 16:00:34
tags: 手写系列
category: 手写
index_img: https://proxy.qiupo.workers.dev/?https://raw.githubusercontent.com/qiupo/myImages/master/img/202204071625666.png
---
扁平结构转换成树结构，有递归和迭代两种方式
```javascript
// 扁平结构转换成树结构
//递归
function arrToTree(arrList) {
  const toTree = (id) => {
    let childList = [];
    let marchArr = arrList.filter((item) => {
      return item.pid === id;
    });
    marchArr.forEach((item) => {
      item.children = toTree(item.id);
      childList.push(item);
    });
    return childList;
  };
  return toTree(null);
}
//迭代
function arrToTree2(arrList) {
  let map = new Map(),
    res=[];
  arrList.forEach((item) => {
      //保存索引
    map.set(item.id, item);
  });
  arrList.forEach((item) => {
    if (map.has(item.pid)) {
      map.get(item.pid).children
        ? map.get(item.pid).children.push(item)
        : (map.get(item.pid).children = []);
    } else {
      res.push(item);
    }
  });
  return res;
}
const arr = [
  { id: 1, pid: null, name: "1" },
  { id: 2, pid: "-1", name: "1" },
  { id: 11, pid: 1, name: "11" },
  { id: 12, pid: 1, name: "12" },
];
console.log(arrToTree(arr));
console.log(arrToTree2(arr));
```