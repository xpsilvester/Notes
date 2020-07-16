## [原型链和new原理](https://www.cnblogs.com/chengzp/p/prototype.html)

#### 1.原型

```
构造函数是一种特殊的方法，主要用来在创建对象时初始化对象。
每个构造函数都有一个prototype(原型),这个prototype(原型)属性是一个指针，指向一个对象，这个对象包含所有实例共享的方法和属性。
每个实例对象的__proto__都指向它的构造函数的prototype属性。
```

#### 2.继承(寄生组合继承)

```JavaScript
function Person(obj) {
    this.name = obj.name
    this.age = obj.age
}
Person.prototype.add = function(value){
    console.log(value)
}
var p1 = new Person({name:"番茄", age: 18})

function Person1(obj) {
    Person.call(this, obj)
    this.sex = obj.sex
}
// 这一步是继承的关键
Person1.prototype = Object.create(Person.prototype);
Person1.prototype.constructor = Person1;

Person1.prototype.play = function(value){
    console.log(value)
}
var p2 = new Person1({name:"鸡蛋", age: 118, sex: "男"})
```

#### 3.原型链

```
原型链实际上在上面原型的问题中就有涉及到，在原型的继承中，我们继承来多个原型，这里再提一下实现完美
继承的方案，通过借助寄生组合继承，PersonB.prototype = Object.create(PersonA.prototype)
这是当我们实例化PersonB得到实例化对象，访问实例化对象的属性时会触发get方法，它会先在自身属性上查
找，如果没有这个属性，就会去__proto__中查找，一层层向上直到查找到顶层对象Object，这个查找的过程
就是原型链。
```

#### 4.[能否模拟实现JS的new操作符](https://juejin.im/post/5bde7c926fb9a049f66b8b52)

```JavaScript
function Ctor(){
    ....
}

function myNew(ctor){
    if(typeof ctor !== 'function'){
      throw 'myNew function the first param must be a function';
    }
    var newObj = Object.create(ctor.prototype); //创建一个继承自ctor.prototype的新对象
    var argsArr = [].slice.call(arguments, 1); //获取ctor之后的参数传入[]中
    var ctorReturnResult = ctor.apply(newObj, argsArr); //将构造函数ctor的this绑定到newObj中
    var isObject = typeof ctorReturnResult === 'object' && ctorReturnResult !== null;
    var isFunction = typeof ctorReturnResult === 'function';
    if(isObject || isFunction){
        return ctorReturnResult;
    }
    return newObj;
}

let c = myNew(Ctor);
```

#### 当代码 `new Foo(...)` 执行时，会发生以下事情：

```
1.一个继承自 Foo.prototype 的新对象被创建。
2.使用指定的参数调用构造函数 Foo，并将 this 绑定到新创建的对象。
  new Foo 等同于 new Foo()，也就是没有指定参数列表，Foo 不带任何参数调用的情况。
3.由构造函数返回的对象就是 new 表达式的结果。
  如果构造函数没有显式返回一个对象，则使用步骤1创建的对象。
 （一般情况下，构造函数不返回值，但是用户可以选择主动返回对象，来覆盖正常的对象创建步骤）
```

## [怎样手写一个Object.create()方法](https://www.cnblogs.com/aisowe/p/11677093.html)

```javascript
function _create(obj){
    function C(){}
    C.prototype = obj;
    return new C();
}

var obj1 = {name: "Lilei"};
var lilei = _create(obj1);
lilei; // {}
lilei.name; // "Lilei"
```

## [JavaScript继承的几种方式](https://zhuanlan.zhihu.com/p/37735247)

```
1.原型链继承 Woman.prototype = new People()
2.借用构造函数继承（伪造对象、经典继承） People.call(this,arguments)
3.实例继承（原型式继承）let instance = new People()
4.组合式继承
      People.call(this,argument); 
      Woman.ptototype = new People; 
      Woman.prototype.Constructor = Woman
5.寄生组合继承
6.ES6继承
ES5继承和ES6继承的区别：
es5继承先创建子类的实例对象，然后再将父类的方法添加到this上（Parent.apply(this)）。
es6继承是使用关键字super先创建父类的实例对象this，最后在子类class中修改this。
```

## function 中的 constructor 和 class 中的constructor有什么区别？

#### [js 的constructor属性](https://www.cnblogs.com/lieaiwen/p/10219783.html) （你不知道的js上 5.3）

```
function中的constructor是属性，返回对创建对象的数组函数的引用,
class中的constructor是一个特殊的函数，用来初始化类的属性。
```

## [一张图理解prototype、proto和constructor的三角关系](https://www.cnblogs.com/xiaohuochai/p/5721552.html)

## [JavaScript设计模式之面向对象编程](https://juejin.im/post/5b87b393e51d4557631bf5f0)

## [创建对象的几种方式](https://www.jb51.net/article/107012.htm)

```
1.Object构造函数创建 let Person = new Object();
2.使用对象字面量表示法 跟1其实是一样的 let Person = {};
3.使用Object.create(null)创建 与1，2的区别是产生的对象简洁很多，没用相关的__proto__方法
4.使用工厂模式创建对象 批量生成相关属性
   function Person(){ let o = new Object();return o;};let person = Person()
5.使用构造函数创建对象
   function Person(name){this.name = name };let person = new Person()
6.原型创建对象模式 function Person(){};Person.prototype.name = name;let person = new Person()
```
