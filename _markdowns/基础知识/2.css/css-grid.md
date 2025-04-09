---
title: CSS Grid
date: 2022-12-01 10:28:15
category: CSS
tags:
  - CSS Grid
---

## CSSgrid

<!-- more -->

## 快速绘制不重叠的 border

```scss
.wrapper {
  display: inline-grid;
  grid-template-columns: 50px 50px 50px 50px;
  border: 1px solid black;
  grid-gap: 1px;
  background-color: black;
}

.wrapper > div {
  background-color: white;
  padding: 15px;
  text-align: center;
}
```

```html
<div class="wrapper">
  <div>1</div>
  <div>2</div>
  <div>3</div>
  <div>4</div>
  <div>5</div>
  <div>6</div>
  <div>7</div>
  <div>8</div>
</div>
```
