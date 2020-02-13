## 学习JavaScript MDN上的语法
参考地址：https://developer.mozilla.org/zh-CN/docs/Web/JavaScript


## [语法和数据类型](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide)
* 变量声明提升(Variable hoisting)
	！JavaScript 变量的另一特别之处是，你可以引用稍后声明的变量而不会引发异常。
	（这一概念称为变量声明提升(hoisting)；JavaScript 变量感觉上是被“提升”或移到了所有函数和语句之前。然而提升后的变量将返回 undefined 值。
	所以在使用或引用某个变量之后进行声明和初始化操作，这个被提升的引用仍将得到 undefined 值。）
	！由于存在变量声明提升，一个函数中所有的var语句应尽可能地放在接近函数顶部的地方。这将大大提升程序代码的清晰度。
	使用let可以阻止变量提升 ，还可以使用const声明一个常量阻止

* 函数提升（Function hoisting）
    对于函数，只有函数声明会被提升到顶部，而不包括函数表达式。

* 全局变量(Global variables)
	全局变量实际上是全局对象的属性。在网页中，（译注：缺省的）全局对象是 window，所以你可以用形如 window.variable的语法来设置和访问全局变量。
	（因此，你可以通过指定 window 或 frame 的名字，从一个 window 或 frame 访问另一个 window 或 frame 中声明的变量。
	例如，在文档里声明一个叫 phoneNumber 的变量，那么你就可以在子框架里使用 parent.phoneNumber 来引用它。）

* 常量(Constants)
	用关键字 const 创建一个只读(read-only)的常量。
	在同一作用域中，不能使用与变量名或函数名相同的名字来命名常量。

	！然而,对象属性是不受保护的,所以可以使用如下语句来执行。
	（const MY_OBJECT = {"key": "value"};
	MY_OBJECT.key = "otherValue";）


## [函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Functions)
* 作用域和函数堆栈
	递归：一个函数可以指向并调用自身。有三种方法可以达到这个目的：函数名、arguments.callee、作用域下的一个指向该函数的变量名
* 嵌套函数和闭包
	内部函数只可以在外部函数中访问。内部函数形成了一个闭包：它可以访问外部函数的参数和变量，但是外部函数却不能使用它的参数和变量。
	下面的例1展示了嵌套函数：

	保存变量：例2中 inside 被返回时 x 是怎么被保留下来的。一个闭包必须保存它可见作用域中所有参数和变量。
				因为每一次调用传入的参数都可能不同，每一次对外部函数的调用实际上重新创建了一遍这个闭包。
				只有当返回的 inside 没有再被引用时，内存才会被释放。

	命名冲突：当同一个闭包作用域下两个参数或者变量同名时，就会产生命名冲突。更近的作用域有更高的优先权，
				所以最近的优先级最高，最远的优先级最低。这就是作用域链。
				链的第一个元素就是最里面的作用域，最后一个元素便是最外层的作用域。

* 闭包
	JavaScript 允许函数嵌套，并且内部函数可以访问定义在外部函数中的所有变量和函数，
	以及外部函数能访问的所有变量和函数。但是，外部函数却不能够访问定义在内部函数中的变量和函数。
	！当内部函数以某一种方式被任何一个外部函数作用域访问时，一个闭包就产生了。如例3就是一个简单的闭包

	在例4的代码中，外部函数的name变量对内嵌函数来说是可取得的，而除了通过内嵌函数本身，
	没有其它任何方法可以取得内嵌的变量。内嵌函数的内嵌变量就像内嵌函数的保险柜。
	它们会为内嵌函数保留“稳定”——而又安全——的数据参与运行。而这些内嵌函数甚至不会被分配给一个变量，或者不必一定要有名字。

* 使用 arguments 对象
	使用arguments对象，你可以处理比声明的更多的参数来调用函数。
	这在你事先不知道会需要将多少参数传递给函数时十分有用。
	你可以用arguments.length来获得实际传递给函数的参数的数量，然后用arguments对象来取得每个参数。

	例5：设想有一个用来连接字符串的函数。唯一事先确定的参数是在连接后的字符串中用来分隔各个连接部分的字符（译注：比如例子里的分号“；”）
		 （你可以给这个函数传递任意数量的参数，它会将各个参数连接成一个字符串“列表”：）

* this 的词法
	在箭头函数出现之前，每一个新函数都重新定义了自己的 this 值，以至于有些功能实现不如意，如例6

* 预定义函数
  JavaScript语言有好些个顶级的内建函数：

	eval()方法会对一串字符串形式的JavaScript代码字符求值。

	uneval()方法创建的一个Object的源代码的字符串表示。

	isFinite()函数判断传入的值是否是有限的数值。 如果需要的话，其参数首先被转换为一个数值。

	isNaN()函数判断一个值是否是NaN。注意：isNaN函数内部的强制转换规则十分有趣； 另一个可供选择的是ECMAScript 6 中定义Number.isNaN() , 或者使用 typeof来判断数值类型。

	parseFloat() 函数解析字符串参数，并返回一个浮点数。

	parseInt() 函数解析字符串参数，并返回指定的基数（基础数学中的数制）的整数。

	decodeURI() 函数对先前经过encodeURI函数或者其他类似方法编码过的字符串进行解码。

	decodeURIComponent()方法对先前经过encodeURIComponent函数或者其他类似方法编码过的字符串进行解码。

	encodeURI()方法通过用以一个，两个，三个或四个转义序列表示字符的UTF-8编码替换统一资源标识符（URI）的某些字符来进行编码（每个字符对应四个转义序列，这四个序列组了两个”替代“字符）。

	encodeURIComponent() 方法通过用以一个，两个，三个或四个转义序列表示字符的UTF-8编码替换统一资源标识符（URI）的每个字符来进行编码（每个字符对应四个转义序列，这四个序列组了两个”替代“字符）。

## 例1
```JavaScript
function addSquares(a, b) {
  function square(x) {
    return x * x;
  }
  return square(a) + square(b);
}
a = addSquares(2, 3); // returns 13
b = addSquares(3, 4); // returns 25
c = addSquares(4, 5); // returns 41
```
## 例2
```JavaScript
function outside(x) {
  function inside(y) {
    return x + y;
  }
  return inside;
}
fn_inside = outside(3); // Think of it like: give me a function that adds 3 to whatever you give it
result = fn_inside(5); // returns 8

result1 = outside(3)(5); // returns 8
```
## 例3
```JavaScript
var pet = function(name) {          //外部函数定义了一个变量"name"
  var getName = function() {            
    //内部函数可以访问 外部函数定义的"name"
    return name; 
  }
  //返回这个内部函数，从而将其暴露在外部函数作用域
  return getName;               
};
myPet = pet("Vivie");
    
myPet();  
```
## 例4
```JavaScript
var createPet = function(name) {
  var sex;
  
  return {
    setName: function(newName) {
      name = newName;
    },
    
    getName: function() {
      return name;
    },
    
    getSex: function() {
      return sex;
    },
    
    setSex: function(newSex) {
      if(typeof newSex == "string" 
        && (newSex.toLowerCase() == "male" || newSex.toLowerCase() == "female")) {
        sex = newSex;
      }
    }
  }
}

var pet = createPet("Vivie");
pet.getName();                  // Vivie

pet.setName("Oliver");
pet.setSex("male");
pet.getSex();                   // male
pet.getName();                  // Oliver
```
## 例5
```JavaScript
function myConcat(separator) {
   var result = "", // initialize list
       i;
   // iterate through arguments
   for (i = 1; i < arguments.length; i++) {
      result += arguments[i] + separator;//这里的separator只能读取到第一个参数
   }
   return result;
}
// returns "red, orange, blue, "
myConcat(", ", "red", "orange", "blue");

// returns "elephant; giraffe; lion; cheetah; "
myConcat("; ", "elephant", "giraffe", "lion", "cheetah");

// returns "sage. basil. oregano. pepper. parsley. "
myConcat(". ", "sage", "basil", "oregano", "pepper", "parsley");
```
## 例6
```JavaScript
function Person() {
  // The Person() constructor defines `this` as itself.
  this.age = 0;

  setInterval(function growUp() {
    // In nonstrict mode, the growUp() function defines `this` 
    // as the global object, which is different from the `this`
    // defined by the Person() constructor.
    this.age++;
  }, 1000);
}

var p = new Person();
console.log(p.age)//0
```
## 解决方法：
```JavaScript
//1.在ECMAScript 3/5里，通过把this的值赋值给一个变量可以修复这个问题。
function Person() {
  var self = this; // Some choose `that` instead of `self`. 
                   // Choose one and be consistent.
  self.age = 0;

  setInterval(function growUp() {
    // The callback refers to the `self` variable of which
    // the value is the expected object.
    self.age++;
  }, 1000);
}
```
//2.箭头功能捕捉闭包上下文的this值，所以下面的代码工作正常。
```JavaScript
function Person(){
  this.age = 0;

  setInterval(() => {
    this.age++; // |this| properly refers to the person object
  }, 1000);
}

var p = new Person();

```

## [正则表达式](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Regular_Expressions)

* 常用符号：
  ^：匹配输入的开始。如果多行标志被设置为true，那么也匹配换行符后紧跟的位置。例如，/^A/ 并不会匹配 "an A" 中的 'A'，但是会匹配 "An E" 中的 'A'。

  $：匹配输入的结束。如果多行标示被设置为true，那么也匹配换行符前的位置。

  *：匹配前一个表达式0次或多次。等价于 {0,}。

  +：匹配前面一个表达式1次或者多次。等价于 {1,}。

  ?：匹配前面一个表达式0次或者1次。等价于 {0,1}。如果紧跟在任何量词 *、 +、? 或 {} 的后面，将会使量词变为非贪婪的（匹配尽量少的字符），和缺省使用的贪婪模式（匹配尽可能多的字符）正好相反。

  .：（小数点）匹配除换行符之外的任何单个字符。

  (x)：匹配 'x' 并且记住匹配项，就像下面的例子展示的那样。括号被称为 捕获括号。

  (?:x)：匹配 'x' 但是不记住匹配项。这种叫作非捕获括号，使得你能够定义为与正则表达式运算符一起使用的子表达式。

  x(?=y)：匹配'x'仅仅当'x'后面跟着'y'.这种叫做正向肯定查找。

  x(?!y)：匹配'x'仅仅当'x'后面不跟着'y',这个叫做正向否定查找。

  x|y：匹配‘x’或者‘y’。

  {n}：n是一个正整数，匹配了前面一个字符刚好发生了n次。

  {n,m}：n 和 m 都是整数。匹配前面的字符至少n次，最多m次。如果 n 或者 m 的值是0， 这个值被忽略。

  [xyz]：一个字符集合。匹配方括号的中任意字符，包括转义序列。你可以使用破折号（-）来指定一个字符范围。对于点（.）和星号（*）这样的特殊符号在一个字符集中没有特殊的意义。他们不必进行转义，不过转义也是起作用的。

  [^xyz]：一个反向字符集。也就是说， 它匹配任何没有包含在方括号中的字符。你可以使用破折号（-）来指定一个字符范围。任何普通字符在这里都是起作用的。

  \d:匹配一个数字。等价于[0-9]。

  \D:匹配一个非数字字符。

  \s:匹配一个空白字符，包括空格、制表符、换页符和换行符。

  \S:匹配一个非空白字符。

  \w:匹配一个单字字符（字母、数字或者下划线）。等价于[A-Za-z0-9_]。

  \W:匹配一个非单字字符。等价于[^A-Za-z0-9_]。

* 使用正则表达式的方法：

  exec  一个在字符串中执行查找匹配的RegExp方法，它返回一个数组（未匹配到则返回null）。

  test  一个在字符串中测试是否匹配的RegExp方法，它返回true或false。

  match 一个在字符串中执行查找匹配的String方法，它返回一个数组或者在未匹配到时返回null。

  search  一个在字符串中测试匹配的String方法，它返回匹配到的位置索引，或者在失败时返回-1。

  replace 一个在字符串中执行查找匹配的String方法，并且使用替换字符串替换掉匹配到的子字符串。

  split 一个使用正则表达式或者一个固定字符串分隔一个字符串，并将分隔后的子字符串存储到数组中的String方法。

* 通过标志进行高级搜索
  g 全局搜索。

  i 不区分大小写搜索。

  m 多行搜索。

  y 执行“粘性”搜索,匹配从目标字符串的当前位置开始，可以使用y标志。

* 常用正则匹配 [正则大全](https://any86.github.io/any-rule/)

  零和非零开头的数字：^(0|[1-9][0-9]*)$

  非零开头的最多带两位小数的数字：^([1-9][0-9]*)+(.[0-9]{1,2})?$ 

  带1-2位小数的正数或负数：^(\-)?\d+(\.\d{1,2})?$ 

  正数、负数、和小数：^(\-|\+)?\d+(\.\d+)?$ 

  有1~3位小数的正实数：^[0-9]+(.[0-9]{1,3})?$

  Email地址：^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$ 

  域名：[a-zA-Z0-9][-a-zA-Z0-9]{0,62}(/.[a-zA-Z0-9][-a-zA-Z0-9]{0,62})+/.? 

  手机号码：^1[3|4|5|7|8][0-9]{9}$

  国内电话号码(0511-4405222、021-87888822)：\d{3}-\d{8}|\d{4}-\d{7} 

  身份证号(15位、18位数字)：^\d{15}|\d{18}$ 

  删除字符串中所有相邻重复的项：'aabbaaaaccdeee'.replace(/(.)\1*/g, '$1');  // abacde  (.)记住任意字符 \1*出现了一次以上 ，'$1'替换成第一个字符

### [正则匹配应用](https://segmentfault.com/a/1190000020370458)

#### 解析 URL Params 为对象
```js
let url = 'http://www.domain.com/?user=anonymous&id=123&id=456&city=%E5%8C%97%E4%BA%AC&enabled';
parseParam(url)
/* 结果
{ user: 'anonymous',
  id: [ 123, 456 ], // 重复出现的 key 要组装成数组，能被转成数字的就转成数字类型
  city: '北京', // 中文需解码
  enabled: true, // 未指定值得 key 约定为 true
}
*/

function parseParam(url) {
  const paramsStr = /.+\?(.+)$/.exec(url)[1]; // 将 ? 后面的字符串取出来
  const paramsArr = paramsStr.split('&'); // 将字符串以 & 分割后存到数组中
  let paramsObj = {};
  // 将 params 存到对象中
  paramsArr.forEach(param => {
    if (/=/.test(param)) { // 处理有 value 的参数
      let [key, val] = param.split('='); // 分割 key 和 value
      val = decodeURIComponent(val); // 解码
      val = /^\d+$/.test(val) ? parseFloat(val) : val; // 判断是否转为数字

      if (paramsObj.hasOwnProperty(key)) { // 如果对象有 key，则添加一个值
        paramsObj[key] = [].concat(paramsObj[key], val);
      } else { // 如果对象没有这个 key，创建 key 并设置值
        paramsObj[key] = val;
      }
    } else { // 处理没有 value 的参数
      paramsObj[param] = true;
    }
  })

  return paramsObj;
}

function urlParam(url){
    const param = {};
    let decodeUrl = decodeURIComponent(url);
    decodeUrl.replace(/([^&=?]+)=([^&]+)/g,(m,$1,$2)=> {
        if(param.hasOwnProperty($1)){
            param[$1] = [].concat(param[$1], $2)
        }else{
            param[$1] = $2
        }
    });
    return param;
}
```

#### 模板引擎实现
```js
let template = '我是{{name}}，年龄{{age}}，性别{{sex}}';
let data = {
  name: '姓名',
  age: 18
}
render(template, data); // 我是姓名，年龄18，性别undefined

function render(template, data) {
  const reg = /\{\{(\w+)\}\}/; // 模板字符串正则
  if (reg.test(template)) { // 判断模板里是否有模板字符串
    const name = reg.exec(template)[1]; // 查找当前模板里第一个模板字符串的字段
    template = template.replace(reg, data[name]); // 将第一个模板字符串渲染
    return render(template, data); // 递归的渲染并返回渲染后的结构
  }
  return template; // 如果模板没有模板字符串直接返回
}
```
#### 转化为驼峰命名
```js
var s1 = "get-element-by-id"

// 转化为 getElementById
var f = function(s) {
    return s.replace(/-\w/g, function(x) {
        return x.slice(1).toUpperCase();
    })
}
```
#### 查找字符串中出现最多的字符和个数
例: abbcccddddd -> 字符最多的是d，出现了5次
```js
let str = "abcabcabcbbccccc";
let num = 0;
let char = '';

 // 使其按照一定的次序排列
str = str.split('').sort().join('');
// "aaabbbbbcccccccc"

// 定义正则表达式
let re = /(\w)\1+/g;
str.replace(re,($0,$1) => {
    if(num < $0.length){
        num = $0.length;
        char = $1;        
    }
});
console.log(`字符最多的是${char}，出现了${num}次`);

```
#### 实现千位分隔符
```js
// 保留三位小数
parseToMoney(1234.56); // return '1,234.56'
parseToMoney(123456789); // return '123,456,789'
parseToMoney(1087654.321); // return '1,087,654.321'

function parseToMoney(num) {
  num = parseFloat(num.toFixed(3));
  let [integer, decimal] = String.prototype.split.call(num, '.');
  integer = integer.replace(/\d(?=(\d{3})+$)/g, '$&,');
  return integer + '.' + (decimal ? decimal : '');
}

//正则表达式(运用了正则的前向声明和反前向声明):
function parseToMoney(str){
    // 仅仅对位置进行匹配
    let re = /(?=(?!\b)(\d{3})+$)/g; 
   return str.replace(re,','); 
}

```

## [数组的方法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Indexed_collections)
  Array 对象具有下列方法：（例子对应序号）

* concat() 连接两个数组并返回一个新的数组。
* join(deliminator = ',') 将数组的所有元素连接成一个字符串。
* push() 在数组末尾添加一个或多个元素，并返回数组操作后的长度。
* pop() 从数组移出最后一个元素，并返回该元素。
* shift() 从数组移出第一个元素，并返回该元素。
* unshift() 在数组开头添加一个或多个元素，并返回数组的新长度。
* slice(start_index, upto_index) 从数组提取一个片段，并作为一个新数组返回。
* splice(index, count_to_remove, addElement1, addElement2, ...)从数组移出一些元素，（可选）并替换它们。
* reverse() 颠倒数组元素的顺序：第一个变成最后一个，最后一个变成第一个。
* sort() 给数组元素排序。
* indexOf(searchElement[, fromIndex]) 在数组中搜索searchElement 并返回第一个匹配的索引。
* lastIndexOf(searchElement[, fromIndex]) 和 indexOf 差不多，但这是从结尾开始，并且是反向搜索。
* forEach(callback[, thisObject]) 在数组每个元素项上执行callback。
* map(callback[, thisObject]) 在数组的每个单元项上执行callback函数，并把返回包含回调函数返回值的新数组（译者注：也就是遍历数组，并通过callback对数组元素进行操作，并将所有操作结果放入数组中并返回该数组）。
* filter(callback[, thisObject]) 返回一个包含所有在回调函数上返回为true的元素的新数组（译者注：callback在这里担任的是过滤器的角色，当元素符合条件，过滤器就返回true，而filter则会返回所有符合过滤条件的元素）。
* every(callback[, thisObject]) 当数组中每一个元素在callback上被返回true时就返回true（译者注：同上，every其实类似filter，只不过它的功能是判断是不是数组中的所有元素都符合条件，并且返回的是布尔值）。
* some(callback[, thisObject]) 只要数组中有一项在callback上被返回true，就返回true（译者注：同上，类似every，不过前者要求都符合筛选条件才返回true，后者只要有符合条件的就返回true）。
* reduce(callback[, initialValue]) 使用回调函数 callback(firstValue, secondValue) 把数组列表计算成一个单一值（译者注：他数组元素两两递归处理的方式把数组计算成一个值）
* reduceRight(callback[, initalvalue]) 和 reduce()相似，但这从最后一个元素开始的。

## 例1

```JavaScript 
var myArray = new Array("1", "2", "3");
myArray = myArray.concat("a", "b", "c"); // ["1", "2", "3", "a", "b", "c"]
```
## 例2
```JavaScript
var myArray = new Array("Wind", "Rain", "Fire");
var list = myArray.join(" - ");//"Wind - Rain - Fire"
```
## 例3
```JavaScript
var myArray = new Array("1", "2");
myArray.push("3"); // ["1", "2", "3"]

```
## 例4
```JavaScript
var myArray = new Array("1", "2", "3");
var last = myArray.pop();// ["1", "2"], last = "3"
```
## 例5
```JavaScript
var myArray = new Array ("1", "2", "3");
var first = myArray.shift(); // ["2", "3"], first is "1"
```
## 例6
```JavaScript
var myArray = new Array ("1", "2", "3");
myArray.unshift("4", "5"); //["4", "5", "1", "2", "3"]
```
## 例7
```JavaScript
var myArray = new Array ("a", "b", "c", "d", "e");
myArray = myArray.slice(1, 4); // [ "b", "c", "d"]
```
## 例8

```JavaScript
var myArray = new Array ("1", "2", "3", "4", "5");
myArray.splice(1, 3, "a", "b", "c", "d"); // ["1", "a", "b", "c", "d", "5"]
```
## 例9
```JavaScript 
var myArray = new Array ("1", "2", "3");
myArray.reverse(); // [ "3", "2", "1" ]
```
## 例10
```JavaScript
var myArray = new Array("Wind", "Rain", "Fire");
myArray.sort(); // myArray = [ "Fire", "Rain", "Wind" ]
```
## 例11
```JavaScript
var a = ['a', 'b', 'a', 'b', 'a'];
console.log(a.indexOf('b')); // logs 1
console.log(a.indexOf('b', 2)); // logs 3
console.log(a.indexOf('z')); // logs -1
```
## 例12
```JavaScript
var a = ['a', 'b', 'c', 'd', 'a', 'b'];
console.log(a.lastIndexOf('b')); // logs 5
console.log(a.lastIndexOf('b', 4)); // logs 1
console.log(a.lastIndexOf('z')); // logs -1
```
## 例13
```JavaScript
var a = ['a', 'b', 'c'];
a.forEach(function(element) { console.log(element);} ); // a  b  c
```
## 例14
```JavaScript
var a1 = ['a', 'b', 'c'];
var a2 = a1.map(function(item) { return item.toUpperCase(); });
console.log(a2); // logs A,B,C
```
## 例15
```JavaScript
var a1 = ['a', 10, 'b', 20, 'c', 30];
var a2 = a1.filter(function(item) { return typeof item == 'number'; });
console.log(a2); // logs 10,20,30
```
## 例16
```JavaScript
function isNumber(value){
  return typeof value == 'number';
}
var a1 = [1, 2, 3];
console.log(a1.every(isNumber)); // logs true
var a2 = [1, '2', 3];
console.log(a2.every(isNumber)); // logs false
```
## 例17
```JavaScript
function isNumber(value){
  return typeof value == 'number';
}
var a1 = [1, 2, 3];
console.log(a1.some(isNumber)); // logs true
var a2 = [1, '2', 3];
console.log(a2.some(isNumber)); // logs true
var a3 = ['1', '2', '3'];
console.log(a3.some(isNumber)); // logs false
```
## 例18
```JavaScript
var a = [10, 20, 30];
var total = a.reduce(function(first, second) { return first + second; }, 0);
console.log(total) // Prints 60
```

* 数组的遍历方法
## 例19
```JavaScript
var arr=[1,2,3,4];
//使用forEach遍历
arr.forEach(function(val, index) {
  console.log(val, index);
});
/*输出
  1 0
  2 1
  3 2
  4 3
*/
//使用for..in..遍历
for(var i in arr){
	console.log(i,":",arr[i])
}
/*输出
0 : 1
1 : 2
2 : 3
3 : 4
*/
//
//使用for-of遍历
for(var value of arr){
	console.log(value)
}
/*
  1
  2
  3
  4
*/
//使用for遍历
for(var k=0;k<arr.length;k++){
  console.log(k,":",arr[k])
}
/*输出
0 ":" 1
1 ":" 2
2 ":" 3
3 ":" 4
*/
```


## [带键的集合](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Keyed_Collections)

* Map对象:一个Map对象就是一个简单的键值对映射集合，可以按照数据插入时的顺序遍历所有的元素。 

  例1代码演示了使用Map进行的一些基本操作，你可以使用for...of循环来得到所有的[key, value]。

* Object和Map的比较：

  （1）一般地，objects会被用于将字符串类型映射到数值。Object允许设置键值对、根据键获取值、删除键、检测某个键是否存在。而Map具有更多的优势。

  （2）Object的键均为Strings类型，在Map里键可以是任意类型。

  （3）必须手动计算Object的尺寸，但是可以很容易地获取使用Map的尺寸。

  （4）Map的遍历遵循元素的插入顺序。

  （5）Object有原型，所以映射中有一些缺省的键。（可以理解为map = Object.create(null)）。

  这三条提示可以帮你决定用Map还是Object：

  （1）如果键在运行时才能知道，或者所有的键类型相同，所有的值类型相同，那就使用映射。

  （2）如果需要将原始值存储为键，则使用映射，因为对象将每个键视为字符串，不管它是一个数字值、布尔值还是任何其他原始值。

  （3）如果需要对个别元素进行操作，使用对象。

* WeakMap对象:WeakMap对象也是键值对的集合。它的键必须是对象类型，值可以是任意类型。

  它的键被弱保持，也就是说，当其键所指对象没有其他地方引用的时候，它会被GC回收掉。WeakMap提供的接口与Map相同。

  与Map对象不同的是，WeakMap的键是不可枚举的。不提供列出其键的方法。列表是否存在取决于垃圾回收器的状态，是不可预知的。

### 集合
* Set对象:Set对象是一组值的集合，这些值是不重复的，可以按照添加顺序来遍历。
		  
  例2演示了Set的基本操作

* 数组和集合的转换：
          
  可以使用Array.from或展开操作符来完成集合到数组的转换。

  同样，Set的构造器接受数组作为参数，可以完成从Array到Set的转换。

  需要重申的是，Set对象中的值不重复，所以数组转换为集合时，所有重复值将会被删除。

* Array和Set的对比：
  一般情况下，在JavaScript中使用数组来存储一组元素，而新的集合对象有这些优势：

  数组中用于判断元素是否存在的indexOf 函数效率低下。

  Set对象允许根据值删除元素，而数组中必须使用基于下标的 splice 方法。

  数组的indexOf方法无法找到NaN值。

  Set对象存储不重复的值，所以不需要手动处理包含重复值的情况。

* WeakSet对象：

  WeakSet对象是一组对象的集合。WeakSet中的对象不重复且不可枚举。

  与Set对象的主要区别有：WeakSets中的值必须是对象类型，不可以是别的类型

  WeakSet的“weak”指的是，对集合中的对象，如果不存在其他引用，那么该对象将可被垃圾回收。

  于是不存在一个当前可用对象组成的列表，所以WeakSets不可枚举

### Map的键和Set的值的等值判断
	判断使用与===相似的规则。

	-0和+0相等。

	NaN与自身相等（与===有所不同）。

## 例1
```JavaScript
var sayings = new Map();
sayings.set('dog', 'woof');
sayings.set('cat', 'meow');
sayings.set('elephant', 'toot');
sayings.size; // 3
sayings.get('fox'); // undefined
sayings.has('bird'); // false
sayings.delete('dog');
sayings.has('dog'); // false

for (var [key, value] of sayings) {
  console.log(key + ' goes ' + value);
}
// "cat goes meow"
// "elephant goes toot"

sayings.clear();
sayings.size; // 0
```
## 例2
```JavaScript
var mySet = new Set();
mySet.add(1);
mySet.add("some text");
mySet.add("foo");

mySet.has(1); // true
mySet.delete("foo");
mySet.size; // 2

for (let item of mySet) console.log(item);
// 1
// "some text"
```

## [对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Working_with_Objects)
### 枚举一个对象的所有属性（例1）
* for...in 循环
	该方法依次访问一个对象及其原型链中所有可枚举的属性。
* Object.keys(o)
	该方法返回一个对象 o 自身包含（不包括原型中）的所有属性的名称的数组。
* Object.getOwnPropertyNames(o)
	该方法返回一个数组，它包含了对象 o 所有拥有的属性（无论是否可枚举）的名称。

* Reflect.ownKeys(obj)
  该方法返回一个数组,包含对象自身的所有属性,不管属性名是Symbol或字符串,也不管是否可枚举。

## 例1
```JavaScript
var obj = {'0':'a','1':'b','2':'c'};
//for...in
for(var i in obj){
  console.log(i,":",obj[i]);
}
/*输出
  0 : a
  1 : b
  2 : c
*/
//Object.keys(o)
Object.keys(obj).forEach(function(key){
	console.log(key,obj[key])
})
/*输出
  0 a
  1 b
  2 c
*/
//Object.getOwnPropertyNames(o)
Object.getOwnPropertyNames(obj).forEach(function(key){
	console.log(key,obj[key]);
})
/*输出
  0 a
  1 b
  2 c
*/
//Reflect.ownKeys(obj)
Reflect.ownKeys(obj).forEach(function(key){
	console.log(key,obj[key])
})
/*输出
  0 a
  1 b
  2 c
*/
```

### [对象模型的细节](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide/Details_of_the_Object_Model)

### [继承与原型链](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Inheritance_and_the_prototype_chain)


## 例2
```JavaScript
function listAllProperties(o){     
	var objectToInspect;     
	var result = [];
	
	for(objectToInspect = o; objectToInspect !== null; objectToInspect = Object.getPrototypeOf(objectToInspect)){  
		result = result.concat(Object.getOwnPropertyNames(objectToInspect));  
	}
	
	return result; 
}
```
### [Date对象](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date)

## Date 对象方法
```JavaScript
//new Date 返回当日的日期和时间
var date = new Date() //现在的时间 Fri Nov 02 2018 09:45:50 GMT+0800 (中国标准时间)
date = new Date(1518517931477) //自定义的时间（根据毫秒数1518517931477决定） Tue Feb 13 2018 18:32:11 GMT+0800 (中国标准时间)

/*=======以Tue Feb 13 2018 18:32:11 GMT+0800 (中国标准时间)为例============*/

//getDate() 从 Date 对象返回一个月中的某一天 (1 ~ 31)
date.getDate() // 13 (13号)

//getDay() 从 Date 对象返回一周中的某一天 (0 ~ 6)
date.getDay() // 2 (周二)

//getMonth() 从 Date 对象返回月份 (0 ~ 11)
date.getMonth() // 1 (二月，注意显示的时候要+1,索引从0开始)

//getFullYear() 从 Date 对象以四位数字返回年份
date.getFullYear() // 2018 (2018年)

//getHours() 返回 Date 对象的小时 (0 ~ 23)
date.getHours() //18 (18点)

//getMinutes() 返回 Date 对象的分钟 (0 ~ 59)
date.getMinutes() // 32 (32分)

//getSeconds() 返回 Date 对象的秒数 (0 ~ 59)
date.getSeconds() // 11 (秒)

//getMilliseconds() 返回 Date 对象的毫秒(0 ~ 999)
date.getMilliseconds() // 477 (477毫秒)

//getTime() 返回 1970 年 1 月 1 日至今的毫秒数
date.getTime() // 1518517931477 (1970 年 1 月 1 日至今的毫秒数)

//getTimezoneOffset() 返回本地时间与格林威治标准时间 (GMT) 的分钟差
date.getTimezoneOffset() // -480 (相差-480分钟)

//getUTCDate() 根据世界时从 Date 对象返回月中的一天 (1 ~ 31)
date.getUTCDate() // 13 (13号)

//getUTCDay() 根据世界时从 Date 对象返回周中的一天 (0 ~ 6)
date.getUTCDay() // 2 (周二)

//getUTCMonth() 根据世界时从 Date 对象返回月份 (0 ~ 11)
date.getUTCMonth() // 1 (二月，注意显示的时候要+1,索引从0开始)

//getUTCFullYear() 根据世界时从 Date 对象返回四位数的年份
date.getUTCFullYear() // 2018 (2018年)

//getUTCHours() 根据世界时返回 Date 对象的小时 (0 ~ 23)
date.getUTCHours() // 10 (世界时间 10 点)

//getUTCMinutes() 根据世界时返回 Date 对象的分钟 (0 ~ 59)
date.getUTCMinutes() //32 (32分)

//getUTCSeconds() 根据世界时返回 Date 对象的秒钟 (0 ~ 59)
date.getUTCSeconds() // 11 (秒)

//getUTCMilliseconds() 根据世界时返回 Date 对象的毫秒(0 ~ 999)
date.getUTCMilliseconds() // 477 (477毫秒)

//parse() 返回1970年1月1日午夜到指定日期（字符串）的毫秒数
Date.parse("Jul 8, 2005") //1120752000000 从 1970/01/01 到 2005/07/08 的毫秒数

//setDate() 设置 Date 对象中月的某一天 (1 ~ 31)
var d = new Date()
d.setDate(15) //Thu Nov 15 2018 10:35:14 GMT+0800 (中国标准时间) 通过 setDate() 方法把当前月的天设置为 15

//setMonth() 设置 Date 对象中月份 (0 ~ 11)
var d=new Date()
d.setMonth(0) //Tue Jan 02 2018 10:50:00 GMT+0800 (中国标准时间) 通过 setMonth() 方法把对象 d 的月字段设置为 0 （一月）

//setFullYear() 设置 Date 对象中的年份（四位数字）
var d = new Date()
d.setFullYear(1992,10,3) //Tue Nov 03 1992 10:52:12 GMT+0800 (中国标准时间) 通过 setFullYear() 把日期设置为 November 3, 1992

//setHours() 设置 Date 对象中的小时 (0 ~ 23)
var d = new Date()
d.setHours(15,35,1) //Fri Nov 02 2018 15:35:01 GMT+0800 (中国标准时间) 通过 setHours() 方法把时间设置为 15:35:01

//setMinutes() 设置 Date 对象中的分钟 (0 ~ 59)
var d = new Date()
d.setMinutes(1) //Fri Nov 02 2018 10:01:31 GMT+0800 (中国标准时间) 通过 setMinutes() 方法把当前时间的分钟字段设置为 01

//setSeconds() 设置 Date 对象中的秒钟 (0 ~ 59)
var d = new Date()
d.setSeconds(1) //Fri Nov 02 2018 10:57:01 GMT+0800 (中国标准时间) 通过 setSeconds() 方法把当前时间的秒字段设置为 01

//setMilliseconds() 设置 Date 对象中的毫秒 (0 ~ 999)
var d = new Date()
d.setMilliseconds(1) //Fri Nov 02 2018 10:58:41 GMT+0800 (中国标准时间) 通过 setMilliseconds() 方法把当前时间的毫秒字段设置为 001

//setTime() 以毫秒设置 Date 对象
var d = new Date()
d.setTime(77771564221) //Mon Jun 19 1972 11:12:44 GMT+0800 (中国标准时间) 向 1970/01/01 添加 77771564221 毫秒

//setUTCDate() 根据世界时设置 Date 对象中月份的一天 (1 ~ 31)
var d = new Date()
d.setUTCDate(15) //Thu Nov 15 2018 11:07:37 GMT+0800 (中国标准时间) 通过 setUTCDate() 方法把当前月的天字段设置为 15

//setUTCFullYear() 根据世界时设置 Date 对象中的年份（四位数字）
var d = new Date()
d.setUTCFullYear(1992,10,3) //Tue Nov 03 1992 11:10:15 GMT+0800 (中国标准时间) 通过 setUTCFullYear() 方法把日期设置为 November 3, 1992

//setUTCHours() 根据世界时设置 Date 对象中的小时 (0 ~ 23)
var d = new Date();
d.setUTCHours(23); //Sat Nov 03 2018 07:12:02 GMT+0800 (中国标准时间) 通过 setUTCHours() 方法将 UTC 小时设置为 23

//setUTCMinutes() 根据世界时设置 Date 对象中的分钟 (0 ~ 59)
var d = new Date()
d.setUTCMinutes(1) //Fri Nov 02 2018 11:01:32 GMT+0800 (中国标准时间) 通过 setUTCMinutes() 方法把当前时间的分钟字段设置为 01

//setUTCSeconds() 根据世界时设置 Date 对象中的秒钟 (0 ~ 59)
var d = new Date()
d.setUTCSeconds(1) //Fri Nov 02 2018 11:15:01 GMT+0800 (中国标准时间) 通过 setUTCSeconds() 把当前时间的秒字段设置为 01

//setUTCMilliseconds() 根据世界时设置 Date 对象中的毫秒 (0 ~ 999)
var d = new Date()
d.setUTCMilliseconds(1) //Fri Nov 02 2018 11:16:32 GMT+0800 (中国标准时间) 通过 setUTCMilliseconds() 方法把当前时间的毫秒字段设置为 001

//toSource() 返回该对象的源代码
function employee(name,job,born)
{
this.name=name;
this.job=job;
this.born=born;
}
var bill=new employee("Bill Gates","Engineer",1985);
bill.toSource(); //({name:"Bill Gates", job:"Engineer", born:1985}) 

//toString() 把 Date 对象转换为字符串
var d = new Date()
d.toString() //Fri Nov 02 2018 11:19:24 GMT+0800 (中国标准时间) 把今天的日期转换为字符串

//toTimeString() 把 Date 对象的时间部分转换为字符串
var date = new Date()
date.toTimeString() //11:20:59 GMT+0800 (中国标准时间)

//toDateString() 把 Date 对象的日期部分转换为字符串
date.toDateString() //Fri Nov 02 2018 

//toUTCString() 根据世界时，把 Date 对象转换为字符串
date.toUTCString() //Fri, 02 Nov 2018 03:20:59 GMT

//toLocaleString() 根据本地时间格式，把 Date 对象转换为字符串
date.toLocaleString() //2018/11/2 上午11:20:59 

//toLocaleTimeString() 根据本地时间格式，把 Date 对象的时间部分转换为字符串
date.toLocaleTimeString() //上午11:20:59

//toLocaleDateString() 根据本地时间格式，把 Date 对象的日期部分转换为字符串
date.toLocaleDateString() //2018/11/2

//UTC() 根据世界时返回 1970 年 1 月 1 日 到指定日期的毫秒数
var minutes = 1000 * 60
var hours = minutes * 60
var days = hours * 24
var years = days * 365
var t = Date.UTC(2005,7,8)
var y = t/years
document.write("It's been: " + y + " years from 1970/01/01")
document.write(" to 2005/07/08!")
//It's been: 35.62465753424657 years from 1970/01/01 to 2005/07/08!

//valueOf() 返回 Date 对象的原始值
var date = new Date()
date.valueOf() //1541129307885
```

### [柯里化](https://codepen.io/Universalist/post/currying-functions-in-javascript)

## Currying 柯里化

```JavaScript
function argsArray(argsObject) {
    return Array.prototype.slice.call(argsObject, 0);
}
function curry(f, n) {
    var args = argsArray(arguments);
    if (typeof n === 'undefined')
        args[1] = f.length;
    if (n === args.length - 2)
        return f.apply(undefined, args.slice(2));
    return function() {
        return curry.apply(undefined, args.concat(argsArray(arguments)));
    };
}
//第一种优化
function curry(f,n = 0,...arr){
    n = n == 0 ? f.length : n;
    if(arr.length == n){
        return f(...arr)
    }
    return function(...arr2){
        return curry(...[f,n,...arr,...arr2])
    }
}
//第二种优化
const curry = ( fn, arr = []) => (...args) => ( a => a.length === fn.length? fn(...a) : curry(fn, a))([...arr, ...args])


// 实现一个add方法，使计算结果能够满足如下预期：
// add(1)(2)(3) = 6
// add(1, 2, 3)(4) = 10
// add(1)(2)(3)(4)(5) = 15

function add(...arr){
    let _arr = [...arr]
    
    let _add = (...arr2)=>{
        _arr = [..._arr,...arr2]
        return _add
    }
    
    _add.toString = () => _arr.reduce((prev,curr)=> prev + curr)

    return _add
}

//add(1)(2)(3).toString() = 6;
//add(1, 2, 3)(4).toString() = 10;
//add(1)(2)(3)(4)(5).toString() = 15;
//add(1, 2, 3)(4, 5)(6).toString() = 21;
```

## [Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Promise 对象用于表示一个异步操作的最终完成 (或失败), 及其结果值.

```js
//PromisTest.js ----- 运行: node PromisTest.js
//根目录files文件夹中有 1.txt 、 2.txt 、 3.txt 三个文件
//依次异步读取文件信息
const fs = require('fs')

//读取文件方法
function getFileByPath(fpath) {
  //返回一个Promise对象
  return new Promise(function (resolve, reject) {
    fs.readFile(fpath, 'utf-8', (err, dataStr) => {

      if (err) return reject(err)
      resolve(dataStr)

    })
  })
}

//链式调用Promise
//读取文件1.txt
getFileByPath('./files/1.txt')
  .then(function (data) {
    console.log(data)

    // 读取文件2.txt
    return getFileByPath('./files/2.txt')
  })
  .then(function (data) {
    console.log(data)

    // 读取文件3.txt
    return getFileByPath('./files/3.txt')
  })
  .then(function (data) {
    console.log(data)
  })
  .catch(function (err) { // catch 的作用： 如果前面有任何的 Promise 执行失败，则立即终止所有 promise 的执行，并 马上进入 catch 去处理 Promise中 抛出的异常；
    console.log('这是自己的处理方式：' + err.message)
  })
```

## [Generator](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Generator)

Generator函数是ES6提供的一种异步编程解决方案，可以解决回调地狱、异步流控等问题

```js
//上班流程控制：起床 --> 洗漱 --> 出门 --> 到公司打卡

//起床
let rise = (success)=>{
  setTimeout(()=>{
    console.log('起床')
    success() //回调
  },500)
}

//洗漱
let wash = (success)=>{
  setTimeout(()=>{
    console.log('洗漱')
    success() //回调
  },500)
}

//出门
let out = (success)=>{
  setTimeout(()=>{
    console.log('出门')
    success() //回调
  },500)
}

//到公司打卡
let clock = (success)=>{
  setTimeout(()=>{
    console.log('到公司打卡')
    success() //回调
  },500)
}

//流程控制
let run = (fn)=>{
  let gen = fn()
  let next = ()=>{

    let result = gen.next()

    if(!result.done){
      result.value(next) //next作为入参，即本工序成功后，执行下一工序
    }else{
      return
    }
  }
  next()
}

//具体流程
function* task(){
  yield rise;
  yield wash;
  yield out;
  yield clock;
}

//执行
run(task)

```






