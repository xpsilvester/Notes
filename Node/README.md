# NodeJS 笔记

## Node简介

### 单线程

Node保持了JavaScript在浏览器中单线程的特点。

- 好处：不用像多线程编程那样需要在意状态的同步问题，没有死锁，也没有线程上下文交换的性能开销
- 弱点：1.无法利用多核CPU 2.错误会引起整个应用退出 3.大量计算占用CPU导致无法继续调用异步I/O

Node采用了与Web Worker相同的思路来解决单线程中大计算量的问题：`child_process`

### 应用场景

- I/O密集型

  I/O密集的优势主要在Node利用事件循环的处理能力，不是启动每一个线程为每一个请求服务，资源占用极少。

- CPU密集型

  由于单线程原因，如果有长时间运行的计算（比如大循环），将会导致CPU时间片不能释放，使得后续I/O无法发起。但是适当调整和分解大型运算任务为多个小任务，使得运算能够适时释放，不阻塞I/O调用的发起，这样既可同时享受并行异步I/O的好处，又能充分利用CPU。

Node虽然没有提供多线程用于计算，但是有两种方法可以充分利用CPU。

- 编写C/C++扩展的方式
- 通过子进程方式

### [雪崩问题](#利用事件队列解决雪崩问题)

#### 利用事件队列解决雪崩问题

雪崩问题就是在浏览器缓存失效后，并发访问量大量涌入数据库执行查询操作，导致数据库无法同时承受如此大的访问量，从而影响网站效果。

通过将请求的回调函数压入事件队列中来解决雪崩的办法，核心代码如下：

```JavaScript
var proxy = new EventProxy();
var status = "ready";
var select = function (callback) {
    proxy.once("selected", callback);
    if (status === "ready") {
        status = "pending";
        db.select("SQL", function (results) {
            proxy.emit("selected", results);
            status = "ready";
        });
    }
};
```