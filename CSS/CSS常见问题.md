# CSS常见问题

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

