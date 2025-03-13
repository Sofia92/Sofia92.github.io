---
 title: 版本发布_checkList
 category: VersionControl
---

### 发布管理

对于发布的版本，它可以是新的迭代版本，也可以是线上反馈 hotfix 的补丁版本；

所有版本发布前，测试工程师必须确认测试已完全覆盖并通过

- 发布新版流程：从当前的 master 创建新的 release branch，将测试经过系统集成测试的稳定测试分支，合并到 master 分支；
- Hotfix 流程： Hotfix 指的是修复已经发布的程序中的缺陷。找到已经发布的基线，找到 Tag，新建 hotfix 分支 修复该缺陷的一个或多个 commit；

### 发布新版本详细步骤

1.  Coding 上删除 release 分支
2.  Coding 上从 master 分支新建 release 分支
3.  从 release 分支打包供集成测试后发布
4.  在 Coding 上基于 master 分支打 Tag，添加 Release Notes 日志。

### 发布补丁详细步骤

1.  先 update 整个工程
2.  git 从问题存在的 TAG 切换 hotfix 补丁分支
3.  进入 hotfix 补丁分支，修复问题补丁
4.  push 到远程，测试进行补丁测试验证
5.  验证不通过，继续修复问题
6.  验证通过后，将补丁分支 Merge 到 master 分支，同时 **cherry-pick** 到 develop 分支
7.  删除 hotfix  补丁分支
8.  在 Coding 上基于 master 分支打 Tag，添加 Release Notes 日志。
