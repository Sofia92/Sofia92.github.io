---
title: Angular Components
category: Angular手册
tags:
  - Angular手册
  - Components
---

# Angular Components

components 是 构建 Angular 应用最基本也是最主要的单元。每个组件代表了一个大型 Web 应用的组成部分。将一个应用使用组件方式组织管理，能够方便你在日后维护中更加清晰，更加简单，更加可维护。

## Defining 组件定义

一个组件包含几个组成部分

1. `@Component`： 标记这是一个 Angular 的 component 组件类
2. `selector`： CSS Selector 定义了你的组件类在 HTML 中如何使用，具体[查看 CSS Selector](https://developer.mozilla.org/docs/Learn/CSS/Building_blocks/Selectors)
3. `template`|`templateUrl`：template 编写 HTML 模版，使用 templateUrl 则引入独立的 HTML 文件，这个控制了组件在 DOM 的展现
4. `styles`|`stylesUrl`：styles 编写 CSS 样式，使用 styleUrl 则引入独立的 CSS 文件，这个控制了组件在 DOM 的展现，Ng19 可以使用单样式入 style，styleUrl
5. `standalone`：Ng19 之前版本默认 false，需要手动设置`standalone:true`来标记独立组件，Ng19 版本则默认是 true，需要手动 `standalone:false`来标记组件非独立。

## Template 动态展示

### signal 方式

```Typescript
@Component({
  selector: 'user-profile',
  template: `<h1>Profile for {{userName()}}</h1>`,
})
export class TodoListItem {
  userName = signal('pro_programmer_123');

  update() {
    this.userName.set('cool');
  }
}
```

### 动态属性

```Typescript
@Component({
  selector: 'user-profile',
  template: `
    <button [disabled]="inValidSave()">Save</button>
    <div [attr.role]="role()">role</div>
  `,
})
export class TodoListItem {
  inValidSave = signal(false);
  role = signal('admin');
}
```

### contrl flow 条件@if @else

`@if` 必须的，`@else` 可选

```HTML
<h1>User profile</h1>
@if (isAdmin()) {
  <h2>Admin settings</h2>
  <!-- ... -->
} @else {
  <h2>User settings</h2>
  <!-- ... -->
}
```

### contrl flow 循环 @for

`@if` 必须的，`@else` 可选

```HTML
<h1>User profile</h1>
<ul class="user-badge-list">
  @for (badge of badges(); track badge.id) {
    <li class="user-badge">{{badge.name}}</li>
  }
</ul>
```
