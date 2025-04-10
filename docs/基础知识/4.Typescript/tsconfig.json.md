
# typescript 配置文件，实用的配置项

<!-- more -->

## compilerOptions

### noImplicitReturns

默认值为 false， typescript 1.8 以上版本支持

example 如下，代码会检验错误，`lookupHeadphonesManufacturer` 返回类型 `string|undefined`

```typescript
function lookupHeadphonesManufacturer(color: "blue" | "black"): string {
  if (color === "blue") {
    return "beats";
  } else {
    ("bose");
  }
}
```

### noPropertyAccessFromIndexSignature

默认值为 false， typescript 4.2 以上版本支持

打开此配置则会校验 `dot` 如`(Object.key)` 语法和 `indexed` 如`(Object['key'])`语法，使用的属性必须与声明一致

```typescript
interface GameSettings {
  speed: "fast" | "medium" | "slow";
  quality: "high" | "low";
  [key: string]: string;
}

const settings = getSettings();
settings.speed;

(property) GameSettings.speed: "fast" | "medium" | "slow"
settings.quality;

(property) GameSettings.quality: "high" | "low"


settings.username; // 开启配置后会报错
// Property 'username' comes from an index signature, so it must be accessed with ['username'].
```

### noUnusedLocals

默认值为 false， typescript 2.0 以上版本支持

打开此配置则会校验未使用的局部变量

```typescript
const createKeyboard = (modelID: number) => {
  const defaultModelID = 23; // 'defaultModelID' is declared but its value is never read.
  return { type: "keyboard", modelID };
};
```

[阅读更多细节](https://github.com/Microsoft/TypeScript/wiki/Breaking-Changes#write-only-references-are-unused)

### noUnusedParameters

默认值为 false， typescript 2.0 以上版本支持

打开此配置则会校验未使用的函数参数

```typescript
const createDefaultKeyboard = (modelID: number) => {
  //'modelID' is declared but its value is never read.
  const defaultModelID = 23;
  return { type: "keyboard", modelID: defaultModelID };
};
```

## ReadMore

- https://www.typescriptlang.org/tsconfig#noFallthroughCasesInSwitch

