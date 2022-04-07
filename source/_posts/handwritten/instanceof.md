---
title: instanceof
author: Taoqiupo
date: 2022-04-07 16:42:43
tags: 手写系列
category: 手写
index_img: https://proxy.qiupo.workers.dev/?https://raw.githubusercontent.com/qiupo/myImages/master/img/202204071625666.png
---
实现instanceof
```javascript
function MyInstanceof(l,r){
    let Lproto = l.__proto__;
    const Rproto = r.prototype;
    while(Lproto){
        if(Lproto === Rproto){
            return true
        }else{
            Lproto=Lproto.__proto__;
        }
    }
    return false;
}
class a {
    constructor() {
        this.a = 1;
    }
}
let b= new a;
console.log(MyInstanceof(b,Object))
console.log(MyInstanceof(b,a))
console.log(MyInstanceof(b,Function))
```