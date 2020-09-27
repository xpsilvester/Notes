# React Core

React 核心知识点记录。

## 1.什么是JSX？

- JSX是一种JavaScript的语法扩展，它实际上是为`React.createElement()`提供语法糖，提供了JavaScript的表达式以及类似HTML的模板语法。
- 在JSX中嵌入用户输入是安全的，React DOM在渲染之前默认会[过滤](https://baike.baidu.com/item/过滤)所有传入的值。它可以确保应用不会被注入攻击。所有的内容在渲染之前都被转换成了字符串。这样可以有效地防止[XSS](https://baike.baidu.com/item/XSS/917356)（跨站脚本攻击）。

## 2.React中Element与Component的区别?

- ReactElement是描述屏幕上所见的内容的数据结构,是对于UI的对象的表述.典型的ReactElement就是利用JSX构建的声明式代码片段,然后被转化为createElement的调用组合。
- ReactComponent则是可以接收参数输入并且返回某个ReactElement的函数或者类。

## 3.什么是 Pure Components?

- `React.PureComponent`与`React.Component`完全相同，只是它为你处理了`shouldComponentUpdate()`方法。当属性或状态发生变化时，PureComponent 将对属性和状态进行**浅比较**。另一方面，一般的组件不会将当前的属性和状态与新的属性和状态进行比较。因此，在默认情况下，每当调用`shouldComponentUpdate`时，默认返回 true，所以组件都将重新渲染。

## 4.为什么不能直接改变原有state？

- 是否调用render进行再次渲染是由state是否变化决定的。setState本质是通过一个队列机制实现state更新的，执行setState时，会将要更新的state合并后放入状态队列，而不会立刻更新state，队列机制可以批量更新state。如果不通过setState而直接修改this.state，那么这次state的变化不会放入状态队列中，下次调用setState再进行状态队列进行合并时，会忽略之前直接直接对state修改，这样就无法合并到这次变化，实际也就没有将想要的state更新上去。setState是异步的。

- 只要调用了setState，就会在合并后生成一个新的state，只要判断state指向的是否是同一个内存地址就知道state是否发生了变化，以此来决定是否进行render重新渲染。如果不用这种方式都直接操作this.state，也就是同一块内存，要侦测state是否发生变化（如angular中的deepwatch）来决定是否重新渲染会非常复杂和低效。redux的reducer中返回新的对象也是同理。react状态管理库还有redux-sagas、redux-observable、MobX等。


## 5.[什么是React合成事件？](https://www.cnblogs.com/chrissong/p/10432010.html)

- 事件处理程序通过 合成事件（SyntheticEvent）的实例传递，SyntheticEvent 是浏览器原生事件跨浏览器的封装。SyntheticEvent 和浏览器原生事件一样有 stopPropagation()、preventDefault() 接口，而且这些接口夸浏览器兼容。 如果由于某种原因发现您需要基础浏览器事件，只需使用该nativeEvent属性即可获取它。

## 6.什么是 "key" 属性，在元素数组中使用它们有什么好处?

- 在React的diff中， *Keys*帮助 React 识别哪些项已更改、添加或删除。
- 由于列表项的顺序可能发生改变，因此并不推荐使用*indexes*作为*keys*。这可能会对性能产生负面影响，并可能导致组件状态出现问题。

## 7.[React中的refs有什么作用，如何使用？](https://segmentfault.com/a/1190000020247827)

- 在react中，可以使用refs来访问dom，或者在render中创建react对象。
- 使用refs的主要用途是做一些动画的交互、媒体控件的播放、获取焦点、获取文本等
- 使用refs的方式有两种，一种是使用`React.createRef() API`，另一种是使用 `回调形式的refs`。