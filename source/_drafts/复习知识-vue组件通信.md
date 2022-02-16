---
title: 复习知识--vue组件通信
author: Taoqiupo
date: 2022-02-16 14:42:59
tags: vue
category: 复习
index_img: https://proxy.qiupo.workers.dev/?https://raw.githubusercontent.com/qiupo/myImages/master/img/202202161443744.png
---
## vue组件通信
&emsp;&emsp;组件之间的作用域是独立的，但是我们很多时候都需要实现组件间的通信，父子双向通信，兄弟间通信，没有什么关系的组件间的通信。在组件通信方面总共有八种方法：
1. props
最简单的一种方式，通过props来实现父组件向子组件传值，子组件通过props属性来接受父组件的参数
```
//父组件
<child name='hello'></child>

//子组件
{
    props:{
        name:{
            type:String,
            default:'nothing',
            require:true
        }
    },
    //...
}
```
2. $emit $on
通过事件机制来实现 子组件向父组件传值，在子组件emit一个自定义事件，然后在父组件通过绑定监听器来接受数据
```
//父组件
<chlid @action='get'></child>

get(data){
    console.log(data)   //data
}

//子组件
this.$emit('action','data')；
```
3. ref

4. EventBus
5. $parent $children
6. provide inject
7. $attrs $listeners
8. vuex
