---
title: RESTFULL
author: Taoqiupo
date: 2020-11-09 14:51:55
tags: 设计模式
category: restful
index_img: https://cdn.jsdelivr.net/gh/qiupo/myImages/img/20201204145953.png
---
## 什么是RESTFUL架构
REST代表`Respersontational State Transfer`，通常理解为表现层状态转移，他是围绕资源展开的，每个组件都是资源，都是可以通过唯一的URL访问到的，REST体系将所有的内容都视为资源，这些资源可以是文本、HTML页面、图像、视频或者业务数据。`REST Server`只提供对资源的访问，`REST Client`访问和修改这些资源，REST可以使用各种的形式来表现这些资源，主要是使用JSON，也可以是Text或者XML。
## REST的约束条件
### 客户端-服务器
&emsp;&emsp;通过将用户接口和数据存储的问题分开，提高了接口的可移植性。
### 无状态
&emsp;&emsp;`RESTful Web`服务不应该在服务器保存客户端的状态，这种限制被称为无状态，客户端负责把上下文传递给服务器，然后服务器去存储他的上下午以供服务器进行进一步的处理和请求，比如我们需要获得某个用户的信息，我们应该是通过客户端传递userId给服务器，服务器处理好了返回结果给我们，对服务器而言他不知道每次的状态是什么。这样可以使得Web服务不需要维护客户端以前的交互（因为他不知道这个客户端之前干嘛了）
### 可缓存
&emsp;&emsp;指客户端应该将服务器的响应存储在客户端本身中，如此客户端无需一次又一次的向服务器请求相同的资源。同事服务器响应应该有如何进行缓存的信息，以方便客户端在一段时间内进行缓存响应。如以下服务器应该具备的响应头以便客户端配置缓存

| Sr.No.| Header & Description|
|---|---|
|1|**Date**<br/>资源创建的日期和时间|
|2|**Last Modified**<br/>资源上次修改的日期和时间|
|3|**Cache-Control**<br>用于控制缓存的主标记头|
|4|**Expires**<br/>缓存的到期日期和时间|
|5|**Age**<br/>从服务器获得资源后的持续时间|

|Sr.No.|Directive & Description|
|---|---|
|1|**Public**<br/>公共的可缓存资源|
|2|**Private**<br/>表示资源只可以被客户端和服务器缓存，中介不能缓存的资源|
|3|**no-cache/no-store**<br/>指资源不可以缓存|
|4|**max-age**<br/>表示缓存的最长有效期。超过事件后就需要客户端再次请求|
|5|**must-revalidate**<br/>在超过有效期后，服务器必须重新验证资源|

## RESTful传递消息的方式
&emsp;&emsp;因为REST的无状态限制，HTTP无状态协议和他很契合。客户端通过HTTP请求发送消息，服务器以HTTP形式响应。常见的有四种动作：GET,POST,PUT,DELETE其中要考虑的是：
+ GET操作是只读的并且是安全的。
+ PUT和DELETE操作是幂等的，这意味着无论调用多少次这些操作，其结果都将始终相同。
+ PUT和POST操作几乎相同，不同之处仅在于PUT操作是幂等的，而POST操作可能导致不同的结果
## 关于RESTful架构的寻址要求
寻址是指定位服务器上的一个或者多个资源。因为REST架构的每个资源都通过URL来标识，所以关于寻址的URL我们需要考虑以下几点：
+ 使用复数名词定义
例如，我们要访问用户资源应该使用users而不是user
+ 避免使用空格而使用_或者-代替
+ 使用小写字母
+ 保持向后兼容
&emsp;&emsp;因为一些Web服务一旦上线，可能需要保证始终可用，一旦我们的资源移动了位置，我们需要通过HTTP的3xx状态告知客户端将就URL重定向新的URL
+ 使用HTTP动词，URL不包含动词
我们使用POST、GET等动词来表示请求方式，之后的URL里的资源应该使用名词来形容，比如我们需要获得User信息，`../UserManagement/rest/UserService/getUser/1`，其中使用`getUser`是不太好的，因为使用`UserManagement/rest/UserService/users/1`，来形容我们的资源。
参考自：[restful](https://www.tutorialspoint.com/restful/restful_addressing.htm)