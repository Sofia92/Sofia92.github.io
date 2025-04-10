
# 常规 JS 小技巧

<!-- more -->

## 关于扁平化数组的吐槽 .flat

一个部门 JSON 数据中，属性名是部门 id，属性值是个部门成员 id 数组集合，现在要把有部门的成员 id 都提取到一个数组集合中。

```javascript
const deps = {
  采购部: [1, 2, 3],
  人事部: [5, 8, 12],
  行政部: [5, 14, 79],
  运输部: [3, 64, 105],
};
let member = [];
for (let item in deps) {
  const value = deps[item];
  if (Array.isArray(value)) {
    member = [...member, ...value];
  }
}
member = [...new Set(member)];
```

**吐槽**

获取对象的全部属性值还要遍历吗？Object.values 忘记了吗？还有涉及到数组的扁平化处理，为啥不用 ES6 提供的 flat 方法呢，还好这次的数组的深度最多只到 2 维，还要是遇到 4 维、5 维深度的数组，是不是得循环嵌套循环来扁平化？

**改进**

```javascript
const deps = {
  采购部: [1, 2, 3],
  人事部: [5, 8, 12],
  行政部: [5, 14, 79],
  运输部: [3, 64, 105],
};
let member = Object.values(deps).flat(Infinity);
```

其中使用 `Infinity` 作为 `flat` 的参数，使得无需知道被扁平化的数组的维度。补充: `flat` 方法不支持 IE 浏览器。

## 关于获取对象属性值的吐槽

ES6 中的可选链操作符会使用么？

```diff
- const name = obj && obj.name;
+ const name = obj?.name;
```

## 关于输入框非空的判断

在处理输入框相关业务时，往往会判断输入框未输入值的场景。

ES6 中新出的空值合并运算符了解过吗，要写那么多条件吗？

```diff
- if(value !== null && value !== undefined && value !== ''){}
+ if((value??'') !== ''){}
```
