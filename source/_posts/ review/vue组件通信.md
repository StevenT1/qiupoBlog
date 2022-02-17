---
title: vue组件通信
author: Taoqiupo
date: 2022-02-16 14:42:59
tags: vue
category: 复习
index_img: https://proxy.qiupo.workers.dev/?https://raw.githubusercontent.com/qiupo/myImages/master/img/202202161443744.png
---

## vue 组件通信

&emsp;&emsp;组件之间的作用域是独立的，但是我们很多时候都需要实现组件间的通信，父子双向通信，兄弟间通信，没有什么关系的组件间的通信。在组件通信方面总共有八种方法：

1. props
   最简单的一种方式，通过 props 来实现父组件向子组件传值，子组件通过 props 属性来接受父组件的参数

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
   通过事件机制来实现 子组件向父组件传值，在子组件 emit 一个自定义事件，然后在父组件通过绑定监听器来接受数据

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
   通过 ref 标签获取组件的标记来获得对象；

```
<Child ref='child' />

this.$refs.child
```

4. EventBus
   通过一个中央事件总线来作为载体进行兄弟组件传值；

```javascript
class Bus{
    constructor(){
        this.callBackList=[];
    }
    $on(name,function){
        this.callBackList[name] = this.callBackList[name] || [];
        this.callBackList[name].push(function);

    }
    $emit(name,args){
       this.callBackList[name] && this.callBackList[name].forEach(item=>item(args));
    }
}

//main.js
Vue.prototype.$bus = new Bus();
//或者直接使用vue
Vue.prototype.$bus = new Vue();

//
this.$bus.$emit('foo');

this.$bus.$on('foo',function(){
    console.log('foo callback');
})
```

5. $parent $children
使用$parent和$children来访问父子实例来实现获取对应的数据，或者借助共同的父组件的$parent来实现小范围事物总线的功能
```javascript
this.$parent.on('foo',function(){
    console.log('foo')
})
this.$parent.emit('foo;);
```

6. provide inject
借助provide和inject的方法来实现祖先后代传值
```javascript
provide(){
    return{
        foo:'foo'
    }
}
//后代
inject:['foo']
this.foo  //foo
```
上面这种情况是无法实现响应式的，使用Vue.observable包裹要传递的变量可以实现响应式变化，vue3中不需要额外操作只需要`provide('name',name')`,后代中的`inject('name')`的值直接就是响应式的
7. $attrs $listeners
$attrs可以获取祖先作用域中没有被prop识别的属性（没有class和style），$listeners包含祖先作用域中的事件监听器（.native不包含）
```javascript
//祖先
<Child :a='awd' :bb='bb' @action='doSomeThing' />

//后代
...
created(){
    console.log(this.$attrs)    //{"a":"awd","bb":"bb"}
    this.$emit('action','hello');   //dosomething
}
```
8. vuex
![](https://proxy.qiupo.workers.dev/?https://raw.githubusercontent.com/qiupo/myImages/master/img/202202171259545.png 'vuex')

## 总结
父子通信：props/$emit, ref
兄弟通信：$bus，$parent
祖先后代：provide/inject,attrs
复杂传递：vuex