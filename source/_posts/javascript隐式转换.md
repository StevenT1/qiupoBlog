---
title: javascript隐式转换
author: Taoqiupo
date: 2021-09-20 10:10:40
tags: 隐式转换
category: javascript
index_img: https://proxy.qiupo.workers.dev/?https://raw.githubusercontent.com/qiupo/myImages/master/img/202202211015601.png
---

JavaScript 的隐式转换会发生在比较和运算的时候，比如++ -- - + == > < >= <=中，在执行代码时，如果值不是数字类型就会发生隐式转换，所以会出现很多奇怪的情况，在此进行一些想法的记录。
### 一元运算符
递增递减
`-- ++`
加减
`+-`

1. 都是数字正常操作
2. 只要有一个字符串，管你是什么都转成字符串接上
3. 在有对象时先通过 Symbol.toPrimitive 找到原始类型判断是否有 valueOf()，没有或者返回 NaN，有就直接调用 toString()，f(),[]是'',所以符合 1⃣️,,{}是"[object Object]",所以也符合 1
但是{}在前的时候直接在 chrome 浏览器 console 输出会有不同的情况，可能是浏览器 console 的规则不同。
   + {}+any 都会把后面的通过 Number()转换后输出
   + {}+{} 是[object Object][object object]
   + {}+{}; 是 NaN，估计是{};会当作一个执行块，Number()转的结果是 NaN
   + {}+undefined 是 NaN
4. Infinity 和 Infinity 相加正常操作
5. +-Infinity 和+-null、+-undefined 相加是 NaN
6. +0 -0 正常操作，除了-0+0 是+0
7. +-null 和+-undefined 相加 NaN
8. null 在没有''时，转成 0 进行处理

```javascript
Infinity+Infinity //Infinity
-Infinity+-Infinity //-Infinity
Infinity-Infinity //NaN
NaN+any //NaN

0+0 //0
0-0 //+0
-0-0 //-0

{}+{} //[object Object][object Object]
{}+{}; //NaN
{}+'a' //NaN
{}+'1' //1
{}+[] //0
{}+null //0
{}+undefined //NaN

var s ={} +any
s //"[object Object]any"

any+{} //"any[object Object]"
[]+[] //""
[]+Infinity //Infinity
[]+1 //1
```


1. 都是数字正常操作
2. Infinity-Infinity 是 NaN -Infinity-Infinity 是-Infinity，其他情况可以转成加法
3. -0，+0 和加法一样
4. 有一个是字符串、boolean、null 和 undefined，调用 Number()转成数值操作，如果结果是 NaN，那么结果就是 NaN
5. 如果有对象，那么进行 valueOf()获得数值操作，如果是 NaN，那结果就是 NaN，如果没有 valueOf()，调用 toString()然后转成数值进行操作。
### 关系操作符
`> > = < <=`
抽象关系比较的隐式转换也是分情况讨论的，不过比较简单
1. 都是数字正常比较
2. 不全是，则先进行两边先进行 toPrimitive 转换后，只要有非字符串类型的，双方就进行 toNumber()转换，然后比较
3. 如果都是字符串，则按照字母的顺序进行比较。如：["044"]>["422"] 是 false，因为先比较第一个"0"和"4"，发现"0"在字符顺序上是小于"4"的，所以是 false
4. JavaScript 中会>=转换成<进行比较，比如 a>=b 会转换成!(a<b)，进行比较操作，<=同理。

```javascript
1>1 //false
[123] > "01222" //true
[123] > 01222 //false
"1" > "0123" //true
var a1 = {a : 1}
var b1 = {b : 1}
a1 > b1 //false
a1 < b1 //false
a1 == b1 //false
a1 >= b1 //true
a1 <= b1 //true
```

### 相等操作符
`== != === !===`
有两种相等，宽松相等和严格相等，严格相等不会进行隐式转换，会比较类型和值是否相等，所以推荐使用！但是宽松相等就会进行隐式转换。所以会有很多奇怪的情况出现。以下是 ES5 的规定：
比较运算 x==y, 其中 x 和 y 是值，返回 true 或者 false。这样的比较按如下方式进行：
```json
1、若 Type(x) 与 Type(y) 相同， 则

    1* 若 Type(x) 为 Undefined， 返回 true。
    2* 若 Type(x) 为 Null， 返回 true。
    3* 若 Type(x) 为 Number， 则

        (1)、若 x 为 NaN， 返回 false。
        (2)、若 y 为 NaN， 返回 false。
        (3)、若 x 与 y 为相等数值， 返回 true。
        (4)、若 x 为 +0 且 y 为 −0， 返回 true。
        (5)、若 x 为 −0 且 y 为 +0， 返回 true。
        (6)、返回 false。

    4* 若 Type(x) 为 String, 则当 x 和 y 为完全相同的字符序列（长度相等且相同字符在相同位置）时返回 true。 否则， 返回 false。
    5* 若 Type(x) 为 Boolean, 当 x 和 y 为同为 true 或者同为 false 时返回 true。 否则， 返回 false。
    6*  当 x 和 y 为引用同一对象时返回 true。否则，返回 false。

2、若 x 为 null 且 y 为 undefined， 返回 true。
3、若 x 为 undefined 且 y 为 null， 返回 true。
4、若 Type(x) 为 Number 且 Type(y) 为 String，返回比较 x == ToNumber(y) 的结果。
5、若 Type(x) 为 String 且 Type(y) 为 Number，返回比较 ToNumber(x) == y 的结果。
6、若 Type(x) 为 Boolean， 返回比较 ToNumber(x) == y 的结果。
7、若 Type(y) 为 Boolean， 返回比较 x == ToNumber(y) 的结果。
8、若 Type(x) 为 String 或 Number，且 Type(y) 为 Object，返回比较 x == ToPrimitive(y) 的结果。
9、若 Type(x) 为 Object 且 Type(y) 为 String 或 Number， 返回比较 ToPrimitive(x) == y 的结果。
10、返回 false。
```
简而言之就是如果类型不同，转成数字在进行对比，如果类型相同，boolean 的就正常比，string 的就比每一位的字符，对象就比是否是引用同一对象。下面是小黄书上的对比图：
![](https://proxy.qiupo.workers.dev/?https://raw.githubusercontent.com/qiupo/myImages/master/img/202202211016600.png '小红书对比图')
其中有些特殊情况，比如""==[null]是 true，因为右边的会进行强制类型转换，然后得到""，所以相等
[]==![]是 true，因为!非的操作会进行 Boolean 类型转换，但是在 js 中只有 null，undefined，0，""，NaN，false 是会转成 false，其他都是 true，所以[]会转成 true，然后非一下就是 false 然后[]==false，所以是 true
这其中对象在进行比较是会进行 toPrimitive 操作然后 valueOf()，在进行对比，如果进行了元编程修改了 toPrimitive 或者 valueOf，使其会有副作用，则对象的相等也会出现不一样的效果。
+ 修改 valueOf
```javascript
var a = 1;
Number.prototype.valueOf = () => {
  return a++;
};
var b = new Number(12);
b == 1; //true
b == 2; //true
```
+ 修改toPrimitive
```javascript
var a = 1;
Number[Symbol.toPrimitive] = () => {
  return a++;
};
var b = new Number(12);
b == 1; //true
b == 2; //true
```
