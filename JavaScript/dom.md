# JavaScript事件详解

想必大家对JavaScript的事件都不陌生吧，大多数在网站开发的时候都会用到，这也是JavaScript的基本功之一，本文就为各位梳理一下相关知识。

## JavaScript事件模型

JavaScript事件模型，也就是事件机制，分为两类DOM0级事件模型和DOM2级事件模型。

### DOM0级事件模型

DOM0级事件模型是早期的事件模型，比如说一个onclick事件

#### 缺点：

- 无法绑定多个相同的事件，注册多个同类型的函数的话，就会发生覆盖，之前注册的函数就会无效

```js
document.getElementById('click').onclick = function(event){
    var event=event||window.event;
    var target=event.target||event.srcElement
    alert(target);
}
```

### DOM2级事件模型

在DOM2级中使用addEventListener和removeEventListener来注册和解除事件（IE8及之前版本不支持，IE7、IE8用 attachEvent）。这种函数较之前的方法好处是一个dom对象可以注册多个相同类型的事件，不会发生事件的覆盖，会依次的执行各个事件函数。

- addEventListener('事件名称','事件回调','捕获/冒泡')  ，第三个参数默认为false，捕获：true，冒泡：false
- 阻止冒泡：event.stopPropagation() 
- 阻止默认动作：event.preventDefault()
- IE模型用attachEvent，兼容IE8以下浏览器（ie 6 7），阻止冒泡 event.cancelBubble=true，阻止默认 event.returnValue=false

```js
//这段代码，我们使用了捕获事件，由于inner是嵌套在outer中的
//所以我们知道当使用捕获的时候outer是应该首先捕获到这个事件的
//其次inner才能捕获到这个事件。那么结果就是outer首先执行，其次是inner执行。
var click = document.getElementById('inner');
var clickouter = document.getElementById('outer');
click.addEventListener('click',function(){
    alert('inner show');
},true);
clickouter.addEventListener('click',function(){
    alert('outer show');
},true);
//如果这么改：就先执行inner 再执行outer 
clickouter.addEventListener('click',function(){
  alert('outer show');  
},false);
```

## DOM事件流

```
事件流
1.先自顶向里一层一层地触发捕获，一直到当前元素，然后自里向顶一层一层触发冒泡。
2.最顶层是window。
3.使用捕获的方法：将监听器addEventListener 的第三个参数设为true。
```

事件流又称为事件传播，DOM2级事件规定的事件流包括三个阶段：事件捕获阶段(capture phase)、处于目标阶段(target phase)和事件冒泡阶段(bubbling phase)

首先发生的是事件捕获，为截获事件提供了机会。然后是实际的目标接收到事件，最后一个阶段是冒泡阶段，可以在这个阶段对事件做出响应

如图所示：事件捕获（123）和事件冒泡（4567）

![事件流](https://pics1.baidu.com/feed/aa64034f78f0f736cfc6b8bee508541cebc4133c.jpeg?token=98e950edc8b0437dd4879ec3a16c1b65&s=5AA834631BBFF0CE5E7555CE0000E0B1)

为了更好的说明DOM标准中的事件流原理，我们把它放在“事件传送”小结里来更具体的解释。显然，如果为一个超链接添加了click事件监听器，那么当该链接被点击时该事件监听器就会被执行。但如果把该事件监听器指派给了包含该链接的p元素或者位于DOM树顶端的document节点，那么点击该链接也同样会触发该事件监听器。这是因为事件不仅仅对触发的目标元素产生影响，它们还会对沿着DOM结构的所有元素产生影响。这就是大家所熟悉的事件转送。W3C事件模型中明确地指出了事件转送的原理。事件传送可以分为3个阶段。

![标准的事件转送模式](https://pics0.baidu.com/feed/1b4c510fd9f9d72ae3dbd2373a77cf31359bbbc5.jpeg?token=7ccd537e4fe557b5a25182be721bd1f4&s=E1166E3299DEF1EB465D1CD70200D0A2)

如图：标准的事件转送模式

### 事件捕获（Capturing）阶段

事件将沿着DOM树向下转送，目标节点的每一个祖先节点，直至目标节点。例如，若用户单击了一个超链接，则该单击事件将从document节点转送到html元素，body元素以及包含该链接的p元素。在此过程中，浏览器都会检测针对该事件的捕捉事件监听器，并且运行这件事件监听器。

### 目标（target）阶段

浏览器在查找到已经指定给目标事件的事件监听器之后，就会运行 该事件监听器。目标节点就是触发事件的DOM节点。例如，如果用户单击一个超链接，那么该链接就是目标节点（此时的目标节点实际上是超链接内的文本节点）。

### 冒泡（Bubbling）阶段

事件将沿着DOM树向上转送，再次逐个访问目标元素的祖先节点到document节点。该过程中的每一步。浏览器都将检测那些不是捕捉事件监听器的事件监听器，并执行它们。

## 事件委托

利用触发冒泡事件的原理，只指定一个事件处理程序，就可以管理某一类型的所有事件。一般就是一次性将父元素绑定事件，通过判断event.target 来执行相应的方法，后续添加子元素的时候不用再次绑定。

在JavaScript中，添加到页面上的事件处理程序数量将直接关系到页面的整体运行性能，因为需要不断的与dom节点进行交互，访问dom的次数越多，引起浏览器重绘与重排的次数也就越多，就会延长整个页面的交互就绪时间，这就是为什么性能优化的主要思想之一就是减少DOM操作的原因；如果要用事件委托，就会将所有的操作放到js程序里面，与dom的操作就只需要交互一次，这样就能大大的减少与dom的交互次数，提高性能；

每个函数都是一个对象，是对象就会占用内存，对象越多，内存占用率就越大，自然性能就越差了，比如上面的100个li，就要占用100个内存空间，如果是1000个，10000个呢，那只能说呵呵了，如果用事件委托，那么我们就可以只对它的父级（如果只有一个父级）这一个对象进行操作，这样我们就需要一个内存空间就够了，是不是省了很多，自然性能就会更好。

```html
<ul id="ul1">
    <li>111</li>
    <li>222</li>
    <li>333</li>
    <li>444</li>
</ul>
```

```js
window.onload = function(){
　　var oUl = document.getElementById("ul1");
　　oUl.onclick = function(ev){
　　　　var ev = ev || window.event;
　　　　var target = ev.target || ev.srcElement;
　　　　if(target.nodeName.toLowerCase() == 'li'){
　 　　　　　　	alert(123);
　　　　　　　  alert(target.innerHTML);
　　　　}
　　}
}
```



## 参考资料：

[JavaScript事件模型](https://blog.csdn.net/hopefullman/article/details/88624650)

[JavaScript事件处理机制解析](https://baijiahao.baidu.com/s?id=1652994196994734318)

[深入理解DOM事件机制系列第一篇——事件流](https://www.cnblogs.com/xiaohuochai/p/5859476.html)

[js中的事件委托或是事件代理详解](https://www.cnblogs.com/liugang-vip/p/5616484.html)

