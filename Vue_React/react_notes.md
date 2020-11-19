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
- **Unmounting:** 组件卸载阶段。这个阶段完成组件的卸载和数据的销毁。涉及的生命周期方法为`componentWillUnmount()`

值得一提的是，在更改应用的DOM时，React内部具有阶段性概念。它们分别如下：

- **Render** ：组件会进行无副作用的渲染，适用于Pure components，在此阶段，react可以暂停、中止。
- **Pre-commit** ：在组件实际应用到DOM之前，允许React通过`getSnapshotBeforeUpdate()`读取DOM。
- **Commit** ：React进行DOM更新，并分别执行最终的生命周期`componentDidMount()`来进行挂载，`componentDidUpdate()`更新和`componentWillUnmount()`卸载。

React 16.3+阶段如图所示：

![React 16.3+](..\images\phases16.3.jpg)

在React 16.3之前如图所示：

![before](..\images\phasesbefore16.3.png)

## 15.[React有哪些生命周期方法？](https://www.jianshu.com/p/b331d0e4b398)

在16.3之前：

- **componentWillMount:**  在渲染前调用, 组件初始化时只调用，以后组件更新不调用，整个生命周期只调用一次，此时可以修改state。
- **componentDidMount:** 在第一次渲染后调用，只在客户端。之后组件已经生成了对应的DOM结构，可以通过this.getDOMNode()来进行访问。 如果你想和其他JavaScript框架一起使用，可以在这个方法中调用setTimeout, setInterval或者发送AJAX请求等操作(防止异步操作阻塞UI)。
- **componentWillReceiveProps:** 在组件接收到一个新的 prop (更新后)时被调用。这个方法在初始化render时不会被调用。
- **shouldComponentUpdate:**  react性能优化非常重要的一环。组件接受新的state或者props时调用，我们可以设置在此对比前后两个props和state是否相同，如果相同则返回false阻止更新，因为相同的属性状态一定会生成相同的dom树，这样就不需要创造新的dom树和旧的dom树进行diff算法对比，节省大量性能，尤其是在dom结构复杂的时候。在初始化时或者使用forceUpdate时不被调用。可以在确认不需要更新组件时使用。
- **componentWillUpdate:** 在组件接收到新的props或者state但还没有render时被调用。在初始化时不会被调用。（当shouldComponentUpdate返回true时调用）
- **componentDidUpdate:** 在组件完成更新后立即调用。在初始化时不会被调用。此时可以获取dom节点。
- **componentWillUnmount:** 组件将要卸载时调用，一些事件监听和定时器需要在此时清除。

16.3+版本：

- **getDerivedStateFromProps:**  将传入的props映射到state上面，这个函数会在每次re-rendering之前被调用。**即使你的props没有任何变化，而是父state发生了变化，导致子组件发生了re-render，这个生命周期函数依然会被调用**。 这个生命周期函数是为了替代`componentWillReceiveProps`存在的，所以在你需要使用`componentWillReceiveProps`的时候，就可以考虑使用`getDerivedStateFromProps`来进行替代了。

- **componentDidMount:**  在第一次渲染后调用，只在客户端。之后组件已经生成了对应的DOM结构，可以通过this.getDOMNode()来进行访问。 如果你想和其他JavaScript框架一起使用，可以在这个方法中调用setTimeout, setInterval或者发送AJAX请求等操作(防止异步操作阻塞UI)。

- **shouldComponentUpdate:**  react性能优化非常重要的一环。组件接受新的state或者props时调用，我们可以设置在此对比前后两个props和state是否相同，如果相同则返回false阻止更新，因为相同的属性状态一定会生成相同的dom树，这样就不需要创造新的dom树和旧的dom树进行diff算法对比，节省大量性能，尤其是在dom结构复杂的时候。在初始化时或者使用forceUpdate时不被调用。可以在确认不需要更新组件时使用。

- **getSnapshotBeforeUpdate:** 在render之前调用，state已更新，可以用来获取render之前的dom状态。

- **componentDidUpdate:** 在组件完成更新后立即调用。在初始化时不会被调用。此时可以获取dom节点。（当shouldComponentUpdate返回false时不会调用）

- **componentWillUnmount:** 组件将要卸载时调用，一些事件监听和定时器需要在此时清除。 

## 15.1[为什么废弃react生命周期函数？](https://segmentfault.com/a/1190000021272657)

## 15.2[React新生命周期--getDerivedStateFromProps](https://www.jianshu.com/p/50fe3fb9f7c3)

## 16.[什么是高阶组件(HOC)？](https://react.docschina.org/docs/higher-order-components.html)

- 高阶组件是一个函数，能够接受一个组件并返回一个新的组件。
- 可以用于组件复用。
- 大部分使用`mixin`和`class extends`的地方，高阶组件都是更好的方案——毕竟组合优于继承。

## 17.如何为高阶组件(HOC)创建props代理？

- 可以通过组件的代理模式实现：

```jsx
function HOC(WrappedComponent) {
  return class Test extends Component {
    render() {
      const newProps = {
        title: 'New Header',
        footer: false,
        showFeatureX: false,
        showFeatureY: true
      }

      return <WrappedComponent {...this.props} {...newProps} />
    }
  }
}
```

## 18.什么是children prop？

- 在典型的React数据流模型中，props 是组件对外的接口。props 作为父子组件沟通的桥梁，为组件的通信和传值提供了重要手段。

- this.props 对象的属性与组件的属性一一对应，但其中有一个比较特殊的参数：this.props.children。它表示组件所有的子节点。

- 在组件内部使用 this.props.children，可以拿到用户在组件里面放置的内容。

```js
const MyDiv = React.createClass({
  render: function() {
    return <div>{this.props.children}</div>
  }
})

ReactDOM.render(
  <MyDiv>
    <span>{'Hello'}</span>
    <span>{'World'}</span>
  </MyDiv>,
  node
)
```

## 19.[如何理解react中的super(),super(props)？](https://www.cnblogs.com/itgezhu/p/11199313.html)

- ES6中，子类是没有自己的 this 对象的，它只能继承自父类的 this 对象，然后对其进行加工，而super( )就是将父类中的this对象继承给子类的。没有 super，子类就得不到 this 对象。

- super(props)的作用就是在父类的构造函数中给props赋值一个对象this.props=props这样就能在它的下面定义你要用到的属性了，然而其他的由于没有传参就直接赋值为undefind

```js
//Passing props:
class MyComponent extends React.Component {
  constructor(props) {
    super(props)

    console.log(this.props) // prints { name: 'John', age: 42 }
  }
}
//Not passing props:
class MyComponent2 extends React.Component {
  constructor(props) {
    super()

    console.log(this.props) // prints undefined

    // but props parameter is still available
    console.log(props) // prints { name: 'John', age: 42 }
  }

  render() {
    // no difference outside constructor
    console.log(this.props) // prints { name: 'John', age: 42 }
  }
}
```

## 20.[什么是Reconciliation](https://zhuanlan.zhihu.com/p/107669756)

- 每次render的时候，React都会产生一棵由React元素组成的树，这个树形结构就是所谓的虚拟DOM，下次render的时候又会产生新的一颗树，对比这两棵树的不同的过程，就是调和，即Reconciliation。

## 21.[React中Suspense及lazy()懒加载及代码分割原理和使用的理解](https://blog.csdn.net/deng1456694385/article/details/88999842)

- lazy()方法是用来对项目代码进行分割,懒加载用的.只有当组件被加载,内部的资源才会导入。

- lazy()方法不支持直接exports，仅仅支持 default exports。

## 21.[什么是portals ？](https://www.jianshu.com/p/fef9b2135512)

- 插槽(Portals)能将子节点渲染到父组件的 DOM 层次之外

- 第一个参数（child）是任何可渲染的 React 子元素，例如一个元素，字符串或 片段(fragment)。第二个参数（container）则是一个 DOM 元素。

## 22.[react16之错误边界(Error Boundaries)](https://zhuanlan.zhihu.com/p/151861708)

- 可以通过用错误边界捕获来自react组件的错误

- 某些UI崩溃，不至于整个webapp崩溃

- 必须是class组件

- 如果一个 class 组件中定义了`static getDerivedStateFromError()`或`componentDidCatch()`这两个生命周期方法中的任意一个（或两个）时，那么这个组件就变成一个错误边界。当抛出错误后，使用`static getDerivedStateFromError()`渲染备用 UI ，使用`componentDidCatch()`打印错误信息。

```jsx
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  componentDidCatch(error, info) {
    // You can also log the error to an error reporting service
    logErrorToMyService(error, info)
  }

  static getDerivedStateFromError(error) {
     // Update state so the next render will show the fallback UI.
     return { hasError: true };
   }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>{'Something went wrong.'}</h1>
    }
    return this.props.children
  }
}

<ErrorBoundary>
  <MyWidget />
</ErrorBoundary>
```

## 23.[setState何时同步何时异步？](https://www.jianshu.com/p/799b8a14ef96)

- 由React控制的事件处理程序，以及生命周期函数调用setState不会同步更新state 。

- React控制之外的事件中调用setState是同步更新的。比如原生js绑定的事件，setTimeout/setInterval等。

- 大部分开发中用到的都是React封装的事件，比如onChange、onClick、onTouchMove等，这些事件处理程序中的setState都是异步处理的。

- setState通常的运用场景：

  1. 在生命周期里使用，其中一般运用较多的为componentDidMount，在这里setState以异步的方式执行。 
  2. 在react包装过的合成事件中执行setState，执行异步。
  3. settimeout里调用setState，setState同步执行。
  4. 原生事件中，即用 addEventListener或者是document.querySelector().onclick的方式，在这些事件回调里使用setState也会同步执行。 
- 相关原理：我们通常遇到的setState是batch操作，即当有一个setState被执行时，内部会创建一个待更新的队列。每一次setState都是往队列里推入新的东西。而在原生事件或者settimeout里，setState是立即执行，并不再是批量更新了。

## 24.[如何在react中使用装饰器decorators](https://blog.csdn.net/iiichigo/article/details/84572353)

- Decorator 是 ES7 的一个新语法，他可以对一些对象进行装饰包装然后返回一个被包装过的对象，可以装饰的对象包括：类，属性，方法等。打个比方：你出去玩，出门前戴了一顶帽子，这是帽子就是装饰器，你自己就是被装饰的对象。

- 装饰器的作用就是为已经存在的函数或对象添加额外的功能。 装饰器应用场景及理解: 装饰器本质上是一个函数,它可以让其他函数在不需要做任何代码变动的前提下增加额外功能 它经常用于有切面需求的 场景,比如:插入日志、性能测试、事务处理、缓存、权限校验等场景。

```js
@setTitle('Profile')
class Profile extends React.Component {
    //....
}

/*
  title is a string that will be set as a document title
  WrappedComponent is what our decorator will receive when
  put directly above a component class as seen in the example above
*/
const setTitle = (title) => (WrappedComponent) => {
  return class extends React.Component {
    componentDidMount() {
      document.title = title
    }

    render() {
      return <WrappedComponent {...this.props} />
    }
  }
}
```

## 25.[如何使用React.memo()来优化函数组件的性能](https://segmentfault.com/a/1190000018563418)

- React.memo(...)是React v16.6引进来的新属性。它的作用和React.PureComponent类似，是用来控制函数组件的重新渲染的。React.memo(...) 其实就是函数组件的React.PureComponent。

- React.memo会返回一个纯化(purified)的组件MemoFuncComponent，这个组件将会在JSX标记中渲染出来。当组件的参数props和状态state发生改变时，React将会检查前一个状态和参数是否和下一个状态和参数是否相同，如果相同，组件将不会被渲染，如果不同，组件将会被重新渲染。

## 26.[React新生命周期中的getDerivedStateFromProps有什么用？](https://www.jianshu.com/p/50fe3fb9f7c3)

- 这个生命周期的功能实际上就是将传入的props映射到state上面
- 意味着即使你的props没有任何变化，而是父state发生了变化，导致子组件发生了re-render，这个生命周期函数依然会被调用。
- 这个生命周期函数是为了替代componentWillReceiveProps存在的，所以在你需要使用componentWillReceiveProps的时候，就可以考虑使用getDerivedStateFromProps来进行替代了。

## 27.[React新生命周期中的getSnapshotBeforeUpdate有什么用？](https://blog.csdn.net/wust_cyl/article/details/84306393)

- 在render之前调用，state已更新
- 可以用来获取render之前的dom状态

## 28.[setState和replaceState的区别](https://blog.csdn.net/pixelEyesOfMao/article/details/80829376)

- `setState` 合并nextState和当前state，并重新渲染组件。setState是React事件处理函数中和请求回调函数中触发UI更新的主要方法。
- `replaceState`方法与`setState`类似，但是方法只会保留nextState中状态，原state不在nextState中的状态都会被删除。
- 也可以再`setState`中设置`false/null`来代替`replaceState`

## 29.如何监听state变化？

- 可以`componentDidUpdate`生命周期方法中监听，组件更新后会执行`componentDidUpdate`

```jsx
componentDidUpdate(object prevProps, object prevState)
```

## 30.如何更新state中对象的值？

- `Object.assign()`

```js
const user = Object.assign({}, this.state.user, { age: 42 })
this.setState({ user })
```

- `拓展运算符`

```js
const user = { ...this.state.user, age: 42 }
this.setState({ user })
```

- 在setState方法里更新

```js
this.setState(prevState => ({
  user: {
    ...prevState.user,
    age: 42
  }
}))
```

## 31.如何在行内`style`中添加浏览器前缀？

- React不会自动添加浏览器前缀，需要手动添加

```jsx
<div style={{
  transform: 'rotate(90deg)',
  WebkitTransform: 'rotate(90deg)', // note the capital 'W' here
  msTransform: 'rotate(90deg)' // 'ms' is the only lowercase vendor prefix
}} />
```

## 32.[什么是`render props`？](https://www.jianshu.com/p/5d20dc263231)

- 给组件添加一个值为函数的属性，这个函数可以在组件渲染（render）的时候调用。就是为了给原有组件“注入”其它组件的代码。

```jsx
<DataProvider render={data => (
  <h1>{`Hello ${data.target}`}</h1>
)}/>
```

## 33.`history`模式中`push`和`replace`的区别

- `push`方法会向 history 栈添加一个新的记录，当用户点击浏览器后退按钮时，则回到之前的 URL。
- `replace`导航后不会留下 history 记录。即使点击返回按钮也不会回到这个页面。

## 34.用户登录后如何实现自动化重定向？

- `react-router`模块中提供了`<Redirect>`可以实现重定向

```jsx
import React, { Component } from 'react'
import { Redirect } from 'react-router'

export default class LoginComponent extends Component {
  render() {
    if (this.state.isLoggedIn === true) {
      return <Redirect to="/your/redirect/page" />
    } else {
      return <div>{'Login Please'}</div>
    }
  }
}
```

## 35.什么是React测试中的Shallow Renderer？

- 浅层渲染对于在React中编写单元测试用例很有用。它使您可以更深层次地渲染组件，并断言其渲染方法返回的事实，而不必担心未实例化或渲染的子组件的行为。

```jsx
//原有组件
function MyComponent() {
  return (
    <div>
      <span className={'heading'}>{'Title'}</span>
      <span className={'description'}>{'Description'}</span>
    </div>
  )
}

//测试用例
import ShallowRenderer from 'react-test-renderer/shallow'

// in your test
const renderer = new ShallowRenderer()
renderer.render(<MyComponent />)

const result = renderer.getRenderOutput()

expect(result.type).toBe('div')
expect(result.props.children).toEqual([
  <span className={'heading'}>{'Title'}</span>,
  <span className={'description'}>{'Description'}</span>
])
```

## 36.[什么是React测试中的TestRenderer？](http://react.caibaojian.com.cn/docs/test-renderer.html)

- 该包提供了一个React的渲染器，可以用来将 React 组件渲染成纯 JavaScript 对象，不需要依赖于 DOM 和原生移动环境。
- 本质上，该包可以在无需使用浏览器或 jsdom 的情况下，轻松地抓取由 React DOM 或 React Native渲染出的平台视图层次结构（类似于DOM树）

## 37.[ReactTestUtils的作用](https://reactjs.bootcss.com/docs/test-utils.html)

- ReactTestUtils 可搭配你所选的测试框架，轻松实现 React 组件测试。在 Facebook 内部，使用 Jest 来轻松实现 JavaScript 测试。你可以从 Jest 官网的 React 教程中了解如何开始使用它。

## 38.[Jest测试框架入门](https://www.bbsmax.com/A/ZOJPepll5v/)

## 39.[React中的Flux](https://www.jianshu.com/p/d8008cf18450)

- flux 是 react 中的类似于 vuex 的公共状态管理方案，它是 Facebook 官方给出的应用架构，利用数据的单向流动的形式对公共状态进行管理。
- 现已不推荐使用。但是为了能更好的理解 Redux 方案，还是有必要熟悉 flux 的工作流程。

## 40.[React中的Redux](https://www.redux.org.cn/)

- Redux 是 JavaScript 状态容器，提供可预测化的状态管理。
- 核心概念：state、action、reducer
- 三大原则：单一数据源、State 是只读的、使用纯函数来执行修改

## 41.React 与Flux相比，Redux的缺点是什么？

- 您将需要学习避免发生突变： Flux对突变数据没有任何意见，但是Redux不喜欢突变，并且许多与Redux互补的软件包都假设您永远不会改变状态。您可以使用仅限开发人员的包（例如redux-immutable-state-invariantImmutable.js）强制执行此操作，或指示您的团队编写不可变的代码。 
- 您将必须仔细选择软件包：尽管Flux明确地不尝试解决诸如撤消/重做，持久性或形式之类的问题，但是Redux具有诸如中间件和商店增强器之类的扩展点，并且产生了丰富的功能。生态系统。 
- 目前还没有很好的Flow集成： Flux当前允许您执行非常令人印象深刻的静态类型检查，而Redux还不支持。

## 42.[对比React 16.3的新Context API和Redux](https://zhuanlan.zhihu.com/p/33829066)

