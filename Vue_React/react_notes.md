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

## 8.什么是 forward refs?

- *Ref forwarding*是一个特性，它允许一些组件获取接收到*ref*对象并将它进一步传递给子组件。

```jsx
const ButtonElement = React.forwardRef((props, ref) => (
  <button ref={ref} className="CustomButton">
    {props.children}
  </button>
));

// Create ref to the DOM button:
const ref = React.createRef();
<ButtonElement ref={ref}>{'Forward Ref'}</ButtonElement>
```

## 9.[什么是 Virtual DOM?](https://www.kancloud.cn/freya001/interview/1427965)

- *Virtual DOM*(VDOM) 是*Real DOM*的内存表示形式。UI 的展示形式被保存在内存中并与真实的 DOM 同步。这是在调用的渲染函数和在屏幕上显示元素之间发生的一个步骤。整个过程被称为*reconciliation*。

## 10.Virtual DOM 如何工作?

- 每当任何底层数据发生更改时，整个 UI 都将以 Virtual DOM 的形式重新渲染。
- 然后计算先前 Virtual DOM 对象和新的 Virtual DOM 对象之间的差异。
- 一旦计算完成，真实的 DOM 将只更新实际更改的内容。

## 11.[什么是React Fiber ？](https://segmentfault.com/a/1190000018701625)

- React Fibre 是 React 核心算法正在进行的重新实现。它是 React 团队两年多的研究成果。
- React Fiber 的目标是提高其对动画，布局和手势等领域的适用性。它的主体特征是增量渲染：能够将渲染工作分割成块，并将其分散到多个帧中。
- 其他主要功能包括在进行更新时暂停，中止或重新使用工作的能力，为不同类型的更新分配优先权的能力和新的并发原语。

## 12.什么是受控组件、非受控组件?

- 受控组件：在随后的用户输入中，能够控制表单中输入元素的组件被称为受控组件，即每个状态更改都有一个相关联的处理程序。

  例如，我们使用下面的 handleChange 函数将输入框的值转换成大写：

  ```js
  handleChange(event) {
    this.setState({value: event.target.value.toUpperCase()
  })
  ```

- 非受控组件：非受控组件是在内部存储其自身状态的组件，当需要时，可以使用 ref 查询 DOM 并查找其当前值。这有点像传统的 HTML。
  在下面的 UserProfile 组件中，我们通过 ref 引用`name`输入框：

  ```jsx
  class UserProfile extends React.Component {
    constructor(props) {
      super(props)
      this.handleSubmit = this.handleSubmit.bind(this)
      this.input = React.createRef()
    }
    handleSubmit(event) {
      alert('A name was submitted: ' + this.input.current.value)
      event.preventDefault()
    }
    render() {
      return (
        <form onSubmit={this.handleSubmit}>
          <label>
            {'Name:'}
            <input type="text" ref={this.input} />
          </label>
          <input type="submit" value="Submit" />
        </form>
      );
    }
  }
  ```

  在大多数情况下，建议使用受控组件来实现表单。

## 13.[什么是React中的状态提升？](https://zh-hans.reactjs.org/docs/lifting-state-up.html)

- React的状态提升就是用户对子组件操作，子组件不改变自己的状态，通过自己的props把这个操作改变的数据传递给父组件，改变父组件的状态，从而改变受父组件控制的所有子组件的状态，这也是React单项数据流的特性决定的。官方的原话是：**共享 state(状态) 是通过将其移动到需要它的组件的最接近的共同祖先组件来实现的。 这被称为“状态提升(Lifting State Up)”。**

## 14.组件生命周期的不同阶段是什么?

组件生命周期有三个阶段：

- **Mounting:** 组件挂载到DOM阶段。在`constructor()`中完成了React数据的初始化，相关的生命周期方法有`getDerivedStateFromProps()`, `render()`, 和 `componentDidMount()`
- **Updating:** 组件更新阶段。这个阶段主要通过改变`props`和`setState()`、`forceUpdate()`方法进行更新。相关的生命周期方法有`getDerivedStateFromProps()`, `shouldComponentUpdate()`, `render()`, `getSnapshotBeforeUpdate()`,`componentDidUpdate()`
- **Unmounting:**组件卸载阶段。这个阶段完成组件的卸载和数据的销毁。涉及的生命周期方法为`componentWillUnmount()`

值得一提的是，在更改应用的DOM时，React内部具有阶段性概念。它们分别如下：

- **Render** ：组件会进行无副作用的渲染，适用于Pure components，在此阶段，react可以暂停、中止。
- **Pre-commit** ：在组件实际应用到DOM之前，允许React通过`getSnapshotBeforeUpdate()`读取DOM。
- **Commit** ：React进行DOM更新，并分别执行最终的生命周期`componentDidMount()`来进行挂载，`componentDidUpdate()`更新和`componentWillUnmount()`卸载。

React 16.3+阶段如图所示：

![React 16.3+](..\images\phases16.3.jpg)

在React 16.3之前如图所示：

![before](..\images\phasesbefore16.3.png)