# NodeJS 知识总结

## [Node简介](https://www.jianshu.com/p/05a68ca78f77)

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

## [模块机制](https://www.jianshu.com/p/20f73da34044)

### Node的模块实现

在Node中引入模块，需要经历如下3个步骤：

- 路径分析，`require()`方法接受一个标识符作为参数。在Node实现中，正是基于这样一个标识符进行模块查找的。模块标识符主要分为以下几类：
  - 核心模块，如http、fs、path等
  - `.`或`..`开始的相对路径文件模块
  - 以`/`开始的绝对路径文件模块
  - 非路径形式的文件模块，如自定义的`connect`模块
- 文件定位
  - 文件扩展名分析：CommonJS模块规范允许在标识符不包含文件扩展名，这种情况下，Node会按.js、.json、.node的次序补足扩展名，依次尝试
  - 目录分析和包：在分析标识符的过程中，`require()`通过分析文件扩展名之后，可能没有查找到对应文件，但却得到一个目录，这在引入自定义模块和逐个模块路径进行查找时经常会出现，此时Node会将目录当作一个包来处理。
- 编译执行，编译和执行是引入文件模块的最后一个阶段。定位到具体的文件后，Node会新建一个模块对象，然后根据路径载入并编译。对于不同扩展名的文件：
  - `.js`文件。通过fs模块同步读取文件后编译执行。
  - `.node`文件。这是用C/C++编写的扩展文件，通过`dlopen()`方法加载最后编译生成的文件。
  - `.json`文件。通过fs模块同步读取文件后，用`JSON.parse()`解析返回结果。
  - 其余扩展名文件。它们都被当成.js文件载入。

在Node中，模块分为两类：

- Node提供的模块，称为核心模块：在Node源代码编译过程中，编译进了二进制执行文件。在Node进程启动时，部分核心模块就被直接加载进内存中，所以这部分模块引入时，文件定位和编译执行这两个步骤可以省略掉，并且在路径分析中优先判断，所以它的加载速度是最快的。核心模块分为两类：
  - JavaScript核心模块
  - C/C++核心模块
- 用户编写的模块，称为文件模块：在运行时动态加载，需要完整的路径分析、文件定位、编译执行过程，速度比核心模块慢。

### [模块化规范](https://juejin.im/post/6844903744518389768)

#### CommonJS，AMD，CMD区别

- CommonJS是用在服务器端的，同步的，如nodejs 
- AMD, CMD是用在浏览器端的，异步的，如requirejs和seajs 
- CommonJS： 每个文件就是一个模块，不用define进行定义，node使用此规范
- AMD： 使用define定义一个模块，讲究提前依赖
- CMD： 使用define定义模块，将就就近依赖

#### ES6中import和require区别

- CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
- CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。
- ES6 模块的运行机制与 CommonJS 不一样。ES6 模块是动态引用，并且不会缓存值，模块里面的变量绑定其所在的模块。

#### exports 和 module.exports 的区别

- exports也是一个对象引用，它与module.exports默认指向同一个对象
- require引入的实际时module.exports，而如果对module.exports重新赋值时，就切断了它与原来对象的联系exports不会一起改变
- 通常使用exports = module.exports = somethings 修复，使它们指向同一个对象

## [异步I/O](https://www.cnblogs.com/tangzhirong/p/6910776.html)

### Node的异步I/O模型

主要分为**事件循环、观察者、请求对象、执行回调**是四个核心概念。

- **事件循环**：进程启动时，Node会创建一个类似while（true）的循环，判断是否有事件需要处理，若有，取出事件并执行回调函数。
- **观察者**：观察者是用来判断是否有事件需要处理。事件循环中有一到多个观察者，判断过程会向观察者询问是否有需要处理的事件。这个过程类似于饭店的厨师与前台服务员的关系。厨师每做完一轮菜，就会向前台服务员询问是否有要做的菜，如果有就继续做，没有的话就下班了。这一过程中，前台服务员就相当于观察者，她收到的顾客点单就是回调函数。 注：事件循环是一个典型的**生产者/消费者模型**。异步I/O、网络请求是生产者，而事件循环则从观察者那里取出事件并处理。
- **请求对象**：实际上，从JavaScript发起调用到内核执行完I/O操作的过渡过程中，存在一种中间产物，叫做请求对象。
- **执行回调**：组装好请求对象，送入I/O线程池等待执行，实际上完成了异步I/O的第一部分，回调通知是第二部分。当线程池中有可用线程的时候调用uv_fs_thread_proc方法执行。该方法会根据传入的类型调用相应的底层函数，以uv_fs_open为例，实际会调用到fs__open方法。调用完毕之后，会将获取的结果设置在req->result上。然后调用PostQueuedCompletionStatus通知我们的IOCP*对象操作已经完成，并将线程归还给线程池。

### [浏览器与Node的事件循环(Event Loop)有何区别?](https://juejin.im/post/5c337ae06fb9a049bc4cd218)

Node端，microtask 在事件循环的各个阶段之间执行
* timers 阶段：这个阶段执行timer（setTimeout、setInterval）的回调
* I/O callbacks 阶段：处理一些上一轮循环中的少数未执行的 I/O 回调
* idle, prepare 阶段：仅node内部使用
* poll 阶段：获取新的I/O事件, 适当的条件下node将阻塞在这里
* check 阶段：执行 setImmediate() 的回调
* close callbacks 阶段：执行 socket 的 close 事件回调

浏览器端，microtask 在事件循环的 macrotask 执行完之后执行

## [异步编程](https://www.jianshu.com/p/a6d24bbde25b)

### 事件发布/订阅模式

事件监听器模式是一种广泛用于异步编程的模式， 是回调函数的事件化，又称发布/订阅模式， node自身提供events模块，是该模式的一个简单实现。

#### [雪崩问题](#利用事件队列解决雪崩问题)

##### 利用事件队列解决雪崩问题

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

### Promise/Deferrd模式

在2009年被Kris Zyp抽象为一个提议草案，发布在CommonJS规范中， 目前，CommonJS草案中已经包括Promise/A、Promise/B、Promise/D这些异步模型。由于Promise/A较为常用也较为简单，只需要具备then()方法即可。promise模式比发布/订阅模式略为优雅， 但还不能满足很多场景的实际需求，比如一组纯异步的API为了协同完成一串事情。 

![promise](https://images0.cnblogs.com/blog/561852/201410/271018590652792.png)

### 流程控制库

#### 尾触发与next

尾触发目前应用最多的地方是Connect的中间件， 中间件处理网络请求时，可以向面向切面编程一样进行过滤、验证、日志等功能，最简单的中间件如下：

```js
function(req, res, next) {
     //中间件     
}
```

每个中间件传递请求对象、响应对象和尾触发函数，通过队列形成一个处理流，如下：

![中间件](https://images0.cnblogs.com/blog/561852/201410/271040180508354.png)

#### async

目前最知名的流程控制模块，async模块提供了20多个方法用于处理异步的多种写作模式。

#### Step

轻量的async， 在API暴露上也具备一致性， 因为只有一个接口Step。 

#### Wind

与以上几个思路完全不同的异步编程方案。

对比几种方案的区别：事件发布/订阅模式相对是一种原始的方式，Promise/Deferred模式贡献了一个非常不错的异步任务模型的抽象，重头在于封装异步的调用部分， 而流程控制库则要灵活很多。

除了async、step、EventProxy、wind等方案外，还有一类通过源代码编译的方案来实现流程控制的简化， streamline是一个典型的例子。

## [内存控制](https://www.jianshu.com/p/10f34e46dacf)

![内存控制](http://images.cnblogs.com/cnblogs_com/xing901022/765052/o_NodeJS%20%E5%86%85%E5%AD%98%E6%8E%A7%E5%88%B6.png)

### 垃圾回收机制

- nodejs在执行JavaScript时，内存受到v8限制,64位约为1.4g,32位0.7g

- 所有js对象是通过堆分配，查看process.memoryUsage()

- 限制内存原因：垃圾回收时，js线程会暂停执行（避免JS应用逻辑与垃圾回收器看到的不一样），大量的堆内存回收严重影响性能

- v8内存整体包含新生代和老生代

  ```js
    // 调整内存限制的大小
    node --max-old-space-size=1700 test.js // 单位为MB 
    node --max-new-space-size=1024 test.js // 单位为KB
  
    //在V8初始化时生效,一旦生效不能动态变化  
  ```

#### 新生代

- 由两个reserved_semispace_size_（32位16mb,62位32mb）构成
- 通过Scavenge算法进行回收，具体实现采用Cheney算法

优点是时间短、缺点是只能使用一半堆内存。新生代对象生命周期短，适合此算法

#### 老生代

- 在64未系统下为1400 MB,在32为700 MB
- 使用Mark-Sweep和Mark-Compact进行垃圾回收

 v8主要使用Mark-Sweep,在空间不足以对新晋升对象分配时才用Mark-Compact

##### 增量标记(incremental marking)

- 降低老生代的全堆垃圾回收带来的时间停顿
- 从标记阶段入手，拆分为许多小步进，与应用逻辑交替运行
- 垃圾回收最大停顿时间降为原来的1/6

垃圾回收是影响性能的因素之一，要尽量减少垃圾回收，尤其全堆垃圾回收

##### 查看垃圾回收日志

- 在启动时添加--trace_gc

启动时使用--prof,可以得到v8性能分析数据，包含垃圾回收占用的时间，需要使用工具读取，在Node源码的deps/v8/tools，linux-tick-processor

### 高效使用内存

#### 作用域

- js中能形成作用域的有函数调用、with和全局作用域
- 标识符查找（即变量名） 先查找当前作用域，再向上级作用域，一直到全局作用域
- 变量主动释放 全局变量要直到进程退出才释放，导致引用对象常驻老生代，可以用delete删除或者赋undefined、null(delete删除对象的属性可能干扰v8,所以赋值更好)

#### 闭包

- 外部作用域访问内部作用域的方法，得益于高阶函数特性
- 把闭包赋值给一个不可控的对象时，会导致内存泄漏。使用完，将变量赋其他值或置空

### 查看内存使用情况

- 查看进程内存占用 process.memoryUsage(),其中rss为进程的常驻内存（node所占的内存），heapTotal、heapUsed为堆内存使用情况
- os.totalmem(),os.freemem() 查看系统内存

```
Node使用的内存不是都通过v8分配，还有堆外内存,用于处理网络流、I/O流
```

###  内存泄漏

```
造成的原因：缓存、队列消费不及时、作用域未释放
```

#### 缓存

- 限制内存当缓存，要限制好大小，做好释放
- 进程之间不能共享内存，所以用内存做缓存也是

```
为了加速模块引入，模块会在编译后缓存，由于通过exports导出(闭包),作用域不会释放，常驻老生代。要注意内存泄漏
```

#### 队列状态

- 在生产者和消费者中间
- 监控队列的长度，超过长度就拒绝
- 任意的异步调用应该包含超时机制

### 内存泄漏排查

- node-heapdump
- node-memwatch

### 大内存应用

- 使用stream模块处理大文件，fs的createReadStream(),createWriteStream()
- 在不需要进行字符串操作时，可以不借助v8，使用Buffer操作，这样不会受到v8的内存限制

## [理解Buffer](https://www.jianshu.com/p/e3f14cdf78f1)

![Buffer](https://images2015.cnblogs.com/blog/449064/201601/449064-20160107211644028-1641537291.png)

- JavaScript 语言没有读取或操作二进制数据流的机制。 
- `Buffer` 类被引入作为 Node.js API 的一部分，使其可以在 TCP 流或文件系统操作等场景中处理二进制数据流。
- Buffer就是解决了V8之前应用于浏览器端偏小内存的限制，而直接在底层堆外申请大内存，但是又怕现用现申请增加CPU负载，所以采用了分块申请的形式。
- buffer对象类似于数组，他的元素都是16进制的两位数，即0~255的数值

### buffer内存分配

buffer不同v8申请内存，它通过node的c++模块申请内存。因此，buffer的内存策略是由c++申请内存，然后，在js中分配内存。因为，处理大量的字节数据不能采用需要一点内存就向操作系统申请一点内存的方式，这可能造成大量的内存申请的系统调用，对操作系统有一定压力。

node采用了slab的分配机制，slab其实就是一块申请好的固定内存区域，它有3种状态：

- full：完全分配状态
- partial：部分分配状态
- empty：没有被分配状态

### Buffer的转换

Buffer对象可以和字符串进行相互转换，支持的编码类型有：ASCII、UTF-8、UTF-16LE/UCS-2、Base64、Binary、Hex

#### 字符串转Buffer

通过构造函数来完成，new Buffer(str,[encoding]);encoding默认为utf-8类型的编码和存储。

#### Buffer转字符串

只需要toString()即可。

#### Buffer不支持的编码类型

我们可以通过调用`Buffer.isEncoding(encoding)`来看是否支持某种编码。对于不支持的编码格式，可以使用iconv和iconv-lite来解决。

### Buffer的拼接

data事件中获取的chunk对象其实就是buffer对象。这里需要注意的是data += chunk;这句话，也就拼接buffer。其实质是data = data.toString() + chunk.toString();。这里其实对于中文的支持就会存在问题。因为，默认为utf-8的读取，因此，第四个字，只能显示一半。也就造成了乱码的产生。这个问题值得注意。

为了解决上文中的乱码问题，我们应该设置一些编解码格式：

```js
readable.setEncoding(encoding)
var rs = fs.createReadStream('test.md', { highWaterMark: 11});
rs.setEncoding('utf8');
```

我们来看一下这个例子，它对拼接buffer做了改进：

```js
var chunks = [];
var size = 0;
res.on('data', function (chunk) {
    chunks.push(chunk);
    size += chunk.length;
});
res.on('end', function () {
    var buf = Buffer.concat(chunks, size);
    var str = iconv.decode(buf, 'utf8');
    console.log(str);
});
```

正确的拼接方式，是用一个数组来存储接收到的所以buffer片段，然后调用buffer.concat()合成一个buffer对象。

### Buffer与性能

buffer在文件io和网络io中具有广泛应用，不管是什么对象，一旦进入到网络传输中，都需要转换为buffer，然后以二进制进行数据传输。因此，提供io效率，可以从buffer转换入手。

## [网络编程](https://www.jianshu.com/p/0c77d59ec2d0)

![network](https://images2015.cnblogs.com/blog/449064/201601/449064-20160113225947507-1610291086.png)

### 创建TCP服务器端程序

```js
var net = require('net');
var server = net.createServer(function (socket) {
    // 新的连接
    socket.on('data', function (data) {
        socket.write("hello") ;
    });
    socket.on('end', function () {
        console.log('连接断开');
    });
    socket.write("hello world，my dear\n");
});
server.listen(8124, function () {
    console.log('server bound');
});

//为了体现listener是连接事件connection的监听器，也可以采用另外一种方式进行监听
var server = net.createServer();
server.on('connection', function (socket) {
 // 新的连接
});
server.listen(8124);
```

### 管道操作

```js
var net = require('net');
var server = net.createServer(function (socket) {
socket.write('Echo server\r\n');
socket.pipe(socket);
});
server.listen(1337, '127.0.0.1');
```

### 创建udp服务器端

```js
var dgram = require("dgram");
var server = dgram.createSocket("udp4");
server.on("message", function (msg, rinfo) {
    console.log("server got: " + msg + " from " +
        rinfo.address + ":" + rinfo.port);
});
server.on("listening", function () {
    var address = server.address();
    console.log("server listening " +
        address.address + ":" + address.port);
});
server.bind(41234);
```

### 构建HTTP服务

```js
var http = require('http');
http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello World\n');
}).listen(1337, '127.0.0.1');
console.log('Server running at http://127.0.0.1:1337/');
```

### 构建websocket服务

websocket与传统的b/s模式有如下好处：

- 让b端与服务器建立tcp连接，减少连接数
- 服务器实现了向b端推送数据的需求
- 更轻的头协议，减少数据传输

### 网络服务与安全

node在网络安全方面提供了crypto、tls、https三个模块，crypto用于加密解密，例如sha1、md5等加密算法，tls用于建立一个基于TLS/SSL的tcp链接，它可以看成是net模块的加密升级版本。https用于提供一个加密版本的http，也是http的加密升级版本，甚至提供的接口和事件也跟http模块一样。

## [构建web应用](https://www.jianshu.com/p/9e52bf24b6e5)

![web](https://images2015.cnblogs.com/blog/449064/201601/449064-20160118214020953-950486535.png)



## [玩转进程](https://www.jianshu.com/p/335a9e101c3f)

![process](https://images2015.cnblogs.com/blog/449064/201601/449064-20160120210224625-991406811.png)

### 多进程架构

面对单进程单线对多核使用不足的问题，前人的经验是启动多个进程，理想状态下，每个进程各自利用一个cpu，以此实现多核cpu的利用。node提供了child_process模块，并提供了child_process.fork()函数来实现进程的复制。我们来看一下代码：

```js
//worker.js
var http = require('http');
http.createServer(function (req, res) {
   res.writeHead(200, {'Content-Type': 'text/plain'});
   res.end('Hello World\n');
}).listen(Math.round((1 + Math.random()) * 1000), '127.0.0.1');
```

这段代码，是node启动web服务的经典代码，然后我们根据master-workers的架构，来添加master.js模块。

```js
//master.js
var fork = require('child_process').fork;
var cpus = require('os').cpus();
for (var i = 0; i < cpus.length; i++) {
	fork('./worker.js');
}
```

这里存在两个进程，master是主进程、worker是工作进程。

![master-worker](https://upload-images.jianshu.io/upload_images/3112582-79abbc15340995a6.png?imageMogr2/auto-orient/strip|imageView2/2/w/611/format/webp)

### 创建子进程

child_process模块给予了node随意创建子进程（child_process）的能力，它提供了4个方法用于创建子进程。

```js
var cp = require('child_process');
cp.spawn('node', ['worker.js']);
cp.exec('node worker.js', function (err, stdout, stderr) {
// some code
});
cp.execFile('worker.js', function (err, stdout, stderr) {
// some code
});
cp.fork('./worker.js');
```

![child_process api](https://upload-images.jianshu.io/upload_images/3112582-df96bbea6ee2b4bb.png?imageMogr2/auto-orient/strip|imageView2/2/w/1041/format/webp)

### 进程间通信

通过fork()或其他api创建子进程后，为了实现父子进程之间的通信，父进程与子进程之间将会创建IPC通道，通过IPC通道，父子进程之间才能通过message和send()传递消息。

```js
// parent.js
var cp = require('child_process');
var n = cp.fork(__dirname + '/sub.js');
n.on('message', function (m) {
    console.log('PARENT got message:', m);
});
n.send({ hello: 'world' });
// sub.js
process.on('message', function (m) {
    console.log('CHILD got message:', m);
});
process.send({ foo: 'bar' });
```

### 进程间通信原理

IPC的全称是Inter-Process Communication，即进程间通信。进程间通信的目的是为了让不同的进程能够互相访问资源，并进程协调工作。父进程在实际创建子进程前，会创建IPC通道并监听它，然后才真正创建出子进程，并通过环境变量（NODE_CHANNEL_FD）告诉子进程这个IPC通信的文件描述符。子进程在启动的过程中，根据文件描述符去连接这个已存在的IPC通道，从而完成父子进程之间的连接。

![ipc](https://upload-images.jianshu.io/upload_images/3112582-0c77f3df39874968.png?imageMogr2/auto-orient/strip|imageView2/2/w/425/format/webp)

![ipc2](https://upload-images.jianshu.io/upload_images/3112582-d87533b1fa9635f7.png?imageMogr2/auto-orient/strip|imageView2/2/w/421/format/webp)

### 句柄传递

node0.5.9之后引入了进程间发送句柄的功能，send()方法除了能够通过IPC发送数据外还能发送句柄，第二个可选参数就是句柄:

```js
child.send(message, [sendHandle])
```

句柄是一种可以用来标识资源的引用，它的内部包含了指向对象的文件描述符。因此，句柄可以用来标识一个服务端的socket对象、一个客户端的socket对象、一个udp套接字、一个管道等

这个句柄就解决了一个问题，我们可以去掉代理方案，在主进程接收到socket请求后，将这个socket直接发送给工作进程，而不重新与工作进程之间建立新的socket连接转发数据。我们来看一下代码实现：

```js
// parent.js
var cp = require('child_process');
var child1 = cp.fork('child.js');
var child2 = cp.fork('child.js');
// Open up the server object and send the handle
var server = require('net').createServer();
server.on('connection', function (socket) {
    socket.end('handled by parent\n');
});
server.listen(1337, function () {
    child1.send('server', server);
    child2.send('server', server);
});
//然后打印出来

// child.js
process.on('message', function (m, server) {
    if (m === 'server') {
        server.on('connection', function (socket) {
            socket.end('handled by child, pid is ' + process.pid + '\n');
        });
    }
});
```

![句柄1](https://upload-images.jianshu.io/upload_images/3112582-ec6313e34ca79485.png?imageMogr2/auto-orient/strip|imageView2/2/w/565/format/webp)

这个可以在父进程和子进程之间来回处理了。现在这个是tcp层面的转化，我们之后选择用http层面来再次试试。

```js
// parent.js
var cp = require('child_process');
var child1 = cp.fork('child.js');
var child2 = cp.fork('child.js');
// Open up the server object and send the handle
var server = require('net').createServer();
server.listen(1337, function () {
    child1.send('server', server);
    child2.send('server', server);
    // 关掉
    server.close();
});

//修改一下子进程
// child.js
var http = require('http');
var server = http.createServer(function (req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('handled by child, pid is ' + process.pid + '\n');
});
process.on('message', function (m, tcp) {
    if (m === 'server') {
        tcp.on('connection', function (socket) {
            server.emit('connection', socket);
        });
    }
});
```

这样一来，请求都是由子进程处理，看一下整个过程中，服务的过程发送了一次改变。主进程发送完句柄，并关闭监听之后，就变成了如下结构：

![句柄2](https://upload-images.jianshu.io/upload_images/3112582-b1fd3aea0c24a19e.png?imageMogr2/auto-orient/strip|imageView2/2/w/487/format/webp)

### 句柄发送与还原

发送到IPC管道中的实际上是我们要发送的句柄文件描述符，文件描述符实际上是一个整数值，这个message对象在写入到IPC通道时，也会通过JSON.stringify()进行序列化，所以最终发送到IPC通道中的信息都是字符串，send()方法能发送消息和句柄并不意味着它能发送任意对象。

连接了IPC通道的子进程可以读取到父进程发来的消息，将字符串通过JSON.parse()解析还原为对象后，才出发message事件将消息体传递给应用层使用，在这个过程中，消息对象还要被进行过滤处理，message.cmd的值如果以NODE_为前缀，它将响应一个内部事件internalMessage

如果message.cmd值为NODE_HANDLE，它将取出message.type的值和得到的文件描述符一起还原出一个对应的对象。这个过程的示意图如下：

![句柄发送与还原](https://upload-images.jianshu.io/upload_images/3112582-b76b1e5bf164c2f2.png?imageMogr2/auto-orient/strip|imageView2/2/w/439/format/webp)

### 端口共同监听

在node句柄发送的过程中，多个进程可以监听到相同的端口，而不引起EADDRINUSE异常，这是因为，我们独立启动的进程中，tcp服务端套接字socket的文件描述符并不相同，导致监听相同的端口时会抛出异常，但是node底层对每个端口监听都设置了SO_REUSEADDR选项，这个选项的涵义是不同进程可以就相同的网卡和端口进行监听，这个服务器端套接字可以被不同的进程复用：

```js
setsockopt(tcp->io_watcher.fd, SOL_SOCKET, SO_REUSEADDR, &on, sizeof(on))
```

由于独立启动的进程互相之间并不知道文件描述符，所以监听相同端口就会失败，但对于send()发送的句柄还原出来的服务而言，他们的文件描述符是相同的，所以监听相同端口不会引起异常。

多个应用监听相同端口时，文件描述符同一时间只能被某个进程所用，换言之就是网络请求向服务器端发送时，只有一个幸运的进程能够抢到连接，也就是说只有他能为这个请求进行服务。这些进程也都是抢占式的。

### 集群稳定之路

#### 进程事件

| 事件名     | 说明                                                         |
| ---------- | ------------------------------------------------------------ |
| error      | 当子进程无法被复制创建、无法被杀死、无法发送消息时会触发该事件 |
| exit       | 子进程退出时触发该事件，子进程如果是正常退出，这个事件的第一个参数为退出码，否则为null，如果进程是通过kill()方法被杀死的，会得到第二个参数，它表示杀死进程时的信号 |
| close      | 在子进程的标准输入输出流中止时触发该事件，参数与exit相同     |
| disconnect | 在父进程或子进程中调用disconnect()方法时触发该事件，在调用该方法时将关闭监听IPC通道 |

#### 自动重启

![自动重启](https://upload-images.jianshu.io/upload_images/3112582-b4a78383b68c23d8.png?imageMogr2/auto-orient/strip|imageView2/2/w/347/format/webp)

一旦有未捕获的异常出现，工作进程就会停止接收新的连接，当所以连接断开后，退出进程，主进程在监听到工作进程的exit后，将立即启动新的进程服务，以此保证整个集群中总是有进程再为用户服务。

#### 自杀信号（suicide）

工作进程在得知要退出时，向主进程发送一个自杀信号，然后才停止接收新的连接，当所有连接断开后再退出。主进程在接收到自杀信号后，立即创建新的工作进程服务

#### 限量重启

在极端情况下，进程有可能会频繁重启，极有可能是编写的代码有问题。为了消除这种无意义的重启，在满足一定规则的限制下，不应当反复重启。比如在单位时间内规定只能重启多少次，超过限制就触发giveup事件，告知放弃重启工作进程这个重要事件。

### 负载均衡

node默认提供的机制是采用操作系统的`抢占式策略`，就是在一堆工作进程中，闲着的进程对到来的请求进行抢占，谁抢到，谁服务。但是，node的抢占策略是根据cpu的繁忙程度而定的，因此会出现IO繁忙，但是cpu空闲的情况。因此，node v0.11提供了一种新的策略，`Round-Robin（轮叫调度）`。轮叫调度由主进程接受连接，将其依次分发给工作进程，分发的策略是在N个工作进程中，每次选择第i=(i+1)modn个进程来发送连接。

### 状态共享

进程间的数据是不能共享的，但是，配置文件、session之类的数据应该是一致的。因此，一般采用第三方数据存储的方案进行功能扩展。也就利用db、文件、缓存来共享状态和数据。我们可以使用子进程定时轮询的方式来同步状态，这是用资源换功能的一种方式，会有大量的资源浪费、并发、数据延时等情况的出现。

![状态共享1](https://upload-images.jianshu.io/upload_images/3112582-c467739824841a23.png?imageMogr2/auto-orient/strip|imageView2/2/w/333/format/webp)

另外一种就是主动通知，也就是减少轮询，让轮询只在消息队列层面出现，其他功能都基于事件的调度和触发来实现。我们将这种用来发送通知和查询状态是否更改的进程叫做通知进程，这个进程应该设计为，只进行轮询和通知，不处理任何业务逻辑。

![状态共享2](https://upload-images.jianshu.io/upload_images/3112582-a0b0c1b125742cde.png?imageMogr2/auto-orient/strip|imageView2/2/w/347/format/webp)

### cluster模块

node0.8后，在内核中增加了cluster模块，这是因为child_process要做单机集群需要处理的事情太多了，因此，才会给cluster这个核心模块。cluster可以更方便的解决多cpu的利用问题，同时也提供了较完善的api，用以处理进程的健壮性问题

```js
var cluster = require('cluster');
var http = require('http');
var numCPUs = require('os').cpus().length;
if (cluster.isMaster) {
    // Fork workers
    for (var i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on('exit', function (worker, code, signal) {
        console.log('worker ' + worker.process.pid + ' died');
    });
} else {
    // Workers can share any TCP connection
    // In this case its a HTTP server
    http.createServer(function (req, res) {
        res.writeHead(200);
        res.end("hello world\n");
    }).listen(8000);
}
```

### Cluster工作原理

cluster模块是child_process和net模块组合起来的一个功能封装，cluster启动时，会在内部启动TCP服务器（只能启动一个tcp服务），在cluster.fork()子进程时，将这个tcp服务器端socket的文件描述符发送给工作进程，如果进程是通过cluster.fork()复制出来的，那么他的环境变量里就存在NODE_UNIQUE_ID，如果工作进程中存在listen()监听网络端口的调用，它将拿到文件描述符，通过SO_REUSEADDR端口重用，从而实现多个子进程共享端口。对于，普通方式启动的进程，则不存在文件描述符传递共享等事情。在cluster模块中，一个主进程只能管理一组工作进程：

![cluster](https://upload-images.jianshu.io/upload_images/3112582-3dbda371a44c7383.png?imageMogr2/auto-orient/strip|imageView2/2/w/379/format/webp)

对比与child_process，自行通过child_process来操作进程的场景下，程序可以同时控制多组工作进程，因为，我们可以创建多组tcp服务，使得子进程可以共享多个服务器端的socket。

### Cluster事件

也可以看出是child_process模块的事件封装

| 事件       | 说明                                                         |
| ---------- | ------------------------------------------------------------ |
| fork       | 复制一个工作进程后，触发该事件                               |
| online     | 复制好一个工作进程后，工作进程主动发送一条online消息给主进程，主进程收到消息后，触发该事件 |
| listening  | 工作进程中调用listen()后，也就是共享了服务端的socket后，发送一条listening消息给主进程，主进程收到消息后，触发该事件 |
| disconnect | 主进程和工作进程退出时触发该事件                             |
| exit       | 有工作进程退出时触发该事件                                   |
| setup      | cluster.setupMaster()执行后触发该事件                        |

虽然，我们学习了这些知识，但是在生产环境中，建议使用pm2这样的成熟工具来管理进程。另外，在node的进程管理之外，还需要用监听进程数量或监听日志的方式确保整个系统的稳定性，即使主进程出错退出，也能即使得到监控警报，使得开发者可以及时处理故障。

## [测试](https://www.jianshu.com/p/b02fe775c08c)

首先保证你自己提交的代码是可以测试的，那么这样的代码符合如下几个条件：

- 单一职责
- 接口抽象
- 层次分离

### 单元测试

#### 断言

node提供了assert模块，来实现断言。那么，断言就是用于检查程序在运行时是否满足期望的一种工具。我们看一下断言的示例代码：

```js
var assert = require('assert');
assert.equal(Math.max(1, 100), 100);
```

一旦assert.equal不满足期望，将会抛出AssertionError异常，整个程序将会停止执行。

断言规范提供的几种测试方法：

| 方法           | 说明                                                         |
| -------------- | ------------------------------------------------------------ |
| ok             | 判断结果是否为真                                             |
| equal          | 判断实际值与期望值是否相等                                   |
| notEqual       | 判断实际值与期望值是否不相等                                 |
| deepEqual      | 判断实际值与期望值是否深度相等，也就是对象或者数组的元素是否相等 |
| notDeepEqual   | 判断实际值与期望值是否深度不相等                             |
| strictEqual    | 判断实际值与期望值是否严格相等，相当于===                    |
| notStrictEqual | 判断实际值与期望值是否严格相等，相当于!==                    |
| throws         | 判断代码块是否抛出异常                                       |
| doesNotThrow   | 判断代码块是否没有抛出异常                                   |
| ifError        | 判断实际值是否为一个假值(null、undefined、0、''、false)，如果实际值为真，将会抛出异常 |

#### 测试框架

测试框架并不参与测试，它主要用于管理测试用例和生成测试报告，并能在一定的程度上提升测试用例的开发速度，提高测试用例的可维护性和可读性。我这里使用的测试框架是TJ写的mocha，通过npm install mocha -g进行全局安装。

##### 测试风格

测试风格主要分为：TDD（测试驱动开发）和BDD（行为驱动开发）

TDD风格的测试：

```js
suite('Array', function () {
    setup(function () {
        // ...
    });
    suite('#indexOf()', function () {
        test('should return -1 when not present', function () {
            assert.equal(-1, [1, 2, 3].indexOf(4));
        });
    });
});
```

TDD对测试用例的组织主要采用suite和test完成，suite实现多层级描述，测试用例用test，它提供了setup和teardown两个钩子函数，setup和teardown分别在进入和退出suite时触发执行，我们来看一下TDD风格的组织示意图：

![TDD](https://upload-images.jianshu.io/upload_images/3112582-f88cdc859334a726.png?imageMogr2/auto-orient/strip|imageView2/2/w/817/format/webp)

BDD风格的测试：

```js
describe('Array', function () {
    before(function () {
        // ...
    });
    describe('#indexOf()', function () {
        it('should return -1 when not present', function () {
            [1, 2, 3].indexOf(4).should.equal(-1);
        });
    });
});
```

BDD测试用例的组织主要采用describe和it，describe可以描述多层级的结构，具体到测试用例时，用it来表述每个测试用例。此外，BDD风格还提供了before、after、beforeEach、afterEach这4个钩子方法，用于协助describe中测试用例的准备、安装、卸载和回收等工作。before和after分别在进入和退出describe时触发执行，beforeEach和afterEach则分别在describe中每一个测试用例(it)执行前和执行后触发执行。我们看一下BDD风格的组织示意图

![BDD](https://upload-images.jianshu.io/upload_images/3112582-bcce45e0fa3f6f09.png?imageMogr2/auto-orient/strip|imageView2/2/w/819/format/webp)

##### 测试报告

mocha的设计可以使用原生的assert来作为具体的断言实现，也可以采用扩展库，如should.js、expect、chai等，但是，无论采用哪种断言形式，运行测试用例户，测试报告才是开发者和质量管理者最关注的东西。mocha就可以产生测试报告，使用命令：mocha --reporters即可查看

##### 测试用例

一个完善的功能，需要有完善的、多方面的测试用例，一个测试用例中，至少包含一个断言。我们看一下代码：

```js
describe('#indexOf()', function () {
    it('should return -1 when not present', function () {
        [1, 2, 3].indexOf(4).should.equal(-1);
    });
    it('should return index when present', function () {
        [1, 2, 3].indexOf(1).should.equal(0);
        [1, 2, 3].indexOf(2).should.equal(1);
        [1, 2, 3].indexOf(3).should.equal(2);
    });
});
```

##### 异步测试

通过mocha来解决异步测试的问题，我们看代码：

```js
it('fs.readFile should be ok', function (done) {
    fs.readFile('file_path', 'utf-8', function (err, data) {
        should.not.exist(err);
        done();
    });
});
```

##### 超时设置

mocha默认超时时间为2000毫秒，我们可以通过mocha -t <ms>来设置所有用例的超时时间，若需要更细粒度的设置超时时间，可以在测试用例it中调用this.timeout(ms)实现对单个用例的特殊设置。

```js
describe('a suite of tests', function () {
    this.timeout(500);
    it('should take less than 500ms', function (done) {
        setTimeout(done, 300);
    });
    it('should take less than 500ms as well', function (done) {
        setTimeout(done, 200);
    });
});
```

#### 测试覆盖率

通过不停的给代码添加测试用例，将会不断的覆盖代码的分支和不同的情况，我们使用测试覆盖率来描述这一指标，测试覆盖率即是整体覆盖率也可以明确到具体行上。我们看一下这段代码：

```js
exports.parseAsync = function (input, callback) {
    setTimeout(function () {
        var result;
        try {
            result = JSON.parse(input);
        } catch (e) {
            return callback(e);
        }
        callback(null, result);
    }, 10);
};
```

我们为其添加测试部分

```js
describe('parseAsync', function () {
    it('parseAsync should ok', function (done) {
        lib.parseAsync('{"name": "JacksonTian"}', function (err, data) {
            should.not.exist(err);
            data.name.should.be.equal('JacksonTian');
            done();
        });
    });
});
```

#### mock

因为，各种异常都用可能发生，不一定是我们在测试中可以想到的，比如数据库连接失败，就有可能是网络异常造成的，甚至也可能是由于管理员更改了密码造成的，由于模拟异常并不是很容易，因此，科学家们给了异常一个特殊的名词:mock，我们通过伪造被调用放来测试上层代码的健壮性等。

```js
exports.getContent = function (filename) {
    try {
        return fs.readFileSync(filename, 'utf-8');
    } catch (e) {
        return '';
    }
};
```

为了解决这个问题，我们通过伪造fs.readFileSync()方法抛出错误来触发异常，同时为了保证该测试用例不影响其余用例，我们需要在执行完后还原它，为此，前面提到的before和after就要用上了：

```js
describe("getContent", function () {
    var _readFileSync;
    before(function () {
        _readFileSync = fs.readFileSync;
        fs.readFileSync = function (filename, encoding) {
            throw new Error("mock readFileSync error"));
    };
});
// it();
after(function () {
    fs.readFileSync = _readFileSync;
     })
});
```

#### 私有方法的测试

在模块中的没有用exports引用的都是私有方法，这部分的测试也很重要。我们可以使用rewire来进行私有模块的测试，也就是使用rewire引用模块

```js
var limit = function (num) {
    return num < 0 ? 0 : num;
};

//测试用例
it('limit should return success', function () {
    var lib = rewire('../lib/index.js');
    var litmit = lib.__get__('limit');
    litmit(10).should.be.equal(10);
});
```

rewire的模块引入和require一样，都会为原始文件增加参数：

```js
(function(exports, require, module, __filename, __dirname) {֖ })
```

此外，他还会注入其他的代码：

```js
(function (exports, require, module, __filename, __dirname) {
    var method = function () { };
    exports.__set__ = function (name, value) {
        eval(name " = " value.toString());
    };
    exports.__get__ = function (name) {
        return eval(name);
    };
});
```

每一个被rewire引入的模块，都会有**set**()和**get**()方法，这个就是巧妙的利用了闭包的原理，在eval()执行时，实现了对模块内部局部变量的访问，从而可以将局部变量导出给测试用例进行调用执行。

#### 测试工程化与测试自动化

我们通过持续集成减少手工成本。

##### 工程化

在linux下，推荐使用makefile来构建项目

```shell
TESTS = test /*.js
REPORTER = spec
TIMEOUT = 10000
MOCHA_OPTS =
    test:
@NODE_ENV=test./ node_modules / mocha / bin / mocha \
--reporter $(REPORTER) \
--timeout $(TIMEOUT) \
$(MOCHA_OPTS) \
$(TESTS)
test - cov:
@$(MAKE) test MOCHA_OPTS = '--require blanket' REPORTER = html - cov > coverage.html
test - all: test test - cov
    .PHONY: test
```

开发者只需要通过make test和make test-cov就可以执行复杂的单元测试和覆盖率。（makefile的缩进是tab符合，不能用空格，记得在包描述文件中，配置blanket）

##### 持续集成

社区中比较流行的方式——利用`travis-ci`实现持续集成。

### 性能测试

性能测试包括负载测试、压力测试、基准测试、web应用网络层面的性能测试、业务指标换算。

#### 基准测试

基准测试要统计的就是在多少时间内执行了多少次某个方法，一般会以次数作为参照物，然后比较时间，以此判别性能的差距。

#### 压力测试

对网络接口做压力测试需要考察的几个指标有吞吐率、响应时间、并发数，这些指标反映了服务器的并发处理能力。可以使用ab、siege、http_load等来进行压力测试。

#### 基准测试驱动开发

Felix Geisendörfer是node早期的一个代码贡献者，它开发了几个mysql驱动，都是以追求性能著称，它在faster than c的幻灯片中提到了一种他所使用的开发模式，Benchmark Driven Development，也就是BDD，中文翻译是基准测试开发。

#### 测试数据与业务数据的转换

通常，在进行实际的功能开发之前，我们需要评估业务量，以便功能开发完成后，能够胜任实际的在线业务量，如果用户量只有几个，每天的pv只有几十个，那么网站开发几乎不需要什么优化就能胜任，如果pv上10万，甚至百万、千万，就需要运用性能测试来验证是否能满足实际业务需求了，如果不能满足，就要运用各种优化手段提升服务能力。

## 产品化

尽早接触node有很多好处，首先，由于node相对于很多web技术还比较年轻，这可以让开发者接触到较多的底层细节，例如http协议、进程模型、服务模型等，这些底层原理与其他现有技术并无实质性的差别。由于，node的生态尚不成熟，因此，在开发实际的产品中，还是需要很多非编码相关的工作以保证项目的进展和产品的正常运行等，这些工作包括工程化、架构、容灾备份、部署、运维等。

### 项目工程化

所谓项目工程化，就是项目的组织能力，具体包括目录结构、构建工具、编码规范和代码审查等。

### 部署流程

代码完成开发、审查、合并之后，才会进入部署流程。

#### 部署环境

一个项目的开发到正式发布会存在几种环境，首先是开发环境，然后是测试环境，也叫stage环境。接着是预发布环境，也称为pre-release环境，最后是生产环境，也叫product环境。部署流程如下：

![部署环境](https://upload-images.jianshu.io/upload_images/3112582-f0f598d8fa186347.png?imageMogr2/auto-orient/strip|imageView2/2/w/541/format/webp)

#### 部署操作

部署，其实就是要启动一个长时间执行的服务进程，因此，需要使用nohup和&命令，以不挂断进程的方式执行：nohup node app.js &。同时还要考虑项目停止和项目重启。因此需要写一个bash脚本来简化操作。bash脚本的内容通过与web应用约定好的方式来实现，这里所说的约定，其实就是要解决进程ID不容易查找的问题。

### 性能

提升web应用性能的方法有好多，例如动静分离、多进程架构、分布式，但是这些都是需要进行拆分的，因此，先说一下拆分原则：
1.做专一的事
2.让擅长的工具做擅长的事情
3.将模型简化
4.将风险分离

#### 动静分离

node可以通过中间件的方式实现动静分离，但是，还是那个原则，让擅长的工具做擅长的事情。因此，将图片、脚本、样式表和多媒体等静态文件都引导到专业的静态文件服务器上，让node只处理动态请求即可。这个过程可以使用nginx或者利用CDN来处理。

![动静分离](https://upload-images.jianshu.io/upload_images/3112582-8bae1e166b4797af.png?imageMogr2/auto-orient/strip|imageView2/2/w/427/format/webp)

#### 启用缓存

提升性能差不多只有两个途径，一是提升服务的速度，二是避免不必要的计算。避免不必要的计算使用最多的场景就是缓存的使用。现在的通常做法是使用redis作为缓存。将从数据库中查询出来的静态内容或者不变的内容，通过redis进行存储，等到下一次同样的请求到来时，就会优先检查缓存是否存在数据，如果存在就命中缓存中的数据，如果没有就去db中再次请求，然后返回并同步缓存。

#### 多进程架构

使用多进程架构可以充分利用cpu，同时，因为node不需要额外的容器就可以使用http服务（基于http模块），因此，需要开发者自己处理多进程的管理，另外，也可以使用官方提供的cluster模块，或者pm、forever、pm2这样的模块来进行进程的管理。

#### 读写分离

读写分离主要是对于数据库的操作时读写分离的，读的速度要远远快于写的速度。（因为写需要锁表，来保护数据一致性），读写分离需要将数据库进行主从设计，但是，因为我公司没有专门的运维人员，因此，我们当时使用的阿里的rds进行读写分离的实现的。

### 日志

为了建立健全的排查和跟踪机制，需要为系统增加日志，完善的日志最能还原问题现场，好似侦探断案的第一手线索。

#### 访问日志

访问日志一般用来记录每个客户端对应用的访问。

#### 异常日志

用来记录意外产生的异常错误。

#### 日志与数据库

日志在线写，日志分析通过一些文件同步到数据库中。

#### 分割日志

可以按照日期分割，也可以按照日志类型分割（_stdout和_stderr）。

### 监控报警

对于新上线的应用，需要两个方面的监控，业务逻辑的监控和硬件型的监控。我们来看看具体怎么做。

#### 监控

###### 1. 日志监控

例如查看具体的业务实现，通过日志时间分析，来反映某项业务的qps，同时，在日志上也可以查询到pv（每日ip访问或者刷新次数）和uv（每日某个客户端访问的次数，不重复计算），可以通过pv和uv很好地知道使用者的习惯、预知访问高峰等。

###### 2.响应时间

健康的系统响应时间波动较小，持续均衡。

###### 3.进程监控

检查操作系统中运行的应用（工作）进程数，如果低于某个预估值，就应当发出报警。

###### 4.磁盘监控

监控磁盘用量，防止因为磁盘空间不足造成的系统问题，一旦磁盘用量超过警戒值，服务器的管理者就应该清理日志或者清理磁盘了。

###### 5.内存监控

检查是否有内存泄漏的情况。如果内存只升不降，那么铁定就是内存泄漏了。健康的内存应该是有升有降的。

如果进程中存在内存泄漏，又一时没有排查解决，有一种方案可以解决这种情况，这种方案应用于多进程架构的服务集群，让每个工作进程指定服务多少次请求，达到请求数之后进程就不再服务新的链家，主进程启动新的工作进程来服务客户，旧的进程等所有连接断开后就退出。

###### 6.cpu占用监控

cpu使用分为用户态、内核态、IOWait等，如果用户态cpu使用率较高，说明服务器上的应用需要大量的cpu开销，如果内核态cpu使用率较高，说明服务器花费大量时间进行进程调度或者系统调用，IOWait使用率则反应的是cpu等待磁盘IO操作。

用户态小于70%、内核态小于35%且整体小于70%，cpu处于健康状态。

###### 7.cpu load监控

cpu load又称为cpu平均负载，描述操作系统当前的繁忙程度，可以简单的理解为cpu在单位时间内正在使用和等待使用cpu的平均任务数。它有三个指标，即1分钟的平均负载、5分钟的平均负载、15分钟的平均负载。cpu load 高说明进程数量过多，这在node中可能体现在用子进程模块反复启动新的进程。

###### 8.IO负载

IO负载，主要讲的是磁盘IO，对于node来说，此类IO压力多半来源于数据库IO。

###### 9.网络监控

主要监控网络流量，这个值可以查看公司的相关宣传是否有效，广告是否有效，是否增加了访问流量。（监控流入流量和流出流量）

###### 10.应用状态监控

这个监控可以通过增加时间戳来实现：

```js
app.use('/status', function (req, res) {
    res.writeHead(200);
    res.end(new Date());
})
```

同时，对于业务相关的内容也需要尽可能的打印出来。

###### 11.DNS监控

可以基于第三方的软件进行检测，如DNSPod等，我们用的阿里云的DNS。

#### 报警的实现

有了监控，那么就一定应该提供报警系统。一般情况下，报警系统有：邮件报警、IM报警、短信报警、电话报警。

### node服务稳定性

单独一台服务器满足不了业务无限增长的需求，这就需要将node按多进程的方式部署到多台机器中，这样如果某台机器出现问题，其余机器为用户继续提供服务。另外，大企业也会进行异地机房灾备和搭建就近的服务器。这就抵消了一部分因为地理位置带来的网络延迟的问题。为了更好的稳定性，典型的水平扩展方式就是多进程、多机器、多机房，这样的分布式设计在现在的互联网公司并不少见。

#### 多机器

![多机器](https://upload-images.jianshu.io/upload_images/3112582-0f4ef6274f69f5b6.png?imageMogr2/auto-orient/strip|imageView2/2/w/561/format/webp)

#### 多机房

#### 容灾备份

![容灾备份](https://upload-images.jianshu.io/upload_images/3112582-200397b411471922.png?imageMogr2/auto-orient/strip|imageView2/2/w/533/format/webp)

### 异构共存

node虽然神奇，但是，任何神奇的node功能，都是由操作系统的底层功能进行支持的。因此，node的异构共存，也是很简单和普遍的一件事。

![异构共存](https://upload-images.jianshu.io/upload_images/3112582-e5cc3e5ffba6083b.png?imageMogr2/auto-orient/strip|imageView2/2/w/783/format/webp)