

当前文档对应版本 0.0.0-beta-dev.194285

sy-lint 安装及使用方法参照规范检查工具 - sy-tslint 指南。

## 1.配置规则对照表

规则内容 含义及作用 错误示例 正确示例

### "no-input-rename": true

- 禁止将输入属性重命名
- @Input('inputName') name: string;
- @Input() name: string;

### "no-output-on-prefix": true

- 禁止在输出属性前面添加 on 前缀
- @Output() onNameChange: EventEmitter<string> = new EventEmitter<string>();
- @Output() nameChange: EventEmitter<string> = new EventEmitter<string>();

### "no-output-rename": true

- 禁止将输出属性重命名
- @Output(‘myNameChange’) nameChange: EventEmitter<string> = new EventEmitter<string>();
- @Output() nameChange: EventEmitter<string> = new EventEmitter<string>();

### "use-lifecycle-interface": true

- 必须正确的实现跟在 implements 关键字后面的钩子函数
- `class projectDashboard implements OnInit {}`
- `class projectDashboard implements OnInit { ngOnInit() { } }`

### "component-class-suffix": [true, "Component" ]

- 组件类必须以 Component 为后缀
- project-dashboard.component.ts => export class ProjectDashboard {}
- project-dashboard.component.ts => export class ProjectDashboardComponent {}

### "directive-class-suffix": [true,"Directive"]

- 指令类必须以 Directive 为后缀
- auth.directive.ts => export class Auth {}
- auth.directive.ts => export class AuthDirective {}

### "sy-enum-name": true

- enum 名必须是大驼峰形式
- enum ProjectType { }
- enum projectType { }

### "class-name": true

- 类名必须是大驼峰形式
- class projectDashboardComponent { }
- class ProjectDashboardComponent { }

### "variable-name": false

- 变量名必须是小驼峰形式
- public Name: string;
- public CalcStudyPanleHeight(): number {const Height = 100;return Height\*3;}

- public name: string;
  = public calcStudyPanleHeight(): number {const height = 100;return height\*3;}

### "sy-function-name": true

- 函数名必须是小驼峰形式
- function CalcStudyPanleHeight() { }
- function calcStudyPanleHeight() { }

### "sy-method-name": true

- 方法名必须是小驼峰形式
-

```
class ProjectDashboardComponent {
 CalcStudyPanleHeight(): number {
    const Height = 100;
    return Height\*3;
  }
}
```

-

```
class ProjectDashboardComponent {
  calcStudyPanleHeight(): number {
    const Height = 100;
    return Height\*3;
  }
}
```

### "sy-property-name": true

- 属性名必须是小驼峰形式
- class ProjectDashboardComponent { public Name: string; }
- class ProjectDashboardComponent { public name: string; }

### "sy-global-const-name": true

- 0104.[必须]全局常量命名使用 ALL_CAPS 形式；
- export const env = { } export const ENV = { }
- export const ENV_HMR = { }

### "interface-name": true 接口名必须以大写 I 开头

- interface Project { }
- interface IProject { }

### "one-variable-per-declaration": [true,"ignore-for-loop"]

- 禁止同一作用域多次申明同一变量，但允许 for 循环多次声明同一变量
- const id = res.id, name = res.displayname;
- const id = res.id; const name = res.displayname;

### "typedef": [true,"call-signature","parameter","property-declaration"]

- 必须提供必要的类型定义，包括：
- 方法返回值；非箭头函数的参数；接口属性；

### "sy-member-variable-typedef": true

### "member-access": [true,"check-accessor"]

- 需要对成员变量显示申明其可访问性，包括 get/set 变量的可见性申明。

### "indent": [true,"spaces",2]

- 缩进方式为两个空格。

### "curly": true

- 对于 if / for / do / while 强制要求加大括号

### "one-line": [ true, "check-open-brace", "check-catch", "check-else", "check-whitespace" ]

- 要求 catch / finally / else 和前置表达式位于同一行，开括号也要和前置表达式位于同一行。并且需要空格分隔。
-

```
  try {

doSomething();

} catch (e) {

handleError(e);

} finally {

gameOver();

}

//分隔线

if (a===a) {

console.log('a is a');

} else {

console.log('a not a');

}
```



### "semicolon": [true,"always"]

- 语句结束必须以分号结尾

### "max-line-length": [true,120]

- 单行最多允许 120 个字符

### "newline-per-chained-call": true

- 链式调用必须另起一行

###

```
"member-ordering": [
true,
{
"order": [
"public-static-field",
"protected-static-field",
"private-static-field",
"public-static-method",
"protected-static-method",
"private-static-method",
"public-instance-field",
"protected-instance-field",
"private-instance-field",
"public-constructor",
"protected-constructor",
"private-constructor",
"public-instance-method",
"protected-instance-method",
"private-instance-method"
]
}
]
```

- 成员变量必须按以下顺序排列：
  - 公共静态字段
  - 受保护的静态字段
  - 私有静态字段
  - 公共静态方法
  - 受保护的静态方法
  - 私有静态方法
  - 公共实例字段
  - 受保护的实例字段
  - 私有实例字段
  - 公共构造函数
  - 受保护的构造函数
  - 私有构造函数
  - 公共实例方法
  - 受保护的实例方法
  - 私有实例方法

### "quotemark": [true,"single"]

- 字符串应该使用单引号包裹

### "object-literal-sort-keys": false

- 不对对象 key 的排列顺序做限制

### "no-string-literal": false

- 允许对象使用中括号的方式访问属性
- object['key'] = 'a';

### "ordered-imports": false

- 不对文件引入做限制

### "max-classes-per-file": [true,2]

- 每个文件最多允许声明 2 个类

### "no-bitwise": false

- 不对位运算做限制

### "trailing-comma": false

- 不对逗号的添加做限制
