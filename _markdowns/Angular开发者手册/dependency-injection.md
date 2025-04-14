---
title: Angular Dependency Injection
category: Angular手册
tags:
  - Angular手册
  - Dependency Injection
  - 依赖注入
---

# Angular 依赖注入

当你需要在组件与组件之间通信、共享时，Angular 提供了一个叫做“service”的机制，允许你能够在组件之外，编写单例服务，再注入到需要使用的地方，使用服务功能。

## Services？

services 是一种能够被注入的，可复用的代码片段。

一个 service 长成这样，`@Injectable` 标记这是一个 Angular service，`providedIn` 允许你定义在 Angular 应用中，哪些地方可以使用这个 Service, providedIn 通常默认是`root`，root 意思是在整个 Angular 应用中你都可以使用。

```Typescript
import {Injectable} from '@angular/core';
@Injectable({providedIn: 'root'})
export class Calculator {
  add(x: number, y: number) {
    return x + y;
  }
}
```

## 怎么使用 Service

使用 service 的步骤很简单，只有两个步骤

1. 引入 service
2. 注入

### Providing

对于早些时候版本的 Angular，需要自己编写 providers

| type                              | Provider                                               |
| :-------------------------------- | :----------------------------------------------------- |
| @Injectable()                     | @NgModule({ <br>...<br>providers: [Calculator] <br>})  |
| @Injectable()                     | @Component({ <br>...<br>providers: [Calculator] <br>}) |
| @Injectable({providedIn: 'root'}) | -                                                      |

### Injecting 注入

常规的注入方法是写在 constructor 类构造函数里，当 Angular 创建 Component、Directive 或者 Pipe 类的时候，Angular 会遍历构造函数参数类型，当遍历到参数是 Service 的类型，首先会去检查这个 service 是否有已经创建好实例，有的话就返回这个 service 实例，否则就会去创建 service 实例，创建好后继续刚开始的创建 Component、Directive 或者 Pipe 实例。

Angular 创建 service 实例是根据这个服务注册过的 providing，是某个@NgModule 还是某个@Component，还是 root。

```Typescript
@Component({ … })
class Receipt {
  constructor(private _calculator: Calculator) {}
}
```

## 对于新版本的 Angular，依赖注入过程变得简化

Injecting 注入方式改为使用 Angular 的 `inject()` 方法。

```Typescript
import { Component, inject } from '@angular/core';
import { Calculator } from './calculator';
@Component({
  selector: 'app-receipt',
  template: `<h1>The total is {{ totalCost }}</h1>`,
})
export class Receipt {
  private calculator = inject(Calculator);
  totalCost = this.calculator.add(50, 25);
}
```
