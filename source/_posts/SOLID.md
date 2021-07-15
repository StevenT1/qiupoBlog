---
title: SOLID
author: Taoqiupo
date: 2020-11-09 14:00:39
tags: 设计模式
category: solid
index_img: https://cdn.jsdelivr.net/gh/qiupo/myImages/img/20201204151248.png
---
## 设计模式之SOLID原则
&emsp;&emsp;SOLID原则是为了让程序员更加轻松的开发出易于维护和拓展的软件，避免代码的冗杂，让我们可以很轻松的重构代码。`SOLID`原则的五大原则分别为：
## 单一职责原则(Single Responsibility Principle, SRP)
&emsp;&emsp;`SRP`简单来说就是解耦，类似于工厂里的分工方式，每个工人只需要做好一件事就可以了（当然现在这个社会其实每个人不能只会一样，不利于个人发展的），对于我们软件中的类来说也是这样的，每个类只需要负责某一方面的职责即可，如此可以方便我们对这些类进行复用，组合。实现高内聚低耦合的设计原则。不过因为将功能进行了较为细致的拆分，所以在需要进行大面积修改时可能会有不小的工作量。
## 开闭原则(Open-Closed Principle, OCP)
对象应该可以进行扩展，但是不能进行修改。软件的需求发生改变后，我们的系统应该保持设计框架的稳定，不能因为一个需求的修改出现大量的更改，当我们的软件符合开闭原则之后，我们可以对某个需要修改的组件对象进行扩展，而不用修改现有的代码，降低了维护成本。
## 里氏代换原则(Liskov Substitution Principle)
&emsp;&emsp;里氏替换原则是Liskov提出的关于继承的一些原则。Robert C. Martin简化的说过里氏替换原则就是***Subtypes must be substitutable for their base types***，就是说子类必须能够替换他们的基类。因此我们需要注意以下几点：
+ 子类必须实现父类的抽象方法，但不得重写（覆盖）父类的非抽象（已实现）方法。
+ 子类中可以增加自己特有的方法。
+ 当子类覆盖或实现父类的方法时，方法的前置条件（即方法的形参）要比- 父类方法的输入参数更宽松。(即只能重载不能重写)
+ 当子类的方法实现父类的抽象方法时，方法的后置条件（即方法的返回值）要比父类更严格。
  
```
class father{
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  sum() {
    return this.x+this.y;
  }
}
class son extends father{
    constructor(x,y){
    super(x,y);
  }
  minus(x,y){
    return this.x-this.y;
  }
}
let fat = new father(1,2)
let so = new son(1,2)
console.log(fat.sum(),so.sum(),so.minus());
// 3  3  -1
//父类被子类替换后结果也是一样的
```
## 依赖倒置原则(Dependence Inversion Principle,DIP)
&emsp;&emsp;实体必须依赖抽象而不依赖具体。高级模块一定不能依赖于低级模块，而应该依赖于抽象。简单来说就是将我们平时的依赖反转，不再是高级模块去依赖低级模块，而是低级模块反向依赖一个抽象类，然后高级模块也依赖于这个抽象类。从而剥离模块之间的关联，达到了解耦的目的。关于这块还有一个IOC控制反转，利用容器将控制权反转，将对象的获得等控制权交给容器，如此来降低耦合。
## 接口隔离原则(Interface Segregation Principle, ISP)
&emsp;&emsp;要为各个类建立它们需要的专用接口，而不要试图去建立一个很庞大的接口供所有依赖它的类去调用。
参考于：[更详细的六大设计原则](https://www.jianshu.com/p/3268264ae581)