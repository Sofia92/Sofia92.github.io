---
title: Angular Signals
category: Angular手册
tags:
  - Angular手册
  - Signals
---

# Angular Signals

Signals 创建、管理动态数据。在 Angular 里，你可以使用`signals`来创建管理状态。

## Writable signas

```Typescript
import {signal} from '@angular/core';

@Component({
  selector: 'user-profile',
  template: `<h1>Profile for {{firstName()}}</h1>`,
})
export class TodoListItem {
  // Create a signal with the `signal` function.
  const firstName = signal('Morgan');
  // Read a signal value by calling it— signals are functions.
  console.log(firstName());
}
```

修改 set、update

- `firstName.set('Sofia')`， `set()`方法修改值；
- `firstName.update(name=> name.toUppercase())`， `update()`方法基于前一个值做更新。

## Computed signas

基于其他 signals 生产值，他是一个 readonly 的方法，没有`set` 和 `update`方法，他的值会跟随原 signal 的变更而自动变更。

```Typescript
import {signal, computed} from '@angular/core';

const firstName: WritableSignal<string> = signal('Morgan');
const firstNameCapitalized: Signal<string> = computed(() => firstName().toUpperCase());
console.log(firstNameCapitalized()); // MORGAN

firstName.set('Jaime');
console.log(firstNameCapitalized()); // JAIME
```

我们可以在 Component 中使用 `signal` 和 `computed`管理状态。

阅读更多[Signals](https://angular.dev/guide/signals)
