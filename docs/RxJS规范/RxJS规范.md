---
 title: RxJS规范
 category: CodeQuality
---

## [必须]组件销毁时取消订阅

为何？防止内存泄漏

掌握点： takeUntil unsubscribe

参考链接： https://ncjamieson.com/avoiding-takeuntil-leaks/

```Typescript
// bad
@Component()
export class DemoComponent implements AfterViewInit {
  @ViewChild('target') target: ElementRef;
  ngAfterViewInit(): void {
    fromEvent(this.target.nativeElement, 'scroll')
      .pipe(debounceTime(50))
      .subscribe(() => this.handleScroll());
  }
}

// good
@Component()
export class DemoComponent implements AfterViewInit, OnDestroy {
  @ViewChild('target') target: ElementRef;
  private destroy$ = new Subject();

  ngAfterViewInit(): void {
    // 请注意takeUntil是最后一个操作符。具体原因查看参考链接
    fromEvent(this.target.nativeElement, 'scroll')
      .pipe(debounceTime(50), takeUntil(this.destroy$))
      .subscribe(() => this.handleScroll());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
```

## [必须]使用正确类型的 Subject

为何？正确理解`Subject`，提高可读性

掌握点：Subject RelaySubject BehaviorSubject

### 一般情况：Subject

```Typescript
const num$ = new Subject();

num$.subscribe(num => {
    // do...
})

num$.next(5);
num$.next(8);
num$.next(2);
```

### 订阅晚于数据，但是需要历史数据，多个：ReplaySubject

```Typescript
const num$ = new ReplaySubject(2);

num$.next(5);
num$.next(8);
num$.next(2);

num$.subscribe(num => {
    // do...
})
```

### 订阅晚于数据，且只需要最新一条数据：BehaviorSubject

```Typescript
const num$ = new BehaviorSubject(0);

num$.next(5);
num$.next(8);
num$.next(2);

num$.subscribe(num => {
    // do...
})
```

## [必须] 避免`subscribe`的嵌套

为何？降低复杂度，提高可读性

掌握点：switchMap concatMap mergeMap

```Typescript
// bad
getPersonId()
    .subscribe(id => {
        getBaseInfo(id)
            .subscribe(info => {
                // do...
            })
    })
// good
getPersonId()
    .pipe(
        switchMap(id => getBaseInfo(id))
    )
    .subscribe(info => {
        // do...
    })
```

## [必须] 避免重复逻辑

为何？减少重复代码，降低维护成本

```Typescript
// bad
const persons$ = from([
    { gender: '0', age: 9 },
    { gender: '0', age: 27 },
    { gender: '1', age: 4 },
    { gender: '1', age: 50 },
]);
// component1
persons$
    .pipe(
        filter(({age}) => age >= 18),
        reduce((acc, {age}) => acc + age, 0)
    )
    .subscribe(n => console.log(`Total adult age: ${n}`));
// component2
persons$
    .pipe(
        filter(({age}) => age >= 18),
        filter(({gender}) => gender === '0')
    )
    .subscribe(femaleAdult =>  console.log({femaleAdult }));

// Good
const adultPerson$ = persons$.pipe(filter(({age}) => age >= 18);
// component1
adultPerson$
    .pipe(
        reduce((acc, {age}) => acc + age, 0)
    )
    .subscribe(n => console.log(`Total adult age: ${n}`));
// component2
adultPerson$
    .pipe(
        filter(({gender}) => gender === '0')
    )
    .subscribe(femaleAdult => console.log({femaleAdult}));
```

## [必须] 避免暴露`Subject`给外部

为何？破坏封装性，便于调试

```
// bad
class AuthService {
    public count = new BehaviorSubject<number>(0);
}

class PatientBar implements OnInit {
    constructor(private _auth: AuthService){}

    public ngOnInit() {
        this._auth.count$
            .subscribe(() => {
                // do...
            });
    }

    public setCount(count: number): void {
        this._auth.count$.next(count);
    }
}

// good 将Subject封装起来，避免外部组件非法调用complete方法，避免next非法值
class AuthService {
    private _count = new BehaviorSubject<number>(0);

    // 当需要当前值时
    public get count(): number {
        return this._count.getValue();
    }

    public get count$(): Observable {
        return this._count.asObservable();
    }

    public setCount(count: number): void {
        this._count.next(count);
    }
}

class PatientBar implements OnInit {
    constructor(private _auth: AuthService){}

    public ngOnInit(): void {
        this._auth.count$
            .subscribe(() => {
                // do...
            });
    }

    public setCount(count: number): void {
        this._auth.setCount(count);
    }
}

// 仅供参考，待商榷
 class AuthService {
    public count$: Pick<Subject<number>, 'next' | 'subscribe'> = new Subject<number>();
}
```

## [必须] 对于多个相同处理操作的数据流要合并进行处理

为何？保持代码简介清晰，可读性更好

掌握点： merge concat race 等合并操作符并明确各自适用的场景

参考链接 https://medium.com/angular-in-depth/rx-js-best-practices-6a3b095ffb04

```Typescript
// 错误：三个数据流调用同一个处理方法 分开订阅三次
fromEvent<MouseEvent>(searchButton, 'click').subscribe(doSomethingWithEvent);
fromEvent<KeyboardEvent>(inputElement, 'keyup').subscribe(doSomethingWithEvent);
fromEvent<KeyboardEvent>(inputElement, 'blur').subscribe(doSomethingWithEvent);


// 复杂接口请求情况 组合

// 推荐：将三个数据流合并成一个数据流进行订阅，三个数据流中任意一个事件都会触发订阅事件
merge(
  fromEvent<MouseEvent>(searchButton, 'click'),
  fromEvent<KeyboardEvent>(inputElement, 'keyup'),
  fromEvent<FocusEvent>(inputElement, 'blur'),
).subscribe(doSomethingWithEvent);
```

## [必须] 保持流订阅的效率和性能

为何？避免不必要的计算，提升效率和性能

掌握点：filter distinctUntilChanged debounceTime throttleTime 等过滤操作符并明确各自适用的场景

参考链接 https://blog.bitsrc.io/rxjs-patterns-efficiency-and-performance-10bbf272c3fc

```Typescript
// 错误：未对不需要校验的情况做过滤、防抖或节流，导致频繁请求接口
const patientName$ = fromEvent(nameInputElement, 'input');
patientName$.subscribe(patientName => {
    checkNameIsUniqueFromServer(); // some ajax operator
});

// 正确：根据实际情况过滤掉不需要的值，做好防抖和节流，减少请求次数
const patientName$ = fromEvent(nameInputElement, 'input');
patientName$
    .pipe(
        filter(Boolean), // 过滤未输入的情况
        distinctUntilChanged(), // 过滤值前后未改变的情况
        debounceTime(500), // 过滤掉用户输入后停留时间不超过1000ms的值（可根据实际情况选择防抖或者节流）
        switchMap(patientName => checkNameIsUniqueFromServer()) // 利用swicthMap,当用户重新输入新值取消前一个请求
    )
    .subscribe(result => {
        // some logic code
    });
```

## [推荐] 保持 subscribe 的简洁

为何？保持代码清晰干净，可读性更好

掌握点： map tap filter 等转换类操作符

```
// bad
getAge()
    .subscribe(age => {
        if (age < 18) {
            return;
        }
        const status = getStatus(age);
        if (status !== 'err') {
            //...
            //...
            //...
            //...
            //...
        }
    })

// good
getAge()
    .pipe(
        filter(age => age >= 18),
        map(age => getStatus(age)),
        filter(status => status !== 'err')
    )
    .subscribe(status => {
        nextStep(status);
    })

function nextStep(status) {
    //...
    //...
    //...
    //...
    //...
}
```

## [推荐] `Observable`建议与`async`管道和 OnPush 模式一同使用。不推荐在组件当中手动订阅`Observable`并将其中的值存储在组件成员当中

为何？1. 在 OnPush 策略下不需要手动刷新 2. 自动取消订阅

掌握点： async 管道

```
// bad
<div>{{ count }}</div>

@Component({
  //...
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoComponent implements OnInit, OnDestroy {
    //...
    public count: number;
    private _subscription: Subscription;

    constructor(private _cdr: ChangeDetectorRef) {}

    public ngOnInit(): void {
        this._subscription = interval(1000)
            .subscribe(num => {
                this.count = num;
                this._cdr.markForCheck();
            });
    }
    public ngOnDestroy(): void {
        this._subscription.unsubscribe();
    }
}


// good
<div>{{ count$ | async }}</div>

@Component({
  //...
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DemoComponent implements OnInit, OnDestroy {
    //...
    public count$: Observable<number>;
    public ngOnInit(): void {
        this.count$ = interval(1000);
    }

}
```

## [推荐] Subject/Observable 不建议与 Promise、async/await 混用

为何？降低代码复杂度，可读性好

```Typescript
// bad
public renewToken() : Subject<User> {
   if (!this.isRenewing) {
      this.isRenewing = true;
      this.renewToken$ = new Subject<User>();
      this.authService.renewToken()
        .then((user: User) => {
          this.isRenewing = false;
          this.renewToken$.next(user);
          this.renewToken$.complete();
        })
        .catch((err) => {
          this.isRenewing = false;
          this.renewToken$.error(err);
        });
    }
    return this.renewToken$;
 }
// 该代码的功能是得到一个`Observable`，并且保证同一时间只会执行一个`authService.renewToken()`操作。

// 那么这段代码用纯rxjs写可以简化成这样
// good
constructor(){
   this.renewToken$ = defer(()=>authService.renewToken()).pipe(share());
}
public renewToken(): Observable<User> {
    return this.renewToken$;
}

// 这段代码干了这些事

// 1. 使用 defer 将一个 promise 包装为冷模式 Observable
// 2. 把这个冷的 Observable 通过 share 变成热的
// 这样就可以保证同一时间只有一个 renewToken 在进行
```

RxJs 都是一种基于**约定**的异步逻辑，在混用的时候只是语法上会比较混乱。

但是`async/await`是将 Promise 的异步逻辑转换为同步逻辑，如果和 RxJs 混用的话容易导致代码的逻辑混乱，不利于维护。

## [推荐] 重复数据避免多次请求

为何？节省 http 资源，提高性能

掌握点： Code/Hot Observable

```
// bad
class DemoService {
  getData() {
     return this.http.get('');
  }
}

class DemoComponentA {
  constructor(private service: DemoService) {
     this.service.getData()
       .subscribe()
  }
}

class DemoComponentB {
  constructor(private service: DemoService) {
     this.service.getData()
       .subscribe()
  }
}

// good
class DemoService {
  data$;
  constructor() {
    this.data$ = this.getData();
  }
  getData() {
     return this.http.get('')
       .pipe(shareReplay(1));
  }
}


class DemoComponentA {
  constructor(private service: DemoService) {
     this.service.data$
       .subscribe()
  }
}


class DemoComponentB {
  constructor(private service: DemoService) {
     this.service.data$
       .subscribe()
  }
}
```

| 参考资料                                          |                                                                                                                                                                                |
| ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 30 天精通 Rxjs                                    | [https://ithelp.ithome.com.tw/users/20103367/ironman/1199](https://ithelp.ithome.com.tw/users/20103367/ironman/1199)                                                           |
| Rxjs 官网                                         | [https://rxjs-dev.firebaseapp.com/guide/overview](https://rxjs-dev.firebaseapp.com/guide/overview)                                                                             |
| RxJS Best Practices                               | [https://medium.com/better-programming/rxjs-best-practices-7f559d811514](https://medium.com/better-programming/rxjs-best-practices-7f559d811514)                               |
| RxJS In Angular Best Practices                    | [https://medium.com/angular-in-depth/rx-js-best-practices-6a3b095ffb04](https://medium.com/angular-in-depth/rx-js-best-practices-6a3b095ffb04)                                 |
| awesome-rxjs                                      | [https://github.com/RxJS-CN/awesome-rxjs](https://github.com/RxJS-CN/awesome-rxjs)                                                                                             |
| 6-ways-to-unsubscribe-from-observables-in-angular | [https://blog.bitsrc.io/6-ways-to-unsubscribe-from-observables-in-angular-ab912819a78f](https://blog.bitsrc.io/6-ways-to-unsubscribe-from-observables-in-angular-ab912819a78f) |
| 5 Common Mistakes with RxJS                       | [https://blog.bitsrc.io/5-common-mistakes-with-rxjs-1b09d4c19387](https://blog.bitsrc.io/5-common-mistakes-with-rxjs-1b09d4c19387)                                             |
| RxJS：所有订阅都需要调用 unsubscribe 取消订阅？   | [https://limeii.github.io/2019/08/rxjs-unsubscribe/](https://limeii.github.io/2019/08/rxjs-unsubscribe/)                                                                       |
| RxJS Patterns: Efficiency and Performance         | [https://blog.bitsrc.io/rxjs-patterns-efficiency-and-performance-10bbf272c3fc](https://blog.bitsrc.io/rxjs-patterns-efficiency-and-performance-10bbf272c3fc)                   |
