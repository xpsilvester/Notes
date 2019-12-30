# NodeJS 笔记

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