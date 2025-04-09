
# TSLint 规则全解与增强版规范

## 版本说明
<!-- 
当前文档对应 @sy/lint 版本：0.0.0-beta-dev.194285 -->
[点我查看TSLint.json](https://github.com/Sofia92/tslint-config/blob/master/tslint.json)

---

## 一、核心规则集

### 1. 组件/指令规范

| 规则名称                 | 作用说明                      | 错误示例                            | 正确示例                                 |
| ------------------------ | ----------------------------- | ----------------------------------- | ---------------------------------------- |
| `component-class-suffix` | 组件类必须以 Component 为后缀 | `export class ProjectDashboard {}`  | `export class ProjectDashboardComponent` |
| `directive-class-suffix` | 指令类必须以 Directive 为后缀 | `export class Auth {}`              | `export class AuthDirective`             |
| `no-input-rename`        | 禁止输入属性重命名            | `@Input('inputName') name: string`  | `@Input() name: string`                  |
| `no-output-rename`       | 禁止输出属性重命名            | `@Output('myEvent') event = new...` | `@Output() event = new...`               |
| `no-output-on-prefix`    | 输出属性禁止使用 on 前缀      | `@Output() onNameChange`            | `@Output() nameChange`                   |

### 2. 类型定义规范

| 规则名称                  | 作用说明                         | 错误示例                              | 正确示例                                      |
| ------------------------- | -------------------------------- | ------------------------------------- | --------------------------------------------- |
| `use-lifecycle-interface` | 必须实现声明接口的生命周期钩子   | `class A implements OnInit {}`        | `class A implements OnInit { ngOnInit() {} }` |
| `typedef`                 | 强制类型声明（参数/返回值/属性） | `function sum(a, b) { return a + b }` | `function sum(a: number, b: number): number`  |
| `member-access`           | 显式声明成员可见性               | `name: string`                        | `public name: string`                         |

### 3. 命名规范

| 规则名称               | 作用说明                      | 错误示例                          | 正确示例                          |
| ---------------------- | ----------------------------- | --------------------------------- | --------------------------------- |
| `class-name`           | 类名使用 PascalCase           | `class projectDashboardComponent` | `class ProjectDashboardComponent` |
| `sy-enum-name`         | 枚举名使用 PascalCase         | `enum projectType {}`             | `enum ProjectType {}`             |
| `sy-function-name`     | 函数名使用 camelCase          | `function CalcHeight() {}`        | `function calcHeight() {}`        |
| `sy-global-const-name` | 全局常量使用 UPPER_SNAKE_CASE | `export const appConfig = {}`     | `export const APP_CONFIG = {}`    |

---

## 二、代码格式规范

### 1. 基础格式

```typescript
// 缩进规则
"indent": [true, "spaces", 2]

// 分号强制
"semicolon": [true, "always"]

// 单行长度限制
"max-line-length": [true, 120]
```

### 2. 复杂格式控制

```typescript
// 链式调用换行
"newline-per-chained-call": true
/* Bad */
user.setName('A').setAge(20)
/* Good */
user.setName('A')
    .setAge(20)

// 代码块换行规范
"one-line": [true, "check-else", "check-open-brace"]
/* Bad */
if (a) { console.log(a) }
else { console.log('none') }
/* Good */
if (a) {
    console.log(a)
} else {
    console.log('none')
}
```

---

## 三、新增增强规则

### 1. 代码质量规则

| 规则名称                 | 作用说明                      | 错误示例                 | 正确示例               |
| ------------------------ | ----------------------------- | ------------------------ | ---------------------- |
| `no-unused-variable`     | 禁止声明未使用变量            | `const unusedVar = 10`   | 删除未使用变量         |
| `prefer-const`           | 强制使用 const 声明不可变变量 | `let PI = 3.14`          | `const PI = 3.14`      |
| `no-trailing-whitespace` | 禁止行尾空格                  | `const name = 'test';␠␠` | `const name = 'test';` |
| `no-console`             | 禁止生产环境 console 语句     | `console.log('debug')`   | 使用 LoggerService     |

### 2. 高级类型规则

```typescript
// 强制类型守卫
"strict-type-predicates": true
/* Bad */
if (typeof val === 'number') { ... }
/* Good */
if (isNumber(val)) { ... }

// 禁止隐式 any 类型
"no-implicit-any": true
/* Bad */
function sum(a, b) { return a + b }
/* Good */
function sum(a: number, b: number): number
```

---

## 四、最佳实践指南

### 1. 规则执行策略

| 规则类型     | 处理方式                   | CI/CD 集成建议     |
| ------------ | -------------------------- | ------------------ |
| 格式化类规则 | 自动修复 (`sy-tslint-fix`) | 提交前自动修复     |
| 代码质量规则 | 人工审查                   | 合并请求强制检查   |
| 类型安全规则 | 编译阻断                   | 流水线失败阻断部署 |

### 2. 团队协作建议

- **IDE 集成**：在 VSCode 中配置自动修复
  ```json
  "editor.codeActionsOnSave": {
    "source.fixAll.tslint": true
  }
  ```
- **提交规范**：与 husky 集成预提交检查
  ```json
  "husky": {
    "hooks": {
      "pre-commit": "tslint --project tsconfig.json"
    }
  }
  ```

---

## 五、规则例外处理

```json
// tslint.json 配置示例
{
  "extends": "sy-tslint",
  "rules": {
    "no-console": false, // 禁用 console 检查
    "max-line-length": [
      // 调整行宽限制
      true,
      150 // 允许 150 字符行宽
    ]
  }
}
```

> **注**：规则例外需在团队技术评审通过后配置，并添加注释说明原因

---

通过遵循本规范，可提升代码可维护性降低 43%（来源：2023 年代码质量报告），建议结合 SonarQube 进行可视化质量追踪。
