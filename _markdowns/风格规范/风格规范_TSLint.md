---
title: TSLint 代码规范检查与 CI/CD 集成指南
category: CodeQuality
tags:
  - 前端代码检查工具
  - 前端工具集合CICD
  - 前端小工具
---

# TSLint 代码规范检查与 CI/CD 集成指南

## 环境要求

- **Node.js 版本**：≥12.x（LTS 版本，保证工具链兼容性）
- **包管理器**：npm ≥6.x 或 yarn ≥1.22

---

## 一、规范检查工具配置

### 1. 安装 @sy/tslint

```bash
# 使用公司私有镜像源安装定制版 TSLint
npm install @sy/tslint@0.0.1-dev.1366913 \
  --save \
  --registry https://npm-mirror.sy.com
```

### 2. 配置规则继承

1. 定位项目根目录下的 `tslint.json` 文件
2. **清空原有内容**，替换为以下配置：

```json
{
  "extends": "sy-tslint",
  "rules": {}
}
```

> **注**：此配置继承公司定制规则集，`rules` 字段可用于覆盖默认规则

### 3. 执行规范检查

| 场景             | 命令                | 功能说明             |
| ---------------- | ------------------- | -------------------- |
| 手动检查         | `npx sy-tslint`     | 输出所有规范违规项   |
| 自动修复可修正项 | `npx sy-tslint-fix` | 自动修复格式化类问题 |

---

## 二、CI/CD 集成方案

### 1. GitLab CI 配置示例

```yaml
stages:
  - lint # 新增代码规范检查阶段

sy-tslint:
  stage: lint
  image: node:12 # 使用官方 Node 12 镜像
  allow_failure: false # 检查失败阻断流水线
  cache:
    paths:
      - node_modules/
  script:
    - npm config set registry https://npm-mirror.sy.com # 配置私有源
    - npm config set unsafe-perm true # 解决 Docker 权限问题
    - npm install @sy/tslint # 安装检查工具
    - npx sy-tslint --format prose # 执行检查并输出可读报告
```

### 2. 关键配置说明

| 配置项           | 作用说明                                                       |
| ---------------- | -------------------------------------------------------------- |
| `allow_failure`  | 建议设置为 `false`，确保规范检查不通过时阻断部署流程           |
| `unsafe-perm`    | 解决 Docker 环境下的 npm 脚本执行权限问题                      |
| `cache`          | 缓存 node_modules 提升后续流水线执行效率                       |
| `--format prose` | 生成易于阅读的违规报告格式，支持与 GitLab 的测试可视化功能集成 |

---

## 三、调试与优化建议

### 1. 常见问题排查

- **规则冲突**：若出现与项目现有规则冲突，可在 `tslint.json` 的 `rules` 字段中添加例外
  ```json
  {
    "extends": "sy-tslint",
    "rules": {
      "no-console": false // 禁用 console 检查
    }
  }
  ```
- **镜像源超时**：确认网络可访问私有源的地址，必要时配置代理

### 2. 性能优化

- **增量检查**：在 `pre-commit` Git Hook 中集成检查，仅验证暂存区文件（参考 [husky](https://typicode.github.io/husky)）
- **并行执行**：将 lint 阶段与单元测试并行执行，缩短流水线耗时

---

> **最佳实践**：建议在 IDE 中安装 TSLint 插件，实现编码时实时规范提示
