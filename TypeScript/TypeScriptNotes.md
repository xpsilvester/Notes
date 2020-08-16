# TypeScript学习笔记

## 为什么使用TypeScript?

```
JavaScript是一门动态弱类型语言，对变量的类型非常宽容，如果长期在没有类型约束的环境开发，就会缺失类型思维，容易写出难以维护的代码。
TypeScript的出现就是为了解决这个问题的。VS Code具有强大的自动补全、导航和重构功能，这使得接口定义可以直接代替文档，
同时也可以提高开发效率，降低维护成本。
```

## 什么是TypeScript？

```
TypeScript 是 JavaScript 的超集，扩展了 JavaScript 的语法。TypeScript有三个功能：
1.类型检查，在编译代码时会进行严格的静态类型检查，这意味着可以在编码阶段，就发现潜在的隐患。
2.语言扩展，包含了ES6以及未来的特性，比如异步操作和装饰器，也会从其他语言借鉴某些特性，比如接口和抽象类。
3.工具属性，ts可以编译成标准的js，可以在任何标准浏览器运行，无需任何额外开销。
```

## 强类型与弱类型

```
强类型：不允许改变变量的数据类型，除非进行强制类型转换
弱类型：变量可以被赋予不同的数据类型
```

## 静态类型语言与动态类型语言

```
静态类型语言：在编译阶段确定所有变量的类型
动态类型语言：在执行阶段确定所有变量的类型
```

| 静态类型语言   | 动态类型语言            |
| -------------- | ----------------------- |
| 对类型极度严格 | 对类型非常宽松          |
| 立即发现错误   | Bug可能隐藏数月甚至数年 |
| 运行时性能好   | 运行时性能差            |
| 自文档化       | 可读性差                |

## 类型注解

```
作用：相当于强类型语言中的类型声明
语法：（变量/函数）：type
```

## 枚举

使用枚举我们可以定义一些带名字的常量。 使用枚举可以清晰地表达意图或创建一组有区别的用例。 TypeScript支持数字的和基于字符串的枚举。

```js
//一个角色判断的例子
function initByRole(role){
    if(role === 0 || role === 1){
        //do sth
    } else if(role === 2 || role == 3){
        //do sth
    } else if(role === 4){
        //do sth
    } else {
        //do sth
    }
}
```

存在问题：1. 可读性差：很难记住数字的含义  2.可维护差：硬编码，牵一发动全身

```tsx
//用枚举
//可以完全不使用初始化器,默认从0开始逐1递增
enum Role{
    Reporter,
    Guess,
    Teacher,
    Doctor,
    Lawyer
}
function initByRole(role){
    switch(role){
        case Role.Reporter:
        case Role.Guess:
            //do sth
            break;
        case Role.Teacher:
        case Role.Doctor:
            //do sth
            break;
        case Role.Lawyer:
            //do sth
    }
}
```

## 类与接口

![类与接口关系图](https://raw.githubusercontent.com/xpsilvester/Notes/master/images/classinterface.jpg)

## 接口

TypeScript的核心原则之一是对值所具有的*结构*进行类型检查。 它有时被称做“鸭式辨型法”或“结构性子类型化”。 在TypeScript里，接口的作用就是为这些类型命名和为你的代码或第三方代码定义契约。

接口描述：必须包含一个`label`属性且类型为`string`

```tsx
interface LabelledValue {
  label: string;
}

function printLabel(labelledObj: LabelledValue) {
  console.log(labelledObj.label);
}

let myObj = {size: 10, label: "Size 10 Object"};
printLabel(myObj);
```

### 接口特性

- 可选属性 
- 只读属性
- 额外的属性检查
- 函数类型
- 可索引的类型
- 类类型

## 类

简单例子：

```js
class Greeter {
    greeting: string;
    constructor(message: string) {
        this.greeting = message;
    }
    greet() {
        return "Hello, " + this.greeting;
    }
}

let greeter = new Greeter("world");
```

### 公共，私有与受保护的修饰符

- 默认为 `public`
- `private`：当成员被标记成 `private`时，它就不能在声明它的类的外部访问。
- `protected`：`protected`修饰符与 `private`修饰符的行为很相似，但有一点不同， `protected`成员在派生类中仍然可以访问。
- `readonly`：使用 `readonly`关键字将属性设置为只读的。 只读属性必须在声明时或构造函数里被初始化。

### 抽象类

抽象类做为其它派生类的基类使用。 它们一般不会直接被实例化。 不同于接口，抽象类可以包含成员的实现细节。`abstract`关键字是用于定义抽象类和在抽象类内部定义抽象方法。

```tsx
abstract class Animal {
    abstract makeSound(): void;
    move(): void {
        console.log('roaming the earch...');
    }
}
```

## 泛型

使用`泛型`来创建可重用的组件，一个组件可以支持多种类型的数据。 这样用户就可以以自己的数据类型来使用组件。不需要预先确定数据类型，具体的类型在使用的时候才确定。

```tsx
//不用泛型的话，这个函数可能是下面这样：
function identity(arg: number): number {
    return arg;
}
//或者
function identity(arg: any): any {
    return arg;
}
//我们需要一种方法使返回值的类型与传入参数的类型是相同的。
//这里，我们使用了 类型变量，它是一种特殊的变量，只用于表示类型而不是值。
function identity<T>(arg: T): T {
    return arg;
}
```

### 泛型的好处

- 增强程序的可扩展性：函数或类可以很轻松地支持多种数据类型
- 增强代码的可读性：不必写多条函数重载，或者冗长的联合类型声明
- 灵活地控制类型之间的约束

### 泛型变量

```tsx
//报错
function loggingIdentity<T>(arg: T): T {
    console.log(arg.length);  // Error: T doesn't have .length
    return arg;
}
//修改
function loggingIdentity<T>(arg: T[]): T[] {
    console.log(arg.length);  // Array has a .length, so no more error
    return arg;
}
//或者
function loggingIdentity<T>(arg: Array<T>): Array<T> {
    console.log(arg.length);  // Array has a .length, so no more error
    return arg;
}
```

### 泛型类型

我们的示例做了少许改动。 不再描述泛型函数，而是把非泛型函数签名作为泛型类型一部分。 当我们使用`GenericIdentityFn`的时候，还得传入一个类型参数来指定泛型类型（这里是：`number`），锁定了之后代码里使用的类型。 对于描述哪部分类型属于泛型部分来说，理解何时把参数放在调用签名里和何时放在接口上是很有帮助的。

```tsx
interface GenericIdentityFn<T> {
    (arg: T): T;
}

function identity<T>(arg: T): T {
    return arg;
}

let myIdentity: GenericIdentityFn<number> = identity;
```

### 泛型类

泛型类看上去与泛型接口差不多。 泛型类使用（ `<>`）括起泛型类型，跟在类名后面。

```tsx
class GenericNumber<T> {
    zeroValue: T;
    add: (x: T, y: T) => T;
}

let myGenericNumber = new GenericNumber<number>();
myGenericNumber.zeroValue = 0;
myGenericNumber.add = function(x, y) { return x + y; };
```

### 泛型约束

你应该会记得之前的一个例子，我们有时候想操作某类型的一组值，并且我们知道这组值具有什么样的属性。 在`loggingIdentity`例子中，我们想访问`arg`的`length`属性，但是编译器并不能证明每种类型都有`length`属性，所以就报错了。

```tsx
//为此，我们定义一个接口来描述约束条件。 创建一个包含 .length属性的接口，使用这个接口和extends关键字来实现约束：
interface Lengthwise {
    length: number;
}

function loggingIdentity<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);  // Now we know it has a .length property, so no more error
    return arg;
}
```

## 类型检查机制

`TypeScript`编译器在做类型检查时，所秉承的一些原则，以及表现出的一些行为。作用是辅助开发，提高开发效率。

### 类型推断

不需要指定变量的类型（函数的返回值类型），`TypeScript`可以根据某些规则自动地为其推断出一个类型。

- 基础类型推断
- 最佳通用类型推断
- 上下文类型推断

### 类型兼容性

当一个类型Y可以被赋值给另一个类型X时，我们就可以说类型X兼容类型Y

```
X兼容Y : X (目标类型) = Y (源类型)
```

- 结构之间兼容：成员少的兼容成员多的
- 函数之间兼容：参数多的兼容参数少的

### 类型保护

- `TypeScript`能够在特定的区块中保证变量属于某种确定的类型。
- 可以在此区块中放心地引用此类型的属性，或者调用此类型的方法。

## TypeScript高级类型

所谓高级类型，是typescript为了保证语言的灵活性，所使用的一下语言特性。这些特性有助于我们应对复杂多变的开发场景。

### 交叉类型

将多个类型合并成一个类型，新的类型将具有所有类型的特性，所以交叉类型特别适用对象混入的场景。

```tsx
interface DogInterface{
    run():void
}
interface CatInterface{
    jump():void
}
let pet:DogInterface & CatInterface={
    run(){},
    jump(){}
}
```

### 联合类型

声明的类型并不确定，可以为多个类型中的一个

```tsx
let a:number| string='111';
 //限定变量的取值
let ba:'a' | 'b' | 'c';  //字符串的字面量联合类型
let ca:1|2|3 ;  //数字的联合类型
```

对象的联合类型

```tsx
interface DogInterface{
    run():void
}
interface CatInterface{
    jump():void
}
class Dog implements DogInterface{   //类实现接口
   run(){}
   eat(){}
}
 class Cat implements CatInterface{
    jump(){}
    eat(){}
}
enum Master {Boy,Girl};
 function getPet(master:Master){
    let pet=master===Master.Boy?new Dog() : new Cat();   //pet被推断为Dog和Cat的联合类型
    //如果一个对象是联合类型，在类型未确定的时候，他就只能访问所有类型的共有成员，所以能访问eat()
    pet.eat();
    pet.run();  //报错
    return pet;
}
```

### 索引类型

```tsx
let obj = {
    a: 1,
    b: 2,
    c: 3
}
// 获取对象中的指定属性的值集合
function getValues(obj: any, keys: string[]) {
    return keys.map(key => obj[key])
}
// 抽取指定属性的值
console.log(getValues(obj, ['a','b']))  // [1, 2]
// 抽取obj中没有的属性:
console.log(getValues(obj, ['e','f']))  // [undefined, undefined]
```

虽然obj中并不包含e, f属性,但typescript编译器并未报错。此时使用typescript索引类型,对这种模式做类型约束。

#### keyof

keyof是索引类型查询操作符。

假设T是一个类型，那么keyof T产生的类型是T的属性名称字符串字面量类型构成的联合类型。

特别说明:T是数据类型，并非数据本身。

看例子：

```tsx
// 定义一个接口Obj含有属性a,b
interface obj {
    a: number
    b: string
}
// 定义变量key,类型为keyof Obj
let key: keyof obj
```

T是一个类型，T[K] 表示类型T中属性K的类型

```tsx
interface obj {
  a: number
  b: string
}
// 定义变量key,类型为keyof Obj
let key: keyof obj

let value:obj['a']
```

所以上面的代码可以这样改造

```tsx
function getValues<T, K extends keyof T>(obj: T, keys: K[]): T[K][] {
    return keys.map(key => obj[key])
}

let obj = {
    a: 1,
    b: 2,
    c: 3
}

// 抽取指定属性的值
console.log(getValues(obj, ['a','b']))  // [1, 2]
// 抽取obj中没有的属性:
console.log(getValues(obj, ['e','f']))  // [undefined, undefined]
```

### 映射类型

typescript 允许将一个类型映射成另外一个类型

#### Readonly

Readonly是 typescript 内置的泛型接口，可以将一个接口的所有属性映射为只读:

```tsx
// 定义接口Obj
interface Obj {
    a: number
    b: string
    c: boolean
}
// 使用类型别名定义类型ReadonlyObj
type ReadonlyObj = Readonly<Obj>    // Readonly是TS内置的泛型接口
```

node_module/typescript/lib/lib.es5.d.ts 中可以看到 typescript 内部是如何实现 Readonly 的

```tsx
type Readonly<T> = {
    readonly [P in keyof T]: T[P];
};
```

从源码可以看出Readonly是一个可索引类型的泛型接口

1. 索引签名为P in keyof T : 其中keyof T就是一个一个索引类型的查询操作符,表示类型T所有属性的联合类型

2. P in :相当于执行了一个for in操作,会把变量P依次绑定到T的所有属性上

3. 索引签名的返回值就是一个索引访问操作符 : T[P] 这里代表属性P所指定的类型

4. 最后再加上Readonly就把所有的属性变成了只读,这就是Readonly的实现原理

#### Partial

将一个接口的所有属性映射为可选：

```tsx
interface Obj {
  a: number
  b: string
  c: boolean
}
type PartialObj = Partial<Obj>
```

#### Record

Record会利用已有的类型，创建新属性的映射类型

```tsx
interface Obj {
  a: number
  b: string
  c: boolean
}
type RecordObj = Record<'x' | 'y', Obj>
```

第一个参数是预定义的新属性,比如x,y；第二个参数就是已知类型

### 条件类型

条件类型是一种由条件表达式所决定的类型 。条件类型使类型具有了不唯一性,同样增加了语言的灵活性

```tsx
T extends U ? X : Y
若类型T可被赋值给类型U,那么结果类型就是X类型,否则就是Y类型
```

```tsx
// 条件类型
type TypeName<T> = 
    T extends string ? 'string' :
    T extends number ? 'number' :
    T extends boolean ? 'boolean' :
    T extends undefined ? 'undefined' :
    T extends Function ? 'Function' :
    'object'

// 定义类型T1为条件类型,传入参数string,指定t1为string类型
type T1 = TypeName<string>  // T1为 string
// 定义类型T2为条件类型,传入参数string[]
type T2 = TypeName<string[]>  // T2为 object
```

看下面例子

```tsx
type TypeName<T> = 
    T extends string ? 'string' :
    T extends number ? 'number' :
    T extends boolean ? 'boolean' :
    T extends undefined ? 'undefined' :
    T extends Function ? 'Function' :
    'object'

type T3 = TypeName<string | string[]>
```

t3 会被 解析成 "string" | "object"

原因就是 联合类型在extend 的时候会进行如下转换。

```tsx
(A | B) extends U ? X : Y  ---->  (A extends U ? X : Y) | (B extends U ? X : Y) 
```

利用上边这个特性可以实现对类型的过滤

如果T可以被赋值给U,结果类型为never类型,否则为T类型

```tsx
type Diff<T, U> = T extends U ? never : T
type T4 = Diff<'a' | 'b' | 'c', 'a' | 'e'>
```

也可以实现从类型T中移除不需要的类型,如undefined和null

定义一个NotNull,从T中过滤掉undefined和null

```tsx
type Diff<T, U> = T extends U ? never : T

type NotNull<T> = Diff<T, undefined | null>

type T5 = NotNull<string | number | undefined | null>
```

上边实现的Diff和NotNull类型,是已经在TS内置的类库中被实现的内置类型。Diff的内置类型叫做Exclude<T, U>。NotNull的内置类型叫做NonNullable<T>

```tsx
type T6 = Extract<'a' | 'b' | 'c', 'a' | 'e'>   // type T6 = "a"

type T7 = Exclude<'a' | 'b' | 'c', 'a' | 'e'>   // type T7 = "b" | "c"
```



## 思维导图

![思维导图](https://raw.githubusercontent.com/xpsilvester/Notes/master/images/tsbase.jpg)