# NodeJS 笔记

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