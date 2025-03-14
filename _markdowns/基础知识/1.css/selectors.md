---
title: CSS 选择器
date: 2020-07-17 17:42:17
category: Infrastructure
---

CSS 选择器学习

<!-- more -->

> <i class="fa fa-exclamation"></i> 代表的是实验中功能，Chrome67+，若无效请前往chrome://flags开启"Experimental Web Platform features"标示。

## ::before & ::after
在元素固定的首尾插入虚拟节点，在DOM树可以查看得到。此节点JS是获取不到。与伪类区别于，伪元素编写的CSS作用于该伪元素本身，而伪类编写的CSS作用于宿主上。

- content 的内容可以是 string 或 image
- 在 Dom 树可以见到该伪元素
- : vs :: 来区别伪类和伪元素，对于伪元素可以两种方式都可以
- IE8只能识别:

## :active
元素被激活时触发，如 `a` 链接被点击，按下还没松开时。
- 最常见的场景是 a 链接被激活，:active 也可适用于任意场景
- 对于 a 链接所有状态先后顺序记忆方式：“LV HA”

## <i class="fa fa-exclamation"></i> :any-link
选择所有超链接元素。它匹配所有满足 :link 元素或 :visited 的元素
- 拥有[href]属性的元素都可将其认为是超链接元素
- 该选择器为level4，若想兼容其它浏览器需要带上浏览器前缀，如：
 :-webkit-any-link {}
 :-moz-any-link {}
 : any-link {}

```HTML
<a href="#"></a>
```

```CSS
:any-link {
    color: red;
}
```

## adjacent slibling 相邻兄弟元素选择器
选择相邻兄弟元素 +
- 仅当第二个元素紧跟在第一个元素后，并且从属于同一个父元素时才会匹配到第二个元素

```HTML
  <div>
    <p>p1</p>
    <p>get selected</p>
  </div>

  <div>
    <p>p11</p>
    <span>span</span>
    <p>not get selected</p>
  </div>
  <style>p + p { color: red; }</style>
```

## [attribute]
CSS属性选择器根据给定属性是否存在或属性的值匹配元素。
如下示例，精确匹配 链接地址是 https://www.synyi.com 的 `a` 元素，设置 red 颜色。

```HTML
  <a href="https://www.synyi.com">https://www.synyi.com</a>
  <br>
  <a href="https://www.baidu.com">https://www.baidu.com</a>

  <style>a[href="https://www.synyi.com"] { color: red; }</style>
```

除了精确匹配，总计有下述7种方式匹配方式
<p class="codepen" data-height="265" data-theme-id="dark" data-default-tab="html,result" data-user="sofia92" data-slug-hash="xxVwooQ" style="height: 265px; box-sizing: border-box; display: flex; align-items: center; justify-content: center; border: 2px solid; margin: 1em 0; padding: 1em;" data-pen-title="[attribute]">
  <span>See the Pen <a href="https://codepen.io/sofia92/pen/xxVwooQ">
  [attribute]</a> by SofiaYu (<a href="https://codepen.io/sofia92">@sofia92</a>)
  on <a href="https://codepen.io">CodePen</a>.</span>
</p>
<script async src="https://static.codepen.io/assets/embed/ei.js"></script>


|Syntax||example||
|:--|:--|:--|:--|
|[attr]|elements with an attribute name of attr|img[alt]|匹配到 alt="abstract art" alt="athlete starting"|
|[attr="value"]|属性名称与值完全匹配|img[alt="art"]|匹配到 alt="art" 匹配不到 alt="athlete starting"|
|[attr*="value"]|Value contains|img[alt*="art"]|匹配到 alt="abstract art" alt="athlete starting"|
|[attr~="value"]|Value is in a space-separated list|img[alt~="art"]|匹配到 alt="abstract art" 不能匹配 alt="abstractart "|
|[attr^="value"]|Value starts with|img[alt^="art"]|匹配到 alt="art abstract" 不能匹配 alt="abstract art"|
|[attr｜="value"]|Value is first in a dash-separated list|img[alt｜="art"]|匹配到 alt="art-abstract" 不能匹配 alt="abstract-art"|
|[attr$="value"]|Value ends with|img[alt$="art"]|匹配到 alt="abstractart" 匹配 alt="abstract-art"|

`[attribute]`的使用除了上述单个属性匹配还可以组合使用，比如：
```CSS
a[href="https://study.com"][data-type="studyMath"] { ... }
```

## <i class="fa fa-exclamation"></i> :blank
实验中的功能，目前没有浏览器支持～

`:blank` 伪类基于 `:empty` 伪类功能之上，`:blank` 和 `:empty`都能够匹配那些没有内容的元素或内容仅仅是comment的元素，如下：
```HTML
<style>
    p:blank, p:empty { display:none };
</style>

<p></p>
<p><!-- 这是一段注释 --></p>
```

但是如果是下面的写法，`:empty`将不会匹配到：
```HTML
<p>
    <!-- 这是一段注释 -->
    <!-- 这是一段注释 -->

</p>
```

## :checked
:checked CSS 伪类选择器表示任何处于选中状态的radio(`<input type="radio">`), checkbox (`<input type="checkbox">`) 或("select") 元素中的option HTML元素("option")

如下示例，我们可以修改选中状态的label字体颜色，可以利用选中状态实现无JS参与的toggle交互效果。

```HTML
  <input type="radio" name="radioItem"><label>radio1</label>
  <input type="radio" name="radioItem"><label>radio2</label>
  
  <br><br>
  <input type="checkbox"><label>checkbox1</label>
  <input type="checkbox"><label>checkbox2</label>
  
  <br><br>
  <input type="checkbox" class="expand-trigger"><label>toggle expand</label>
  <div id="expand">expand</div>

  <style>
    *:checked + label  { color: #009FFF; }
    #expand { visibility: collapse; }

    .expand-trigger:checked ~ #expand { visibility: visible; }
  </style>
```

## >
当使用  > 选择符分隔两个元素时,它只会匹配那些作为第一个元素的直接后代(子元素)的第二元素集

```HTML
<div>
  <span>Span 1. set bg.
    <span>Span 2. set bg.</span>
  </span>
</div>
<span>Span 3. Not set bg</span>

<style>
div > span {
  background-color: DodgerBlue;
}
</style>
```

## :default
`:default` 表示 一组相关元素中的默认表单元素。常见该选择器可以在 `<button>`, `<input type="checkbox">`, `<input type="radio">` 上使用。常用来指定默认元素，不随数据变更而改变。
<input type="radio" name="sex">         <label>男性</label>
<input type="radio" name="sex" checked> <label>女性</label>

<style>
  input:default + label::after {
    content: '(default)';
    font-size: 12px;
  }
</style>

```HTML
<input type="radio" name="sex">         <label>男性</label>
<input type="radio" name="sex" checked> <label>女性</label>

<style>
  input:default + label::after {
    content: '(default)';
    font-size: 12px;
  }
</style>
```

## <i class="fa fa-exclamation"></i> :dir()
`:dir()` 伪类匹配特定文字书写方向的元素，可使用 :dir() 或 :dir(ltr) 或:dir(rtl) ；

- `:dir()` 会自动查找浏览器的默认设置编排，大多数浏览器都是从左到右的文字编排，所以大部分场景下，`:dir()` === `:dir(ltr)`;
- `:dir()` 与 `[dir='ltr']` 并不完全相同，后者使用的是属性匹配选择方式，它只会匹配到拥有 `dir` 属性且值为 `ltr` 的元素们，并不会匹配到 auto 的元素。

## :disabled
`:disabled` 表示任何被禁用的元素，长用于表单元素上表示其不可输入、不可选择等不可使用的情况，与此对立的是 `enabled`;

<input type="text" placeholder="被禁用的text" disabled>
<input type="number" placeholder="被禁用的number" disabled>
<input type="radio" disabled> radio
<input type="checkbox" disabled> checkbox

## :empty
`:empty` CSS 伪类 代表没有子元素的元素。子元素只可以是元素节点或文本（包括空格）。（ps. 没有闭合标签的元素也会被匹配到

匹配到：
```HTML  
<p></p>
<p><!-- ss --></p>
<hr>
<img src="" alt="">
i.e.
```

## :enabled
`:enabled` 表示任何被启用的（enabled）元素。如果一个元素能够被激活（如选择、点击或接受文本输入），或者能够获取焦点，则该元素是启用的。元素也有一个禁用的状态（disabled state），在被禁用时，元素不能被激活或获取焦点。

默认状态是 enabled, 可以搭配 `:disabled` 使用元素状态变化的交互效果。


## :first
`:first` 使用`@page :first` 表示在打印文档的时候，第一页的样式

> 你不能改变所有的css属性. 你只能改变 margins、 orphans、 widows、文档什么时候换页。别的所有css样式都会被忽略。


## :first-child
`:first-child` 表示匹配一组元素中的第一个子元素。如 ul>li*10, 匹配到第一个 li。


## :first-of-type
```HTML
<p class="item">p1元素 会被匹配到</p>
<h4 class="item">h 元素 会被匹配到</h4>
<p class="item">p2元素 不会被匹配到</p>

<style>
.item:first-of-type {
  border-bottom: 2px solid #009FFF;
}
</style>
```

## ::first-line
`::first-line` 会选中某块级元素第一行。注意如果中间如果存在行内元素间隔，间隔后的元素也会被匹配到；

首行只在 block-container box内部才有意义, 因此 `::first-line` 伪元素 只在display属性值为block, inline-block, table-cell, list-item 或者 table-caption的元素上才起作用. 其他情况下, `::first-line` 毫无意义.

```HTML
  <p class="first-line">
      第一行 会被匹配到
    <span>Span元素</span>
    <img class="img" src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=180811274,3179596559&fm=26&gp=0.jpg" alt="">
      第二行 会被匹配到
  </p>

  <p class="first-line">
      第一行 会被匹配到
    <br>
      第二行 不会被匹配到
  </p>
```

## ::first-letter
`::first-letter` 会选中某块级元素第一行的第一个字母，并且文字所处的行之前没有其他内容（如图片和内联的表格）。

```HTML
<p class="item">
  paragraphh 第一个P会被匹配到
  <img class="img" src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=180811274,3179596559&fm=26&gp=0.jpg" alt="">
  paaasdwqdw 第一个p不会被匹配到
  </p>
```

## :focus
`:focus` 表示表单元素(`input`)被鼠标或键盘触发时的状态， 比如按下 tab 键或者点击聚焦 input框。这时聚焦的对象是input本身。
```HTML
<input type="text">

input:focus { border-color: #009FFF };
```
## :focus-visiable


## :focus-within
`:focus-within` 表示元素本身或者元素某个后代能够匹配 `:focus`，举例，input被聚焦后，其父元素 form 都被匹配到修改背景色

```HTML
<form>
  <label for="name">Name:</label>
  <input id="name" type="text">
  <br>
  <label for="addr">Addr:</label>
  <input id="addr" type="text">
</form>

form:focus-within { background: yellow };
```

## <i class="fa fa-exclamation"></i> :focus-visible
`:focus-visible` 与 `:focus` 都是使元素聚焦，同时聚焦轮廓由浏览器判断显示。
使用场景举例如，button按钮， 我们期望的用户体验是，用户在鼠标点击时不出现 outline， 在键盘Tab触发时出现 outline。
我们之前的做法是设置 `outline: none`, 这会带来一个问题，键盘Tab触发时也看不到outline了，新的伪类 :focus-visible 解决了这个问题。

在目前版本的Chrome浏览器下，浏览器认为键盘访问触发的元素聚焦才是`:focus-visible`所表示的聚焦。
```CSS
:focus:not(:focus-visible) {
    outline: 0;
}
```

## *
一个（`*`）就是一个通配选择器，他可以匹配人意类型的元素。在配合其他选择器的时候，带不带上`*`都是同样的效果。

尽量少用`*`，它的查找性能最低。

## :in-range
`:in-range` 适用于匹配 input 元素，它的value值在指定的范围区间内。示例如下，输入 5 < value < 10 , input框颜色变为绿色：
该伪类可选定任意的 `<input>`, 但只有在该元素指定了取值范围，并且元素值处于指定范围时才有效. 

该伪类用于给用户一个可视化的提示，表示输入域的当前值处于允许范围内。

<input type="number" value="6" min="5" max="10">

<style>
input {
  border: 1px solid #ddd;
}
input:in-range {
  border-color: green;
}
</style>

## :indeterminate
`:indeterminate` CSS 伪类 表示状态不确定的表单元素