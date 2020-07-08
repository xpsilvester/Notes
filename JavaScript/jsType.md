# JavaScript数据类型

## [JavaScript 引用类型（堆）和基本类型（栈）](https://www.cnblogs.com/ljuyi/p/6100071.html)

##  [JS中的堆内存与栈内存](https://www.cnblogs.com/heioray/p/9487093.html)

```
为什么null作为一个object类型的变量却存储在栈内存中？
栈内存中的变量一般都是已知大小或者有范围上限的，算作一种简单存储。

const、let定义的变量不能二次定义的流程。
每次使用const或者let去初始化一个变量的时候，会首先遍历当前的内存栈，看看有没有重名变量，有的话就返回错误。
```

## [JavaScript的数据类型及其检测](https://github.com/ljianshu/Blog/issues/4)

```
一、数据类型
1.String
2.Number
3.Boolean
4.Undefined
5.Null
6.Object
7.ES6新增symbol

二、基本类型和引用类型
基本类型：Number Boolean  String  undefined null symbol
引用类型：Object

基本类型的数据是存放在栈内存中的，而引用类型的数据是存放在堆内存中的

三、检测类型方法，typeof、instanceof、constructor、Object.prototype.toString.call()
1.typeof不能检测 null,array等object对象
2.instanceof 不能检测基本数据类型，在原型链上的结果未必准确，不能检测null,undefined
3.constructor 不能检查null，undefined，原型prototype重写则不稳定
4.Object中的toString方法返回方法执行的主体（this）
```

### instanceof手写

```javascript
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

## [判断数组的方法](https://www.cnblogs.com/heshan1992/p/6927690.html)

```
1.instanceof操作符： arr instanceof Array
2.对象的constructor属性： arr.constructor === Array
3.Object.prototype.toString：  Object.prototype.toString.call(o) === '[object Array]'
4.Array.isArray()： Array.isArray(arr)
```

## [Javascript 中 == 和 === 区别是什么？](https://www.zhihu.com/question/31442029)

* == 仅判断数据的值是否相等，'===' 先判断数据的类型，相同的前提下在判断数据的值

```JavaScript
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