## 浅拷贝（一维）

只能实现数组或对象的一级拷贝，如果有多层则不适用

#### 1.JS自带方法

```js
//数组
slice()、concat()、Array.from()

//对象
Object.assign()

```

#### 2.手写实现

```js
function clone(target){
    //判断对象还是数组
    let clonetarget = Array.isArray(target) ? [] : {};
    for(let key in target){
        clonetarget[key] = target[key]
    }
    return clonetarget
}
```


## 深拷贝（多维）

#### 1.JS自带方法
```js
JSON.parse(JSON.stringify());
```
大部分场景适用，缺点：不适用于拷贝其他引用类型、拷贝函数、循环引用等情况

#### 2.手写基础版

```js
function clone(target){
    //先判断是否有下一层内容
    if(typeof target === 'object'){
        //判断对象还是数组
        let clonetarget = Array.isArray(target) ? [] : {};
        for(let key in target){
            clonetarget[key] = clone(target[key]) //递归
        }
        return clonetarget
    }else{
        return target
    }
}
```
无法防止循环递归，例如
```js
const target = {
    field1: 1,
    field2: undefined,
    field3: {
        child: 'child'
    },
    field4: [2, 4, 8]
};
target.target = target;
```
#### 3.防止循环递归版
```js
//WeakMap版
function clone(target,map=new WeakMap()){
    //先判断是否有下一层内容
    if(typeof target === 'object'){
        //判断对象还是数组
        let clonetarget = Array.isArray(target) ? [] : {};
        if(map.get(target)){
            return map.get(target)
        }
        map.set(target,clonetarget)
        for(let key in target){
            clonetarget[key] = clone(target[key],map) //递归
        }
        return clonetarget
    }else{
        return target
    }
}
//普通版
function deepClone(obj, parent = null){ // 改进（1）
  let result = Array.isArray(obj)?[]:{};
  let _parent = parent;  // 改进（2）
  while(_parent){ // 改进（3）
    if(_parent.originalParent === obj){
      return _parent.currentParent;
    }
    _parent = _parent.parent;
  }
  if(obj && typeof obj === "object"){
    for(let key in obj){
      if(obj.hasOwnProperty(key)){
        if(obj[key] && typeof obj[key] === "object"){
          result[key] = deepClone(obj[key],{ // 改进（4）
            originalParent: obj,
            currentParent: result,
            parent: parent
          });
        }else{
          result[key] = obj[key];
        }
      }
    }
  }
  return result;
}
```
#### 4.最终版1
```js
function deepClone(obj, parent = null){ 
  let result; // 最后的返回结果

  let _parent = parent; // 防止循环引用
  while(_parent){
    if(_parent.originalParent === obj){
      return _parent.currentParent;
    }
    _parent = _parent.parent;
  }
  
  if(obj && typeof obj === "object"){ // 返回引用数据类型(null已被判断条件排除))
    if(obj instanceof RegExp){ // RegExp类型
      result = new RegExp(obj.source, obj.flags)
    }else if(obj instanceof Date){ // Date类型
      result = new Date(obj.getTime());
    }else{
      if(obj instanceof Array){ // Array类型
        result = []
      }else{ // Object类型，继承原型链
        let proto = Object.getPrototypeOf(obj);
        result = Object.create(proto);
      }
      for(let key in obj){ // Array类型 与 Object类型 的深拷贝
        if(obj.hasOwnProperty(key)){
          if(obj[key] && typeof obj[key] === "object"){
            result[key] = deepClone(obj[key],{ 
              originalParent: obj,
              currentParent: result,
              parent: parent
            });
          }else{
            result[key] = obj[key];
          }
        }
      }
    }
  }else{ // 返回基本数据类型与Function类型,因为Function不需要深拷贝
    return obj
  }
  return result;
}
```

#### 5.最终版2
```js
const mapTag = '[object Map]';
const setTag = '[object Set]';
const arrayTag = '[object Array]';
const objectTag = '[object Object]';
const argsTag = '[object Arguments]';

const boolTag = '[object Boolean]';
const dateTag = '[object Date]';
const numberTag = '[object Number]';
const stringTag = '[object String]';
const symbolTag = '[object Symbol]';
const errorTag = '[object Error]';
const regexpTag = '[object RegExp]';
const funcTag = '[object Function]';

const deepTag = [mapTag, setTag, arrayTag, objectTag, argsTag];


function forEach(array, iteratee) {
    let index = -1;
    const length = array.length;
    while (++index < length) {
        iteratee(array[index], index);
    }
    return array;
}

function isObject(target) {
    const type = typeof target;
    return target !== null && (type === 'object' || type === 'function');
}

function getType(target) {
    return Object.prototype.toString.call(target);
}

function getInit(target) {
    const Ctor = target.constructor;
    return new Ctor();
}

function cloneSymbol(targe) {
    return Object(Symbol.prototype.valueOf.call(targe));
}

function cloneReg(targe) {
    const reFlags = /\w*$/;
    const result = new targe.constructor(targe.source, reFlags.exec(targe));
    result.lastIndex = targe.lastIndex;
    return result;
}

function cloneFunction(func) {
    const bodyReg = /(?<={)(.|\n)+(?=})/m;
    const paramReg = /(?<=\().+(?=\)\s+{)/;
    const funcString = func.toString();
    if (func.prototype) {
        const param = paramReg.exec(funcString);
        const body = bodyReg.exec(funcString);
        if (body) {
            if (param) {
                const paramArr = param[0].split(',');
                return new Function(...paramArr, body[0]);
            } else {
                return new Function(body[0]);
            }
        } else {
            return null;
        }
    } else {
        return eval(funcString);
    }
}

function cloneOtherType(targe, type) {
    const Ctor = targe.constructor;
    switch (type) {
        case boolTag:
        case numberTag:
        case stringTag:
        case errorTag:
        case dateTag:
            return new Ctor(targe);
        case regexpTag:
            return cloneReg(targe);
        case symbolTag:
            return cloneSymbol(targe);
        case funcTag:
            return cloneFunction(targe);
        default:
            return null;
    }
}

function clone(target, map = new WeakMap()) {

    // 克隆原始类型
    if (!isObject(target)) {
        return target;
    }

    // 初始化
    const type = getType(target);
    let cloneTarget;
    if (deepTag.includes(type)) {
        cloneTarget = getInit(target, type);
    } else {
        return cloneOtherType(target, type);
    }

    // 防止循环引用
    if (map.get(target)) {
        return map.get(target);
    }
    map.set(target, cloneTarget);

    // 克隆set
    if (type === setTag) {
        target.forEach(value => {
            cloneTarget.add(clone(value, map));
        });
        return cloneTarget;
    }

    // 克隆map
    if (type === mapTag) {
        target.forEach((value, key) => {
            cloneTarget.set(key, clone(value, map));
        });
        return cloneTarget;
    }

    // 克隆对象和数组
    const keys = type === arrayTag ? undefined : Object.keys(target);
    forEach(keys || target, (value, key) => {
        if (keys) {
            key = value;
        }
        cloneTarget[key] = clone(target[key], map);
    });

    return cloneTarget;
}
```

#### 参考资料
1.[浅拷贝与深拷贝（JavaScript）](https://www.jianshu.com/p/2188dcd91090)

2.[如何写出一个惊艳面试官的深拷贝?](https://segmentfault.com/a/1190000020255831)









