# Webpack实现原理

## webpack打包原理分析

webpack 在执⾏npx webpack进⾏打包后，都⼲了什么事情？

```js
(function(modules) {
    var installedModules = {};
    function __webpack_require__(moduleId) {
        if (installedModules[moduleId]) {
            return installedModules[moduleId].exports;
        }
        var module = (installedModules[moduleId] = {
            i: moduleId,
            l: false,
            exports: {}
        });
        modules[moduleId].call(
            module.exports,
            module,
            module.exports,
            __webpack_require__
        );
        module.l = true;
        return module.exports;
    }
    return __webpack_require__((__webpack_require__.s =
                                "./index.js"));
})({
    "./index.js": function(module, exports) {
        eval(
            '// import a from "./a";\n\nconsole.log("hello
            word");\n\n\n//# sourceURL=webpack:///./index.js?'
        );
    }
});
```

⼤概的意思就是，我们实现了⼀个webpack_require 来实现⾃⼰的模块 化，把代码都缓存在installedModules⾥，代码⽂件以对象传递进来，key是 路径，value是包裹的代码字符串，并且代码内部的require，都被替换成了 webpack_require 处理依赖模块的路径

## 实现步骤

- 基础配置，webpack会读取配置
  * 找到⼊⼝模块
- ⼊⼝分析
  * 分析依赖模块(拿到模块的路径)
  * 分析内容（并对内容处理）
  * 编译内容
- 依赖模块（递归的⽅式）
  * 分析依赖模块
  * 分析内容（并对内容处理）
  * 编译内容
- ⽣成bundle.js（这个js可以直接在浏览器中执⾏）

## ⾃⼰实现⼀个bundle.js

- 模块分析：读取⼊⼝⽂件，分析代码

```js
const fs = require("fs");
const fenximokuai = filename => {
 const content = fs.readFileSync(filename, "utf-8");
 console.log(content);
};
fenximokuai("./index.js");
```

- 拿到⽂件中依赖，这⾥我们不推荐使⽤字符串截取，引⼊的模块名越 多，就越麻烦，不灵活，这⾥我们推荐使⽤@babel/parser，这是babel7的⼯具，来帮助我们分析内部的语法，包括es6，返回⼀个ast抽象语法树

`@babel/parser`:https://babeljs.io/docs/en/babel-parser

```js
//安装@babel/parser
npm install @babel/parser --save
//bundle.js
const fs = require("fs");
const parser = require("@babel/parser");
const fenximokuai = filename => {
    const content = fs.readFileSync(filename, "utf-8");
    const Ast = parser.parse(content, {
        sourceType: "module"
    });
    console.log(Ast.program.body);
};
fenximokuai("./index.js");
```

- 接下来我们就可以根据body⾥⾯的分析结果，遍历出所有的引⼊模块，但是⽐较麻烦，这⾥还是推荐babel推荐的⼀个模块 @babel/traverse，来帮我们处理。

```bash
npm install @babel/traverse --save
```

```js
const fs = require("fs");
const path = require("path");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const fenximokuai = filename => {
    const content = fs.readFileSync(filename, "utf-8");
    const Ast = parser.parse(content, {
        sourceType: "module"
    });
    const dependencies = [];
    //分析ast抽象语法树，根据需要返回对应数据，
    //根据结果返回对应的模块，定义⼀个数组，接受⼀下node.source.value的值
    traverse(Ast, {
        ImportDeclaration({ node }) {
            console.log(node);
            dependencies.push(node.source.value);
        }
    });
    console.log(dependencies);
};
fenximokuai("./index.js");
```

我们要分析出信息： 

- ⼊⼝⽂件 
- ⼊⼝⽂件引⼊的模块 
  * 引⼊路径 
  * 在项⽬中⾥的路径 
- 可以在浏览器⾥执⾏的代码

处理现在的路径问题：

```js
//需要⽤到path模块
const parser = require("@babel/parser");
//修改 dependencies 为对象，保存更多的信息
const dependencies = {};
//分析出引⼊模块，在项⽬中的路径
const newfilename =
 "./" + path.join(path.dirname(filename),
node.source.value);
//保存在dependencies⾥
dependencies[node.source.value] = newfilename;
```

把代码处理成浏览器可运⾏的代码，需要借助@babel/core，和 @babel/preset-env，把ast语法树转换成合适的代码导出所有分析出的信息：

```bash
npm i @babel/core @babel/preset-env --save
```

```js
const babel = require("@babel/core");
const { code } = babel.transformFromAst(Ast, null, {
    presets: ["@babel/preset-env"]
});
return {
    filename,
    dependencies,
    code
};
```

完成代码参考：

```js
const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const babel = require('@babel/core');
const moduleAnalyser = (filename) => {
    const content = fs.readFileSync(filename, 'utf-8');
    const ast = parser.parse(content, {
        sourceType: 'module'
    });
    const dependencies = {};
    traverse(ast, {
        ImportDeclaration({ node }) {
            const dirname = path.dirname(filename);
            const newFile = './' + path.join(dirname,
                                             node.source.value);
            dependencies[node.source.value] = newFile;
        }
    });
    const { code } = babel.transformFromAst(ast, null, {
        presets: ["@babel/preset-env"]
    });
    return {
        filename,
        dependencies,
        code
    }
}
const moduleInfo = moduleAnalyser('./src/index.js');
console.log(moduleInfo);
```

- 分析依赖

上⼀步我们已经完成了⼀个模块的分析，接下来我们要完成项⽬⾥所有模块的分析：

```js
const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const babel = require('@babel/core');
const moduleAnalyser = (filename) => {
    const content = fs.readFileSync(filename, 'utf-8');
    const ast = parser.parse(content, {
        sourceType: 'module'
    });
    const dependencies = {};
    traverse(ast, {
        ImportDeclaration({ node }) {
            const dirname = path.dirname(filename);
            const newFile = './' + path.join(dirname,
                                             node.source.value);
            dependencies[node.source.value] = newFile;
        }
    });
    const { code } = babel.transformFromAst(ast, null, {
        presets: ["@babel/preset-env"]
    });
    return {
        filename,
        dependencies,
        code
    }
}
const makeDependenciesGraph = (entry) => {
    const entryModule = moduleAnalyser(entry);
    const graphArray = [ entryModule ];
    for(let i = 0; i < graphArray.length; i++) {
        const item = graphArray[i];
        const { dependencies } = item;
        if(dependencies) {
            for(let j in dependencies) {
                graphArray.push(
                    moduleAnalyser(dependencies[j])
                );
            }
        }
    }
    const graph = {};
    graphArray.forEach(item => {
        graph[item.filename] = {
            dependencies: item.dependencies,
            code: item.code
        }
    });
    return graph;
}
const graghInfo = makeDependenciesGraph('./src/index.js');
console.log(graghInfo);
```

- ⽣成代码

```js
const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const babel = require('@babel/core');
const moduleAnalyser = (filename) => {
    const content = fs.readFileSync(filename, 'utf-8');
    const ast = parser.parse(content, {
        sourceType: 'module'
    });
    const dependencies = {};
    traverse(ast, {
        ImportDeclaration({ node }) {
            const dirname = path.dirname(filename);
            const newFile = './' + path.join(dirname,
                                             node.source.value);
            dependencies[node.source.value] = newFile;
        }
    });
    const { code } = babel.transformFromAst(ast, null, {
        presets: ["@babel/preset-env"]
    });
    return {
        filename,
        dependencies,
        code
    }
}
const makeDependenciesGraph = (entry) => {
    const entryModule = moduleAnalyser(entry);
    const graphArray = [ entryModule ];
    for(let i = 0; i < graphArray.length; i++) {
        const item = graphArray[i];
        const { dependencies } = item;
        if(dependencies) {
            for(let j in dependencies) {
                graphArray.push(
                    moduleAnalyser(dependencies[j])
                );
            }
        }
    }
    const graph = {};
    graphArray.forEach(item => {
        graph[item.filename] = {
            dependencies: item.dependencies,
            code: item.code
        }
    });
    return graph;
}
const generateCode = (entry) => {
    const graph = JSON.stringify(makeDependenciesGraph(entry));
    return `
(function(graph){
function require(module) {
function localRequire(relativePath) {
return
require(graph[module].dependencies[relativePath]);
}
var exports = {};
(function(require, exports, code){
eval(code)
})(localRequire, exports, graph[module].code);
return exports;
};
require('${entry}')
})(${graph});
`;
}
const code = generateCode('./src/index.js');
console.log(code);
```

