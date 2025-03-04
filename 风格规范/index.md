# 用词

- 必须：  必须遵守的规范；
- 推荐：  大多数情况应该遵守的规范，除非你能完全理解背后的含义，并且有很好的理由违反它;
- 为何：说明规范背后的原因；

# 规范内容  

## 00-基础规范

### 0001.[必须]使用基于 tslint:recommended 和 codelyzer 推荐的 tslint 配置(对于非 angular 项目，codelyzer 配置不需要);

- 为何？ tslint 默认已经内置了一些代码最佳实践
- 为何？ angular 已有一份官方的代码规范

## 01-命名

### 0101.[推荐]实体命名使用有意义的英文单词，除前后缀和专有缩写名外，不能使用缩写;

为何？增强可读性，避免歧义

```
//bad
class Btn {
...
}

const btn: Btn;


//good
class Button {
...
}

const button: Button;
```

### 0102.[必须]类，接口，枚举值命名使用 PascalCase 形式

### 0103.[必须]函数，方法，属性，变量，部局常量命名使用 camelCase 形式;

### 0104.[必须]全局常量命名使用 ALL_CAPS 形式；

为何？风格统一，增强可读性

```
//good
class MyClass {
...
}

interface IMyInterface {
...
}

enum Direction {
Up,
Down,
Left,
Right
}

function myFunction() {
...
}

class MyClass {
public myAttr: Attr;

public myMethod() {
...
}
}

let myVar: number;
const myConst: string;
export const SYNYI_API: string = 'https://api.synyi.com';
```

### 0105.[必须]接口名使用前缀 I；

- 为何？避免与类名冲突
- 为何？突出实体的抽象含义

```
//bad
interface Study {
...
}
...
let study: Study = new StudyFactory<T>();

function save(study: Study){
...
}

#  

//good
interface IStudy {
...
}
...
class Study implements IStudy {//避免 Study 与 IStudy 冲突
...
}
let study: IStudy = Factory.new<SynyiStudy>();//突出 study 的多态含义
...
function save(study: IStudy){//突出 study 是一个抽象概念而不是具体类实例
...
}
```

### 0106.[推荐]私有、保护的属性和方法名，加前缀 _；

为何？避免与公有属性或方法名冲突

```
//good
class Study {
protected _print():string {
...
}
}

class SynyiStudy extends Study {
private _name: string;

public get name(): string {//避免属性名字冲突
return this._name;
}

public print():string {//避免方法名冲突
return 'synyi' + this._print();
}

}
```

### 0107.[推荐]传输数据对象名，加后缀 DTO；

- 为何？突出传输数据对象，为 API 接口数据约定类型，减少出错概率，增强可读性
- 为何？设计上区分底层数据和业务模型，降低对后端的数据依赖，特别是复杂业务，避免直接在业务层操作底层数据
- 为何？避免与业务模型名称冲突

```
//good
interface StudyDTO {//规范数据类型
id: number;
name: string;
}

class StudyService {
...
public fetch(id: number): Study {//避免与业务模型名字冲突
const data: StudyDTO = Api.get<StudyDTO>(`/studies/${id}`);
return this.studySerializer.deserialize(data);//避免上层依赖后端数据
}
...
public save(study: Study) {
const date: StudyDTO = this.studySerializer.serialize(study);
Api.put(`/studies/${data.id}`, data);
}
}
```

### 0108.[推荐]Promise 和 Observable 类型的变量和属性名，加$后缀;

- 为何？此类对象本身没有业务含义，避免占用业务实体名称
- 为何？突出异步对象含义，减少被误作业务实体使用导致错误

```
//bad
const study = Api.get...
const s = await study;//容易忘了 await，直接把 study 当实体用

const studyPromise = http.get...

#  

//good
const study$ = Api.get...//避免与 study 名字冲突
const study = await study$;
```

## 02-实体定义

### 0201.[必须]1 条声明语句只能声明 1 个变量；

- 为何？1 条语句声明多个变量容易出现歧义，比如其他编程语言的元组
- 为何？1 条语句声明多个变量容易和解构赋值混淆

```
//bad
const error, name = getName();

#  

//good
const error: Error;
const name: string = getName();
```

### 0202.[必须]函数和方法定义需显式标明参数类型和返回值类型(包括 void)，未初始化的属性定义需显式标明类型；

- 为何？风格统一，增强可读性
- 为何？有时候隐式类型不明显，可读性不强
- 为何？使用多态的场景需要显示指明类型

```
//bad
function get() {//需要看实现细节方可知道返回值类型
....
return study;
}

#  

//good
function get(): Study {
...
}

function effect(): void {//显式 void
...
}
```

### 0203.[必须]类成员需显式标明可访问性修饰符

- 为何？ts 默认 public，其他语言可能不是(比如 c#), 导致有其他编程语言背景的人容易混淆或者忘记
- 为何？避免无意将所有类成员默认 public，破坏封装

```
//bad
class Study {
name: string;

toString(): string {
...
}
}

#  

//good
class Study {
public name: string;

public toString(): string {
...
}
}
```

### 0204.[推荐]函数或方法名和其参数共同表明其意义；

为何？  统一风格，减少冗余，增强可读性

```
//bad
addUser(user: User): void;

#  

//good
add(user: User): void;
```

## 03-缩进

### 0301.[必须]使用 2 个空格进行缩进；

为何？风格统一，增强可读性

## 04-代码行

### 0401.[必须]每行代码 1 条语句，并用分号结束；

### 0402.[必须]每行限制 120 个字符长度；

### 0403.[必须]链式方法调用，第 2 个及以后续方法每个独占 1 行并相对第 1 行缩进；

为何？风格统一，增强可读性

```
//bad
user.name = 'synyi';user.age = 10;
user.setId(1).setPhone(110);

#  

//good
user.name = 'synyi';
user.age = 10;
user.setId(1)
.setPhone(110);
```

## 05-代码块结构

### 0501.[推荐] 代码块内部不要定义类，接口, 普通函数, 但可以定义箭头函数；

为何？  保持代码简洁，减少不必要复杂度

```
//bad
...{
class User {
...
}

function setName(name: string){
...
}

setName('synyi');
...
}

#  

//good
class User {
...
}
... {
const setName = (name: string) => {
...
}
setName('synyi');
}
```

### 0502.[推荐]  单个代码块应限制在 75 行内，类结构可以放宽到 350 行;

为何？代码更干净、更易读、更易维护、更易测试

## 06-类结构

### 0601.[必须] 类内部分别从上到下分为静态属性区，静态方法区，实例属性区，construtor 区，实例方法区;

### 0602.[必须]  同区按 public -> protected -> private 排序；

### 0603.[推荐] 属性或方法之间空 1 行；

为何？风格统一，增强可读性

```
//bad
class Study {
public constructor(name: string) {
...
}
static public count(): number {
...
}
private \_name: string;
public id: number;
public phone: string;
public get name(): string {
...
}
public setPhone(phone: string) {
...
}
private onPhoneChange() {
...
}

}

#  

//good
class Study {
static public maxId: number;//静态属性区

static public count(): number {//静态方法区
...
}
public id: number;//实例属性区

public phone: string;

private _name: string;

public constructor() {//construtor 区
...
}

public get name(): string {//getter/setter 方法
...
}

public onChange() {//回调方法
}

public setPhone(phone: string) {//普通方法
...
}
}
```

## 07-单文件代码结构

### 0701.[推荐] 文件内容从上到下分为模块区， 接口区，枚举区，函数区，变量区，类区，其他区，区与区之间用 2 空行分隔；

### 0702. [推荐]  模块区内语句之间不空行；

### 0703.[推荐]  接口区内接口之间空 1 行；

### 0704.[推荐] 枚举区内枚举之间空 1 行；

### 0704.[推荐]  函数区内函数之间空 1 行；

### 0705.[推荐]变量区内语句之间不空行;

### 0706.[推荐]  类区内类之间空 1 行；

为何？风格统一，增强可读性

```
//bad
const name ...
const ....
enum ...
enum ...
let ...
let ...
import ...
import ...
class ...
class ...
interface ...
interface ...
function ...
function ...
...

=========== 
//good
import ...
import ...

interface ...

interface ...

enum ...

enum ..

function ...

function ...

let ...
const ...

class ...

class ...

...
```

### 0707.[推荐]  单文件应只导出 1 个实体；

为何？可以让代码更加可复用、更容易阅读，减少不必要依赖，降低出错的可能性

### 0708.[推荐]单文件应限制在 400 行代码内;

为何？代码更干净、更易读、更易维护、更易测试

# Angular 官方规范

对 Angular 官方规范，如需了解规范的例子和背后的原理，请查看 angular 官方规范
