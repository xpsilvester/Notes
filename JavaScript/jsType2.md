# JavaScript数据类型

## 数据类型的概念

在编程过程中，数据类型是重要的概念。为了能够操作变量，了解数据类型是很重要的。JavaScript一种直译式脚本语言，是一种动态类型、弱类型、基于原型的语言，内置支持类型。这意味着相同变量可用作不同类型。例如：

```js
var x;               // 现在 x 是 undefined
var x = 7;           // 现在 x 是数值
var x = "Bill";      // 现在 x 是字符串值
```

## JavaScript的数据类型

JavaScript有两种数据类型，分别是基本数据类型和引用数据类型。其中基本数据类型包括Undefined、Null、Boolean、Number、String、Symbol (ES6新增，表示独一无二的值)，而引用数据类型统称为Object对象，主要包括对象、数组和函数。基本类型的数据是存放在栈内存中的，而引用类型的数据是存放在堆内存中的。

### JavaScript基本类型

JavaScript的基本类型分为以下6种：

- `boolean`（布尔值）
- `null`
- `undefined`
- `number`（数值）
- `string` （字符串）
- `symbol` （ES6新增，表示独一无二的值）

基本类型直接存储在栈(stack)中的简单数据段，占据空间小、大小固定，属于被频繁使用数据，所以放入栈中存储。基本类型存储的都是值，是没有函数可以调用的，比如 `undefined.toString()`，就会报错：

```
VM515:1 Uncaught TypeError: Cannot read property 'toString' of undefined
    at <anonymous>:1:11
```

基本类型复制变量值：

```js
var p = 1;
var p1 = p;
```

执行结果：

![基本类型复制](https://images2015.cnblogs.com/blog/993539/201611/993539-20161124221816643-1579754944.png)

也就是说，基本类型的复制就是在栈内存中开辟出了一个新的存储区域用来存储新的变量，这个变量有它自己的值，只不过和前面的值一样，所以如果其中一个的值改变，则不会影响到另一个。

### JavaScript引用类型

JavaScript的引用类型分为以下几种：

- `Object`
- `Function`
- `Array`

引用类型存储了一个指针，这个指针指向堆内存中该对象的存储地址。引用数据类型存储在堆(heap)中的对象,占据空间大、大小不固定,如果存储在栈中，将会影响程序运行的性能；引用数据类型在栈中存储了指针，该指针指向堆中该实体的起始地址。**当解释器寻找引用值时，会首先检索其在栈中的地址，取得地址后从堆中获得实体。**

引用类型复制变量值：object2复制了object1的值，但是结果却不是像基本类型复制一样的

```js
var object1 = new Object();
object1.name = "Jack";
var object2 = object1;
object2.name = 'Json';
console.log(object1.name); //'Json'
```

执行结果：

![引用类型复制变量值](https://images2015.cnblogs.com/blog/993539/201611/993539-20161124223028768-834204270.png)

定义了一个对象其实是在栈内存中存储了一个指针，这个指针指向堆内存中该对象的存储地址。复制给另一个对象的过程其实是把该对象的地址复制给了另一个对象变量，两个指针都指向同一个对象，所以若其中一个修改了，则另一个也会改变。

### 问题

- 为什么null作为一个object类型的变量却存储在栈内存中？

  ```
  栈内存中的变量一般都是已知大小或者有范围上限的，算作一种简单存储。
  ```

- const、let定义的变量不能二次定义的流程？

  ```
  每次使用const或者let去初始化一个变量的时候，会首先遍历当前的内存栈，看看有没有重名变量，有的话就返回错误。
  ```

## JavaScript数据类型检测

### typeof

**typeof返回一个表示数据类型的字符串**，不能检测 null,array等object对象

```js
typeof null; //object 无效
typeof [] ; //object 无效
typeof new Date(); //object 无效
typeof new RegExp(); //object 无效
```

### instanceof

instanceof 是用来判断A是否为B的实例，表达式为：A instanceof B，如果A是B的实例，则返回true,否则返回false。**instanceof 运算符用来测试一个对象在其原型链中是否存在一个构造函数的 prototype 属性。**

不能检测基本数据类型，在原型链上的结果未必准确，不能检测null,undefined

#### instanceof实现原理

```js
//遍历左边变量的原型链，直到找到右边变量的 prototype，如果没有找到，返回 false
const myInstanceOf = (left, right) => {
    let leftValue = left.__proto__
    let rightValue = right.prototype
    while(true) {
        if(leftValue === null) return false
        if(leftValue === rightValue) return true
        leftValue = leftValue.__proto__
    }
}
```

### constructor

constructor作用和instanceof非常相似。**但constructor检测 Object与instanceof不一样，还可以处理基本数据类型的检测。**

不能检查null，undefined，原型prototype重写则不稳定

### Object.prototype.toString.call()

**Object.prototype.toString.call() 最准确最常用的方式**。首先获取Object原型上的toString方法，让方法执行，让toString方法中的this指向第一个参数的值。

Object上的toString它的作用是返回当前方法执行的主体（方法中的this）所属类的详细信息即"[object Object]",其中第一个object代表当前实例是对象数据类型的(这个是固定死的)，第二个Object代表的是this所属的类是Object。

```js
Object.prototype.toString.call('') ;   // [object String]
Object.prototype.toString.call(1) ;    // [object Number]
Object.prototype.toString.call(true) ; // [object Boolean]
Object.prototype.toString.call(undefined) ; // [object Undefined]
Object.prototype.toString.call(null) ; // [object Null]
Object.prototype.toString.call(new Function()) ; // [object Function]
Object.prototype.toString.call(new Date()) ; // [object Date]
Object.prototype.toString.call([]) ; // [object Array]
Object.prototype.toString.call(new RegExp()) ; // [object RegExp]
Object.prototype.toString.call(new Error()) ; // [object Error]
Object.prototype.toString.call(document) ; // [object HTMLDocument]
Object.prototype.toString.call(window) ; //[object global] window是全局对象global的引用
```

## 判断数组的方法

```
1.instanceof操作符： arr instanceof Array
2.对象的constructor属性： arr.constructor === Array
3.Object.prototype.toString：  Object.prototype.toString.call(o) === '[object Array]'
4.Array.isArray()： Array.isArray(arr)
```

## JavaScript 中 == 和 === 区别是什么？

== 仅判断数据的值是否相等，'===' 先判断数据的类型，相同的前提下在判断数据的值

```js
var a = 1;
var b = '1';
var c = true;
alert(a == b); //true
alert(a == c); //true
alert(b == c); //true

'' == '0' //false
0 == '' //true
0 == '0' true

false == 'false' //false
false == '0' //true

false == undefined //false
false == null //false
null == undefined //true

' \t\r\n' == 0 //true
```

## 参考资料：

[javascript的数据类型有哪些？](https://www.html.cn/qa/javascript/11027.html)

[js——引用类型和基本类型](https://www.cnblogs.com/ljuyi/p/6100071.html)

[JavaScript的数据类型及其检测](https://github.com/ljianshu/Blog/issues/4)

[JS中判断对象是不是数组的方法](https://www.cnblogs.com/heshan1992/p/6927690.html)

[Javascript 中 == 和 === 区别是什么？](https://www.zhihu.com/question/31442029)