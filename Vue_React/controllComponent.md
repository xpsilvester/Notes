# React受控组件与非受控组件

React 的很大一部分是这样的想法，即组件负责控制和管理自己的状态。React 的很大一部分是这样的想法，即组件负责控制和管理自己的状态。

当我们将 native HTML 表单元素（ input, select, textarea 等）投入到组合中时会发生什么？我们是否应该使用 React 作为“单一的真理来源”，就像我们习惯使用React一样？ 或者我们是否允许表单数据存在 DOM 中，就像我们习惯使用HTML表单元素一样？ 这两个问题是受控（controlled） VS 不受控制（uncontrolled）组件的核心。

`受控组件`是React控制的组件，也是表单数据的唯一真理来源。

`非受控制组件( uncontrolled component )`是您的表单数据由 DOM 处理，而不是您的 React 组件。

## [React 表单](https://react.docschina.org/docs/forms.html#controlled-components)

在 React 里，HTML 表单元素的工作方式和其他的 DOM 元素有些不同，这是因为表单元素通常会保持一些内部的 state。例如这个纯 HTML 表单只接受一个名称：

```html
<form>
  <label>
    名字:
    <input type="text" name="name" />
  </label>
  <input type="submit" value="提交" />
</form>
```

此表单具有默认的 HTML 表单行为，即在用户提交表单后浏览到新页面。如果你在 React 中执行相同的代码，它依然有效。但大多数情况下，使用 JavaScript 函数可以很方便的处理表单的提交， 同时还可以访问用户填写的表单数据。实现这种效果的标准方式是使用“受控组件”。

## 受控组件

在 HTML 中，表单元素（如`<input>`、 `<textarea>` 和 `<select>`）之类的表单元素通常自己维护 state，并根据用户输入进行更新。而在 React 中，可变状态（mutable state）通常保存在组件的 state 属性中，并且只能通过使用 [`setState()`](https://react.docschina.org/docs/react-component.html#setstate)来更新。

我们可以把两者结合起来，使 React 的 state 成为“唯一数据源”。渲染表单的 React 组件还控制着用户输入过程中表单发生的操作。被 React 以这种方式控制取值的表单输入元素就叫做“受控组件”。

例如，如果我们想让前一个示例在提交时打印出名称，我们可以将表单写为受控组件：

```jsx
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {value: ''};

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    alert('提交的名字: ' + this.state.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          名字:
          <input type="text" value={this.state.value} onChange={this.handleChange} />
        </label>
        <input type="submit" value="提交" />
      </form>
    );
  }
}
```

## [非受控组件](https://react.docschina.org/docs/uncontrolled-components.html)

在大多数情况下，我们推荐使用 [受控组件](https://react.docschina.org/docs/forms.html#controlled-components) 来处理表单数据。在一个受控组件中，表单数据是由 React 组件来管理的。另一种替代方案是使用非受控组件，这时表单数据将交由 DOM 节点来处理。

要编写一个非受控组件，而不是为每个状态更新都编写数据处理函数，你可以 [使用 ref](https://react.docschina.org/docs/refs-and-the-dom.html) 来从 DOM 节点中获取表单数据。

例如，下面的代码使用非受控组件接受一个表单的值：

```jsx
class NameForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.input = React.createRef();
  }

  handleSubmit(event) {
    alert('A name was submitted: ' + this.input.current.value);
    event.preventDefault();
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          Name:
          <input type="text" ref={this.input} />
        </label>
        <input type="submit" value="Submit" />
      </form>
    );
  }
}
```

## 参考资料

[React 受控组件](https://react.docschina.org/docs/forms.html#controlled-components)

[React 非受控组件](https://react.docschina.org/docs/uncontrolled-components.html)

[受控和非受控组件真的那么难理解吗？(React实际案例详解)](https://juejin.im/post/6858276396968951822)