## 一、构造函数和原型

- 构造函数是一种特殊的方法，主要用来在创建对象时初始化对象。
- 每个构造函数都有一个`prototype`(原型),这个`prototype`属性是一个指针，指向一个对象，这个对象包含所有实例共享的方法和属性。
- 每个实例对象的`__proto__`都指向它的构造函数的prototype属性。

如下图所示：

![构造函数和原型](https://images2018.cnblogs.com/blog/1265396/201711/1265396-20171127082821065-1506469155.png)

相关代码实现：

```js
//构造函数
let Person = function(name,age){
    this.name = name;
    this.age = age
}
//所有实例共享的方法
Person.prototype.say = function(sth){
    console.log(sth)
}
//创建构造函数的实例对象
let xiaoming = new Person('xiaoming',12);
console.log(xiaoming.name) //'xiaoming'
console.log(xiaoming.age) //12
xiaoming.say('我是xiaoming') //'我是xiaoming'
console.log(xiaoming) // Person {name: "xiaoming", age: 12}
```

## 二、原型链

根据上面的代码所示，我们实例化Person得到实例化对象xiaoming，访问实例化对象的属性时会触发get方法，它会先在自身属性上查找，如果没有这个属性，就会去`__proto__`中查找，一层层向上直到查找到顶层对象Object，这个查找的过程层层递进，就构成了实例与原型的链条,，这就是所谓的原型链。

```js
xiaoming.__proto__ === Person.prototype; //true
Person.prototype.__proto__ === Object.prototype //true
```

另外，只有函数有prototype,对象是没有的。但是函数也是有`__proto__`的，因为函数也是对象。函数的`__proto__`指向的是`Function.prototype`。

也就是说普通函数是`Function`这个构造函数的一个实例。

```js
Function.prototype === Function.__proto__
```

![Function](https://images2015.cnblogs.com/blog/740839/201607/740839-20160730201459981-792406306.jpg)

## 三、继承

继承在`js`中占有非常重要的地位，原型链很大的一个作用就是用来实现继承，在`js`中有很多中继承的方式。

以下就是`js`继承的几种方式及优缺点：

| 名称                   | 继承方式                                                     | 优点                                                         | 缺点                                                         |
| ---------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 原型链继承             | 父类的实例作为子类的原型：Woman.prototype = new People()     | 简单易于实现，父类的新增的实例与属性子类都能访问             | 1.可以在子类中增加实例属性，如果要新增加原型属性和方法需要在new 父类构造函数的后面 2.无法实现多继承 3.创建子类实例时，不能向父类构造函数中传参数 |
| 借用构造函数继承       | 复制父类的实例属性给子类：People.call(this,arguments)        | 解决了子类构造函数向父类构造函数中传递参数、可以实现多继承（call或者apply多个父类） | 1.方法都在构造函数中定义，无法复用 2.不能继承原型属性/方法，只能继承父类的实例属性和方法 |
| 实例继承（原型式继承） | 利用父类的实例实现继承：let instance = new People()          | 不限制调用方式、简单，易实现                                 | 不能多次继承                                                 |
| 组合式继承             | 调用父类构造函数，继承父类的属性，通过将父类实例作为子类原型，实现函数复用 | 函数可以复用、不存在引用属性问题、可以继承属性和方法，并且可以继承原型的属性和方法 | 由于调用了两次父类，所以产生了两份实例                       |
| 寄生组合继承           | 通过寄生的方式来修复组合式继承的不足，完美的实现继承         | 几乎可以实现完美继承                                         | ——                                                           |
| ES6继承                | 利用class和super实现继承                                     | es6中很多代码的语法糖，很多方法简单易用                      | 可能存在兼容性问题                                           |

其他的继承方式就不多说了，大家可以自行搜一下相关的实现方法，接下来就介绍一下最重点的寄生式组合继承和ES6继承吧。

### 寄生式组合继承

这种继承方式用ES5语法几乎可以实现完美继承，直接上代码吧

```js
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

### ES6继承

ES6中很多代码的语法糖，很多方法简单易用。在浏览器兼容的情况下，改变原有方式。

```js
//class 相当于es5中构造函数
//class中定义方法时，前后不能加function，全部定义在class的protopyte属性中
//class中定义的所有方法是不可枚举的
//class中只能定义方法，不能定义对象，变量等
//class和方法内默认都是严格模式
//es5中constructor为隐式属性
class People{
  constructor(name='wang',age='27'){
    this.name = name;
    this.age = age;
  }
  eat(){
    console.log(`${this.name} ${this.age} eat food`)
  }
}
//继承父类
class Woman extends People{ 
   constructor(name = 'ren',age = '27'){ 
     //继承父类属性
     super(name, age); 
   } 
    eat(){ 
     //继承父类方法
      super.eat() 
    } 
} 
let wonmanObj=new Woman('xiaoxiami'); 
wonmanObj.eat();
```

### ES5继承和ES6继承的区别

es5继承先创建子类的实例对象，然后再将父类的方法添加到this上（Parent.apply(this)）。
es6继承是使用关键字super先创建父类的实例对象this，最后在子类class中修改this。

## 四、模拟实现new操作符

当代码 `new Foo(...)` 执行时，会发生以下事情：

- 一个继承自 Foo.prototype 的新对象被创建。
- 使用指定的参数调用构造函数 Foo，并将 this 绑定到新创建的对象。new Foo 等同于 new Foo()，也就是没有指定参数列表，Foo 不带任何参数调用的情况。
- 由构造函数返回的对象就是 new 表达式的结果。如果构造函数没有显式返回一个对象，则使用步骤1创建的对象。
  （一般情况下，构造函数不返回值，但是用户可以选择主动返回对象，来覆盖正常的对象创建步骤）

```js
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

## 五、手写一个`Object.create()`方法

```js
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



## 参考资料：

[详谈JavaScript原型链](https://www.cnblogs.com/chengzp/p/prototype.html)

[还在问什么是JavaScript构造函数、实例、原型对象以及原型链？看完这篇你就懂](https://juejin.im/post/6864168067182968839)

[一张图理解prototype、proto和constructor的三角关系](https://www.cnblogs.com/xiaohuochai/p/5721552.html)

[js继承的几种方式](https://zhuanlan.zhihu.com/p/37735247)

[能否模拟实现JS的new操作符](https://juejin.im/post/5bde7c926fb9a049f66b8b52)

[怎样手写一个Object.create()方法](https://www.cnblogs.com/aisowe/p/11677093.html)

