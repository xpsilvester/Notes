# JavaScript字符串常见算法

## 使用 ASCII 码进行字符串操作

### 去除文本中的标点符号

在做任何需求之前，都需要先对需求的上下文进行多方位理解，比如去除标点符号、数字这个需求在全英语的语境下可以说是约等于只保留英文字母。这样我们就可以从文本中直接筛选出英文字母和空格即可，这里可以使用 ASCII 码进行甄别。大写字母的 ASCII 码范围为 65 到 90，即 `A` 到 `Z`，而小写字母则为 97 到 122，空格的 ASCII 码为 32，换行符的 ASCII 码为 10。在 JavaScript 可以用 `string.charCodeAt()` 方法获取字符的 ASCII 码。

```js
const originalText = 'Are you 123456 OK?'

let wordOnlyText = ''

for (let i = 0; i < originalText.length; ++i) {
  const letter = originalText[i]
  const asciiCode = letter.charCodeAt()

  if ((asciiCode >= 65 && asciiCode <= 90) || (asciiCode >= 97 && asciiCode <= 122) || asciiCode === 32) {
    wordOnlyText += letter
  }
}
console.log(wordOnlyText) //=> "Are you  OK"
```

### 将所有大写字母转换为小写字母

上面我们用到了 `string.charCodeAt()` 方法来获取字符的 ASCII 码，那么自然也有对应的方法用于将 ASCII 码转换为对应字符 `String.fromCharCode(code)`。

而从字母的 ASCII 码范围可以看到，将大写字母的 ASCII 码数值加上 32 便是其对应小写字母的 ASCII 码数值。

```js
let lowerCaseText = ''

for (let i = 0; i < wordOnlyText.length; ++i) {
  const letter = wordOnlyText[i]
  const asciiCode = letter.charCodeAt()
  
  if (asciiCode >= 65 && asciiCode <= 90) {
    lowerCaseText += String.fromCharCode(asciiCode + 32)
  } else {
    lowerCaseText += letter
  }
}

console.log(lowerCaseText) //=> "hey dude how is it going"
```

幸运的是，在 JavaScript 中早就已经内置了将文本中的大写字母转换为小写字母的 API 了 —— `string.toLowerCase()`。

```js
const lowerCaseText = wordOnlyText.toLowerCase()
```

## 最长回文子串

题目描述：给定一个字符串 s，找到 s 中最长的回文子串。你可以假设 s 的最大长度为 1000。

```
示例 1：
输入: "babad"
输出: "bab"
注意: "aba" 也是一个有效答案。

示例 2：
输入: "cbbd"
输出: "bb"
```

```js
const longestPalindrome = function(s) {
    const dp = [];
    // 缓存字符串长度
    const len = s.length
    // 初始化状态二维数组
    for (let i = 0; i < len; i ++) {
        dp[i] = [];
    };
    
    // 初始化最长回文子串的两个端点值
    let st = 0, end=0
    // 初始化最长回文子串的初始值为1
    for(let i=0;i<len;i++) {
        dp[i][i] = 1
    }
    // 对相邻的子串做处理
    for(let i=0;i<len-1;i++){
        if(s[i]===s[i+1]) {
            dp[i][i+1] = 1
            st = i 
            end = i+1
        }
    }
    
    // n 代表子串的长度，从3开始递增
    for(let n=3;n<=len;n++) {
        // 下面的两层循环，用来实现状态转移方程
        for(let i=0;i<=len-n;i++) {
            let j = i+n-1
            if(dp[i+1][j-1]) {
                if(s[i]===s[j]){
                    // 若定位到更长的回文子串，则更新目标子串端点的索引值
                    dp[i][j] = 1
                    st = i 
                    end = j
                }
            }
        }
    }
    // 最后依据端点值把子串截取出来即可
    return s.substring(st,end+1);
}
```

## 实现一个模板字符串

```js
let templateStr = 'i am {{name}},age {{age}},job {{job}} ';
let data = {
    name:'xbd',
    age:18,
    job:'CTO'
}
function templateFunc(str,data){
    let computed = str.replace(/\{\{(\w+)\}\}/g,function (match,key) {
        return data[key];
    })
    return computed;
}
console.log(templateFunc(templateStr,data));
```

## [javascript trie前缀树的示例](https://segmentfault.com/a/1190000013018855)

