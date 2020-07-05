# CSS常见问题

## [CSS3新增伪类](https://blog.csdn.net/qq_41696819/article/details/81531494)

```
新增伪类	作用
p:first-of-type	选择属于其父元素的首个<p>元素的每个<p>元素。
p:last-of-type	选择属于其父元素的最后<p>元素的每个<p>元素。
p:only-of-type	选择属于其父元素唯一的<p>元素的每个<p>元素。
p:only-child	选择属于其父元素唯一的子元素的每个<p>元素。
p:nth-child(n)	选择属于其父元素的第n个子元素的每个<p>元素。
p:nth-last-child(n)	选择属于其父元素的倒数第n个子元素的每个<p>元素。
p:nth-of-type(n)	选择属于其父元素第n个<p>元素的每个<p>元素。
p:nth-last-of-type(n) 	选择属于其父元素倒数第n个<p>元素的每个<p>元素。
p:last-child	选择属于其父元素最后一个子元素的每个<p>元素。
p:empty	    选择没有子元素的每个<p>元素（包括文本节点）。
p:target 	选择当前活动的<p>元素。
:not(p)	    选择非<p>元素的每个元素。
:enabled	控制表单控件的可用状态。
:disabled 	控制表单控件的禁用状态。
:checked 	单选框或复选框被选中。
```

## [伪类 :nth-child() 和 :nth-of-type() 区别](https://blog.csdn.net/Zeng__Yi/article/details/99285186)

```
### :nth-child()的简单方式的理解:

##### 1.先计算是第几个节点。
##### 2.然后再判断选择器。

### :nth-of-type()的简单方式理解：

##### 1.先将同父节点按照标签分组
##### 2.按照分组后的标签计算是第几个节点
##### 3.然后再判断选择器
```

## [H5和CSS3新特性](https://www.cnblogs.com/ainyi/p/9777841.html)

## [水平垂直居中布局](https://zhuanlan.zhihu.com/p/68906614)

```scss
//1.flex水平垂直居中:
.father {
   display:flex;
   align-items: center;   //交叉轴
   justify-content:center;  //主线
   background:grey;
   height:100vh;
}

//2.使用position + transform，实现水平垂直居中：
.father {
  background:grey;
  height:100vh;
  position: relative;
}

p{
  position: absolute;
  left:50%;
  top:50%;
  transform:translate(-50%,-50%)
}

//3.使用position + calc
.father {
  background:grey;
  height:100vh;  
  position: relative;
}

p{
  background-color:red;
  position: absolute;
  width:100px;
  height:50px;
  top:calc(50% - 25px);
  left:calc(50% - 50px)
}

//4.使用绝对定位 + margin
.father {
  background:grey;
  height:100vh; 
  position: relative;
}

p{
  width:100px;
  height:100px;
  background-color:red;
  position: absolute;
  top:0;
  bottom:0;
  left:0
  right:0;
  margin:auto;
}

//5.使用绝对定位 + margin
.father {
  background:grey;
  height:100vh; 
  position: relative;
}

p{
  width:100px;
  height:100px;
  background-color:red;
  position: absolute;
  top:50%;
  left:50%
  margin:-50px 0 0 -50px;
}
```

## [三栏布局](https://juejin.im/post/5eace2176fb9a04340658974#heading-60)
```
float布局，absolute布局，flex布局，table布局，grid布局
```

## [CSS绘制三角形—border法](https://www.jianshu.com/p/9a463d50e441)

```HTML
div {
    width: 0;
    height: 0;
    border: 40px solid;
    border-color: transparent transparent red transparent;
}
```

## [flex布局](https://juejin.im/post/589965c9128fe1006569cc9d)

## [flex布局](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)
```
flex-direction 
决定主轴的方向（即项目的排列方向）row(默认) | row-reverse | column | column-reverse

flex-wrap 
如果一条轴线排不下，如何换行 nowrap(默认) | wrap | wrap-reverse 

flex-flow 
flex-direction属性和flex-wrap属性的简写形式 <flex-direction> || <flex-wrap>

justify-content 
项目在主轴上的对齐方式 flex-start | flex-end | center | space-between | space-around

align-items 
项目在交叉轴上如何对齐 flex-start | flex-end | center | baseline | stretch

align-content 
多根轴线的对齐方式。如果项目只有一根轴线，该属性不起作用 
flex-start | flex-end | center | space-between | space-around | stretch
```

## [一道前端面试题：flex空间分配规则](https://juejin.im/post/5e4932d151882549417fc031)

## [关于 Flex 中的 flex-grow、flex-shrink、flex-basis](https://www.jianshu.com/p/ea53c2daff9c)

## [Flex中的 flex-grow、flex-shrink、flex-basis的默认值](https://www.cnblogs.com/lvmylife/p/7670149.html)

```
flex 的默认值 flex-grow flex-shrink flex-basis :0 1 auto
当 flex 取值为 none，则计算值为 0 0 auto
当 flex 取值为 auto，则计算值为 1 1 auto
当 flex 取值为一个非负数字，则该数字为 flex-grow 值，flex-shrink 取 1，flex-basis 取 0%
当 flex 取值为一个长度或百分比，则视为 flex-basis 值，flex-grow 取 1，flex-shrink 取 1
```

## [伪类与伪元素的区别](https://www.cnblogs.com/ammyben/p/8012747.html)

## [伪元素 ::after 和 ::before 应该这么用（一）](https://segmentfault.com/a/1190000015468617)

## [css中选择器的权重是怎样的？](https://www.cnblogs.com/rubylouvre/archive/2010/03/17/1687786.html)

## [圣杯布局和双飞翼布局的理解和区别，并用代码实现](https://github.com/haizlin/fe-interview/issues/2)

## [IE和其他浏览器的盒子模型的区别是什么？](https://www.cnblogs.com/xiayu25/p/6306790.html)

```
IE 6 以前版本用的IE盒子模型 border-box (width包括padding，margin、border)
```

## transition和animation区别

```
transition是过渡效果，animation是逐帧动画
```

## 浏览器rem计算出来结果是小数怎么渲染

## [什么是BFC？看这一篇就够了](https://blog.csdn.net/sinat_36422236/article/details/88763187)

```
BFC是一个独立的布局环境，其中的元素布局是不受外界的影响，并且在一个BFC中，块盒与行盒（行盒由一行中所有的内联元素所组成）都会垂直的沿着其父元素的边框排列。
```

## [一招帮你搞定基线位置(line box基线)](https://www.jianshu.com/p/6f9d7da220c8)

## [深度剖析Baseline设计原理](https://juejin.im/post/59c9bc196fb9a00a402e0166)

## [如何让 height:100%; 起作用](https://www.cnblogs.com/AllenChou/p/7851796.html)

## 如何清除浮动

```
1. 后面的元素 clear:both
2. 父元素 overflow:hidden
3. 父元素 float
```

## sass的导入@import

```
1.css3的@import，在css样式表之中使用绝对或相对地址指定导入的外部样式表文件。 
如：@import url("style/index.css");

css3中的@import可能会造成延迟加载，有的地方没有样式。

2. sass @import解决了这个问题，它能将多个scss合并为一个。 
如：@import "style/index.scss"

3. 在vue项目中
<style lang="scss">
@import url('xxx');
</style>
会直接以css方式打包
<style lang="scss">
@import 'xxx';
</style>
则会以sass方式打包

```