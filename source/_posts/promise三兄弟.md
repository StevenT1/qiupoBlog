---
title: Promise三兄弟all,race,allsettled
date: 2020-10-03 21:46:01
tags: 手写系列
category: 手写
author: Taoqiupo
index_img: https://proxy.qiupo.workers.dev/?https://raw.githubusercontent.com/qiupo/myImages/master/img/20201125143223.png
---
## all
Promise.all(iterable) 方法返回一个 Promise 实例，此实例在 iterable 参数内所有的 promise 都“完成（resolved）”或参数中不包含 promise 时回调完成（resolve）；如果参数中  promise 有一个失败（rejected），此实例回调失败（reject），失败的原因是第一个失败 promise 的结果。
```javascript
const promise1=Promise.resolve(1);
const promise2=Promise.resolve(2);
const promise3=Promise.reject(3);
const promise4=Promise.resolve(4);
const promise = [promise1,promise2,promise3,promise4]
Promise.all(promise).then(val=>{
    val.forEach(r=>console.log(r))
}).catch(res=>{
    console.log(res)
})
//3
```
### 实现
all的特性是只要有一个`rejected`就返回该失败结果，其他的都当作没发生。
```javascript
// 串行执行
function myAll(promises){
  return new Promise(async (r,j)=>{
    let data = [],Err,isError=false;
        for(let promise of promises){
        if(isError) break;
        promise = promise instanceof Promise ? promise : Promise.resolve(promise);
        await promise.then(res=>{
            data.push(res);
        },error=>{
          isError=true;
            j(error)
        })
        }
    
    r(data);
  })
}

//并发执行
function myAllConcurrence(promises){
  return new Promise((r,j)=>{
    let data=[],isError=false,num=promises.length;
    for(let promise of promises){
      if(isError) break;
      promise = promise instanceof Promise ? promise : Promise.resolve(promise);
      promise.then((result)=>{
        data.push(result);
        num ? num-- : r(data);
        }).catch(e=>{
        isError=true;
        j(e);
      })
    }
  })
}
```
## race
Promise.race(iterable) 方法返回一个 promise，一旦迭代器中的某个promise解决或拒绝，返回的 promise就会解决或拒绝。
```javascript
const promise1=Promise.resolve(1);
const promise2=new Promise((resolve, reject) => {
  setTimeout(reject, 500, '500');
});
const promise3 = new Promise((resolve, reject) => {
  setTimeout(resolve, 1000, '1000');
});
const promise4=Promise.resolve(4);
const promise = [promise3,promise2,promise1,promise4];
Promise.race(promise).then((value) => {
  console.log(value);
});
// 1 1最快得到结果，所以只会输出1
```
### 实现
```javascript
function myRace(promises){
  return new Promise((r,j)=>{
        for(let promise of promises){
                promise = promise instanceof Promise ? promise : Promise.resolve(promise);
            promise.then(res=>{
            r(res)
        },error=>{
            j(error)
        })
        }
  })
}
```
## allsettled
Promise.allSettled()方法返回一个在所有给定的promise都已经fulfilled或rejected后的promise，并带有一个对象数组，每个对象表示对应的promise结果。当有多个彼此不依赖的异步任务成功完成时，或者我们要得到每个promise的结果的时候，可以使用。
```javascript
const promise1=Promise.resolve(1);
const promise2=Promise.resolve(2);
const promise3=Promise.reject(3);
const promise4=Promise.resolve(4);
const promise = [promise1,promise2,promise3,promise4]
Promise.allSettled(promise).then(val=>{
    val.forEach(re=>console.log(re))
})
//> Object { status: "fulfilled", value: 1 }
//> Object { status: "fulfilled", value: 2 }
//> Object { status: "rejected", reason: 3 }
//> Object { status: "fulfilled", value: 4 }
```
### 实现
根据其特性，不难实现allSettled，我们只需要得到所有的promise结果存到数组返回即可。
```javascript
function myAllSettled(promises){
  return new Promise(async resolve=>{
    let data=[];
    for(let promise of promises){
      promise = promise instanceof Promise ? promise : Promise.resolve(promise)
        await promise.then(res=>{
        data.push({ status: 'fulfilled', value: res });
      },error=>{
        data.push({ status: 'rejected', reason: error });
      })
    }
    resolve(data);
  })
}
```