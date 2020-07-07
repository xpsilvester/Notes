# React VS Vue

## Vue和React源码区别

### React

- 单向数据流;
- setSate 更新data 值后，组件自己处理; 
- differ 是首位是除删除外是固定不动的,然后依次遍历对比;

### Vue

- v-model 可以实现双向数据流,但只是v-bind:value 和 v-on:input的语法糖;
- 通过 this 改变值，会触发 Object.defineProperty的 set，将依赖放入队列，下一个事件循环开始时执行更新时才会进行必要的DOM更新，是外部监听处理更新；
- differcompile 阶段的optimize标记了static 点，可以减少 differ 次数，而且是采用双向遍历方法；

## React 和 Vue 渲染过程区别

### React

- 生成期 -> 更新 -> 卸载(销毁挂载的组件)

### Vue

- new Vue()初始化 -> compileToFunction:(将 template 编译成 render 函数) -> watcher -> patch

## Redux和 Vuex 设计思想

### Redux

- Redux则是一个纯粹的状态管理系统，React利用React-Redux将它与React框架结合起来
- 只有一个用createStore方法创建一个 store
- action接收 view 发出的通知，告诉 Store State 要改变，有一个 type 属性
- reducer:纯函数来处理事件，纯函数指一个函数的返回结果只依赖于它的参数，并且在执行过程里面没有副作用,得到一个新的 state

### Vuex

- Vuex是吸收了Redux的经验，放弃了一些特性并做了一些优化，代价就是VUEX只能和VUE配合
- store:通过 new Vuex.store创建 store，辅助函数mapState
- getters:获取state，有辅助函数 mapGetters
- action:异步改变 state，像ajax，辅助函数mapActions
- mutation:同步改变 state,辅助函数mapMutations

### 对比

```
1.Redux： view——>actions——>reducer——>state变化——>view变化（同步异步一样）
2.Vuex： view——>commit——>mutations——>state变化——>view变化（同步操作） 
  view——>dispatch——>actions——>mutations——>state变化——>view变化（异步操作）
```

## 参考连接：[你不知道的React 和 Vue 的20个区别](https://juejin.im/post/5ef55acde51d4534bf67a878)