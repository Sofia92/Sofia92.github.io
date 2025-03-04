> 本文档是前端工作组执行代码质量抽检的审查清单, 也可用于前端代码检视的参考指南
> 文档会根据实践进行积累和优化，持续更新

# 用词

- 必须：  必须遵守的清单项；
- 推荐：  大多数情况应该遵守的清单项，特殊情况需要在代码检视过程解释清楚并获得同意通过;
- 为何：说明规范背后的原因

# 代码审查清单

该清单对代码正确性，代码设计，性能和安全，分别存放了一些常见的问题

## 1.代码正确性

### 1001.[必须]避免 this 的错误引用

为何？this 的引用比较容易弄错，检视过程中必须注意

```
//错误做法
class MyClass {
  ...
  handle() {
     setTimeout(function() {
        this.myMethod(); //this引用错误
     }, 1000);
  }
  ...
}


//正确做法
class MyClass {
  ...
  handle() {
     setTimeout(() => {
        this.myMethod(); //this指向MyClass实例
     }, 1000);
  }
  ...
}
```

### 1002.[必须]避免把数组的 map 方法当 forEach 用

```
//错误做法
const myArray = [....];
myArray.map((item) => {
  doSomething(item);
});

//正确做法 const myArray = [....]; myArray.forEach((item) => { doSomething(item); });
```

### 1003.[必须]避免错误的异步回调处理流程

```
//错误做法
getData() {
  const xhr = new XMLHttpRequest();
  let result;
  ...
  xhr.onreadystatechange = () => {
    ...
    if(isOk(xhr.state) {
      result = xhr.response;
    }
  }
  ...
  return result;//该result为undefined
}


//正确做法
//把异步回调promise化
const http =(api) => {
  return  new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    ...
    xhr.onreadystatechange = () => {
      ...
      if(isOk(xhr.state) {
        resolve(xhr.response);
      }
    }
    ...
  });
};
async getData() {
  ...
  let result = await http('/api');
  ...
  return result;
}
```

### 1004.[必须]避免使用尚未初始化对象的属性或方法

```
//错误做法
let obj = fetchObject();
obj.doSomething();//obj可能为null


//正确做法
let obj = fetchObject();
if(obj) {
  obj.doSomething();//或者其他的判断处理逻辑
}
```

### 1005.[推荐]避免事件处理器未及时阻止事件传递(该规则请根据场景考虑是否采纳)

//场景假设： 点击 button 只想触发 button 点击事件

```
//错误做法
let button = document.querySelect('#button');
button.addEventListener('click', function(e) {
  ...//click事件向上冒泡，导致上层元素触发click事件，非作者所期望
}, false);


//正确做法
let button = document.querySelect('#button');
button.addEventListener('click', function(e) {
  ...
  e.stopPropagation();//如果场景不想click事件向上冒泡，导致上层元素触发click事件
}, false);
```

### 1006.[必须]避免不再使用的事件处理器未进行清除

```
//错误做法
class MyComponent {
 ...
 ngOnInit() {
   ...
   setInterval(() => {
     doSomething();//比如发送log，定时提醒用户等等，销毁MyComponent没有清除该定时器，导致统计等不确定性错误
   }, time);
   ...
 }
 ...
}

//正确做法
class MyComponent {
 ...
 ngOnInit() {
   ...
   this.timer = setInterval(() => {
     doSomething();//比如发送log，定时提醒用户等等
   }, time);
   ...
 }
 ...
 ngOnDestroy() {
   clearInterval(this.timer);//销毁MyComponent清除该定时器
 }
 ...
}
```

### 1007.[必须]对象赋值导致其状态被意外修改

```
//错误做法
const attrs = obj.getAttrs();
doSomething(attrs);//如果attrs被修改了，可能导致obj的状态也被修改了，引发bug

//正确做法
const attrs = clonedeep(obj.getAttrs());//返回克隆版的attrs
doSomething(attrs);
```

### 1008.[必须]禁止不规范的使用三元表达式

为何？在多重 判断情况下，不规范的三元表达式加大了代码的理解

```
//错误做法
var k = a ? (b ? (c ? d : e) : (d ? e : f)) : f ? (g ? h : i) : j;
//正确做法
var k = a
    ? (b
        ? (c ? d : e)
        : (d ? e : f)
    )
    : f
        ? (g ? h : i)
        : j;


// ?和:放前面; 多重表达式加上()
```

## 代码设计

### 2001.[推荐]组件中只包含与视图相关的逻辑，其它逻辑(比如数据操作,数据交互)都放到服务

```
//不好的做法
class MyComponent {
  doSomething() {
     const data = this.http...;
     ....
     this.prop = process(data);
     .....
  }
}

//推荐的做法
class SomeService {
  ...
}


class MyComponent {
  doSomething() {
     this.prop = this.someService.getProp();
  }
}
```

### 2002.[推荐]视图逻辑放进组件类中而不要放在模板

```
//不好的做法
<div>
  ...
  <span>年龄：</span> <span>{birthdate.getFullYear() - (new Date()).getFullYear()}</span>
  ...
</div>

//推荐的做法
<div>
  ...
  <span>年龄：</span> <span>{age}</span>
  ...
</div>
class MyComponent {
  get age() {
    return birthdate.getFullYear() - (new Date()).getFullYear();
  }
}
```

### 2003.[推荐]为数据建立模型类，把数据操作封装在模型类中

```
//不好的做法
// user为JSON格式，user = {
//  "firstName": "myFirstName",
//  "lastName": "myLastName",
//  "birthDate": "2019-08-02 12:00:00"}
class MyComponent {
  ...
  setUser() {
    ...
    const user = this.service.getUserData();
    this.userFullName = `${user.firstName} ${user.lastName}`;
    const userBirthDate = new Date(user.birtDate);
    this.userAge = userBirthdate.getFullYear() - (new Date()).getFullYear();
    ...
  }
  ...
}

//推荐的做法
class User {
  public get fullName (): string {
    return `${this.firstName} ${this.lastName}`;
  }
  public get age(): number {
    return this.birthdate.getFullYear() - (new Date()).getFullYear();
  }
  private firstName: string;
  private lastName: string;
  private birthDate: Date;
}

class MyComponent {
  ...
  setUser() {
    ...
    this.user = this.service.getUser();
    ...
  }
  ...
}
```

### 2004.[必须]只在当前类内部使用的属性和方法，禁止其可访问性为 public(组件类的生命周期方法和模版里用到的成员不属于只在类内部使用的范畴，需要用 public 修饰)

### 2005.[必须]避免异步处理出现多层回调嵌套

```
//错误做法
this.service.getUser()
  .subscribe((user: User) => {
      ...
      this.service.getSomething(user).subscribe((something) => {
        ...
      });
  });

  //正确做法1
//使用rxjs的operator
this.service.getUser()
  .pipe(
	switchMap(user =>{
		return this.service.getSomething(user);
	})
  )
  .subscribe((something) => {
        ...
 });
 
 
//正确做法2
//使用promise
const user = await this.service.getUser().toPromise();
const something = await this.service.getSomething(user).toPromise();
...
```

### 2006.[必须]避免声明 any 类型

### 2007.[必须]避免使用魔术数字

```
//错误做法
const priceTax = 1.05 * price;
 
//错误做法
if(state === 1) {
....
} else if(state === 2) {
...
} else {
...
}

//正确做法
const tax = 0.05;
const priceTax = (1 + tax) * price;
 
//正确做法
enum State {
  Init = 1,
  Disabled = 2
}
if(state === State.Init) {
  ....
} else if( state === State.Disabled) {
...
}
...
```

## 3.性能

### 3001.[推荐]避免大量数据处理场景出现算法复杂度为 O(n^2),O(n^3)

```
// 不好的做法
const allResource = [...];
const myIds = [...];
const myResource = allResource.filter(resource => myIds.indexOf(resource.id) !== -1);//该算法复杂度为O(n^2)

//正确做法
//推荐的做法1
const allResource = [...];
const myIds = new Set([...]);//用Set代替Array
const myResource = allResource.filter(resource => myIds.has(resource.id));
 // myResource 该算法复杂度为O(n), n为allResource数量

//推荐做法2：如果allResource数量非常大，该做法更有优势
const allResource = new Map(...);//用Map代替Array： key 为resource.id， value为resource
const myIds = [...];
const myResource = myIds.map(id => allResource.get(id));//该算法复杂度为O(n)，n为myIds数量
```

### 3002.[推荐]注意 getter 导致的重复计算，特别是在组件模版里使用到该 getter 的场景下

```
 // 不好的做法
<div>
  ...
  <span>计算结果：</span> <span>{result}</span>
  ...
</div>
class MyComponent {
  public get result(): number {
    ...
    return this.calc();//比如循环计算
  }
}

 //推荐的做法
<div>
  ...
  <span>计算结果：</span> <span>{result}</span>
  ...
</div>
class MyComponent {
  public get result(): number {
    return this.cache;
  }

  private changeResult(): void {
    ...
    this.cache = this.calc();//比如循环计算
  }
}
```

### 3003.[必须]注意 mousemove，scroll 等事件频繁触发引起 angular 变更检测导致的性能问题

```
// 不好的做法
class MyComponent {
  ...
  ngOnInit() {
    this.el.addEventListenr('scroll', (e) => {
       if(check(e)) {
          doSomething();
       }
    }, false);
  }
  ...
}
//推荐的做法
class MyComponent {
  ...
  ngOnInit() {
    this.zone.runOutsideAngular(() => {
      this.el.addEventListenr('scroll', (e) => {
       if(check(e)) {
          doSomething();
       }
       if(shouldDetection()) {
          triggerChangeDetection();
       }
    }, false);
    });
  }
  ...
}
```

### 3004.[必须]避免组件使用 setTimeout 来实现 dom 同步，导致 angular 执行没有必要的变更检查

```
// 不好的做法
class MyComponent {
  ...
  updateDOMAfterDoSomething() {
    ...
    setTimeout(() => {
      ...
      updateDOM();
    }, time);
  }
  ...
}

//推荐的做法
class MyComponent {
  ...
  ngAfterViewChecked() {
    ...
    if(shouldUpdateDom()) {
      updateDOM();
    }
  }
  ...
}
```

### 3005.[必须]避免在组件的检查周期方法内使用异步操作导致无限循环检查

```
// 不好的做法
class MyComponent {
  ...
  ngAfterViewChecked() {
    doAsyncAction();//比如log，通知等
  }
  ...
}

//推荐的做法
class MyComponent {
  ...
  ngAfterViewChecked() {
    if(shouldAsync()) {
      doAsyncAction();//应注意频率
    }
  }
  ...
}
```

## 4.安全

### 4001.[必须]避免把数据作为 HTML 直接挂到 dom 上

```
// 不好的做法
cont data = await getData();
this.el.innerHTML = data;

//推荐的做法
//使用动态component或者对data进行escape
```
