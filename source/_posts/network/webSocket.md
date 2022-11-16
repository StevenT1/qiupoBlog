---
title: webSocket
author: Taoqiupo
date: 2022-11-16 10:30:59
tags: 计算机网络
category: http
index_img: https://proxy.qiupo.workers.dev/?https://raw.githubusercontent.com/qiupo/myImages/master/img/202211161305235.png
---
## webSocket
HTML5 开始提供的一种浏览器与服务器进行全双工通讯的网络技术，属于应用层协议。它基于 TCP 传输协议，并复用 HTTP 的握手通道。
总而言之就是：
1. 可以在浏览器直接用
2. 支持双向通信
3. 性能好
### webSocket的连接
先看webSocket的
**请求头信息**
> GET ws://ruims:123456@localhost:8080/?token=123123 HTTP/1.1
Host: localhost:8080
Connection: Upgrade
Pragma: no-cache
Cache-Control: no-cache
User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36
Upgrade: websocket
Origin: http://localhost:3000
Sec-WebSocket-Version: 13
Accept-Encoding: gzip, deflate, br
Accept-Language: zh-CN,zh;q=0.9,en;q=0.8
Sec-WebSocket-Key: sXEi4SbUeCOsLZPsVA/nVQ==
Sec-WebSocket-Extensions: permessage-deflate; client_max_window_bits

他是复用http请求的握手通道，借http请求到后服务端后，一脚踹开单向的http，升级协议成webSocket，之后后续的数据帧传输都是基于websocket协议。
其中
+ Connection: Upgrade
表示要升级协议
+ Upgrade: websocket
要升级什么协议
+ Sec-WebSocket-Version: 13
表示websocket的版本
+ Sec-WebSocket-Key: sXEi4SbUeCOsLZPsVA/nVQ==
提供基本防护能力的校验

**服务器响应头**
>HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: /0ADGx6psxTUOpymObx+/Bm4GiQ=

101就表明协议切换，Sec-WebSocket-Accept是Sec-WebSocket-Key计算出来的

### websocket数据报文
[数据帧](https://proxy.qiupo.workers.dev/?https://raw.githubusercontent.com/qiupo/myImages/master/img/202211161533530.png)
其中关注的几个意义扫一下：
1. **FIN**：占据1个比特
如果是 1，表示这是消息（message）的最后一个分片（fragment），如果是 0，表示不是是消息（message）的最后一个分片（fragment）。
2. **RSV1, RSV2, RSV3**：各占 1 个比特。
一般情况下全为 0。当客户端、服务端协商采用 WebSocket 扩展时，这三个标志位可以非 0，且值的含义由扩展进行定义。如果出现非零的值，且并没有采用 WebSocket 扩展，连接出错。
3. **pcode**：4 个比特。
操作代码，Opcode 的值决定了应该如何解析后续的数据载荷（data payload）。如果操作代码是不认识的，那么接收端应该断开连接（fail the connection）。

可选的操作代码如下：
>%x0：表示一个延续帧。当 Opcode 为 0 时，表示本次数据传输采用了数据分片，当前收到的数据帧为其中一个数据分片。
>
>%x1：表示这是一个文本帧（frame）
>
>%x2：表示这是一个二进制帧（frame）
>
>%x3-7：保留的操作代码，用于后续定义的非控制帧。
>
>%x8：表示连接断开。
>
>%x9：表示这是一个 ping 操作。
>
>%xA：表示这是一个 pong 操作。
>
>%xB-F：保留的操作代码，用于后续定义的控制帧。

### 心跳处理
WebSocket 为了保持客户端、服务端的实时双向通信，需要确保客户端、服务端之间的 TCP 通道保持连接没有断开。然而，对于长时间没有数据往来的连接，如果依旧长时间保持着，可能会浪费包括的连接资源。
这个时候，可以采用心跳来实现：
浏览器->服务器：ping

服务器->浏览器：pong
ping、pong 的操作，对应的是 WebSocket 的两个控制帧，opcode 分别是 0x9、0xA。

### 实操
**服务端**
```javaScript
var app = require("express")();
var http = require("http");
var server = http.Server(app);
var wsServer = http.createServer();
var { WebSocketServer } = require("ws");
var wss = new WebSocketServer({
  noServer: true,
});
wsServer.on("upgrade", (request, socket) => {
  let keys = request;
  // 校验token
  if (request.url.split("token=")[1] !== "123123") {
    socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
    socket.destroy();
    return;
  }
  // 验证通过，继续建立连接
  wss.handleUpgrade(request, socket, "", (ws) => {
    wss.emit("connection", ws, request);
  });
});
wsServer.listen(8080);
wss.on("connection", function connection(ws, req) {
  console.log("server: receive connection.");

  ws.on("message", function incoming(message) {
    console.log("server: received: %s", message);
    ws.send("我已接收到" + message);
  });

  ws.on("pong", function (e) {
    console.log("pong");
  });
  
  ws.on("close", function () {
    console.log("客户端已断开连接");
  });
});
app.get("/", function (req, res) {
  res.sendfile(__dirname + "/demo.html");
});

app.listen(3000);

```
此处服务器端通过http创建连接，通过`upgrade`去监听切换协议的事件，再次做一个校验工作，如果校验通过才emit告知socket进行连接，不然就停止切换协议。

**客户端**
```html
<body>
    <input id='content' type="text">
    <button id="bt">发送</button>
    <input id="token" type="text" value="123123">
    <button id="bt2">重连</button>
    <p id="p"></p>
</body>
<script>
    class createWs {
        constructor(url) {
            this.ws = new WebSocket(url);
            this.ws.onopen = function () {
                console.log('ws onopen');
            }
            this.ws.onmessage = function (e) {
                console.log('ws onmessage', e);
                document.getElementById('p').innerHTML = e.data;
            };
            this.ws.onclose = function (mevt) {
                console.log('连接关闭', mevt)
            }
            this.ws.onerror = function (err){
                alert('校验错误');
            }
        }
    }
    let ws = (new createWs('ws://ruims:123456@localhost:8080?token=' + document.getElementById('token').value)).ws;
    document.getElementById('bt').addEventListener('click', () => {
        let message = document.getElementById('content').value;
        ws.send(message);
    })
    document.getElementById('bt2').addEventListener('click', () => {
        ws.close();
        let token = document.getElementById('token').value;
        ws = (new createWs('ws://ruims:123456@localhost:8080?token=' + token)).ws;
    })
</script>
```
客户端将webSocket包装起来，然后可做多次重连