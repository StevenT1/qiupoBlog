---
title: 输入url到出现内容的流程
author: Taoqiupo
date: 2022-02-11 11:16:56
tags: 浏览器系列
category:   浏览器
index_img: https://proxy.qiupo.workers.dev/?https://raw.githubusercontent.com/qiupo/myImages/master/img/202202141333361.png
---
## 浏览器点击链接后的流程
处理流程：
1、输入网址并回车
2、通过DNS解析域名，得到地址给浏览器
3、浏览器发送HTTP请求
4、服务器处理请求
5、服务器返回HTML响应
6、浏览器处理HTML页面
7、继续请求其他资源
8、重排重绘
![](https://proxy.qiupo.workers.dev/?https://raw.githubusercontent.com/qiupo/myImages/master/img/20201124110413.png)

&emsp;&emsp;计算器IO接收到输入的值，并且浏览器接收到指令，从此开始我们的冲浪之旅。  
   1. 解析url
   浏览器先要弄懂用户输入的东西是个什么玩意，才能进行接下来的操作
   ![](https://proxy.qiupo.workers.dev/?https://raw.githubusercontent.com/qiupo/myImages/master/img/202202111049837.jpeg '绝对url格式')
   上图还是很好理解的，那么当浏览器理解了用户输入了什么之后，他就迈出第一步了。
   
   ...待续