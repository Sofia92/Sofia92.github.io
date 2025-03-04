> Tips
>
> 根据 commit 规范，我们建立 git hooks 对 commit msg 检测 配置，效果如下，当我们配置不规范的 commit 时，会被提醒不允许 commit
>
> [commit 规范 👉 指路](./commit规范.md)

### 配置方式如下

**Step1.** 安装依赖


```Bash
# 安装 husky 如果已安装跳过此步骤
npm install --save-dev husky

# 安装 commitlint cli and conventional config
npm install --save-dev @commitlint/{config-conventional,cli}
```

执行成功后可以看到依赖树里新增了两个 node 包

**Step2.** 修改根目录下 package.json 新增 `git hooks "commit-msg"`

```json
// package.json
"husky": {
    "hooks": {
      "commit-msg": "commitlint -E HUSKY_GIT_PARAMS"
    }
  }
```

**Step3.** 根目录下新建文件 commitlint.config.js

```Javascript
// commitlint.config.js
const types = ["feat", "fix", "style", "refactor", "test", "chore", "docs", "build", "revert"];
module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'body-leading-blank': [1, 'always'],
        'footer-leading-blank': [1, 'always'],
        'header-max-length': [2, 'always', 72],
        'scope-case': [2, 'always', 'lower-case'],
        'subject-case': [
            2,
            'never',
            ['sentence-case', 'start-case', 'pascal-case', 'upper-case'],
        ],
        'subject-empty': [2, 'never'],
        'subject-full-stop': [2, 'never', '.'],
        'type-case': [2, 'always', 'lower-case'],
        'type-empty': [2, 'never'],
        'type-enum': [2, 'always', types]
    }
};
```
