基于前端架构规范生成的前端项目架构的工具，这里主要介绍安装、使用说明; 项目架构基于 Schematics+Angular8 搭建，目前支持项目，component，业务模块等的初始化; 本工具会按实际情况，持续更新。

## 前言

- 确定 node 版本 >=12
- 确定 angular 版本 8
- 全局安装 schematics 工具 npm install -g @angular-devkit/schematics-cli@12.0.0
- 全局安装项目脚手架 npm install -g sy-fe@latest --registry https://npm-mirror.sh.synyi.com/
- 脚手架根据  [项目架构规范](https://wiki.synyi.com/pages/viewpage.action?pageId=24935586)
- CHANGELOG [http://git.sy/fe/sy-fe-cli/blob/master/CHANGELOG.md](http://git.sy/fe/sy-fe-cli/blob/master/CHANGELOG.md)
- Demo 示例：[点击查看](http://auto-project-1815-dev.sy/guidance)

---

## 一、项目脚手架支持范围(按实际情况会拓展更新)

- 支持-项目初始化 project
- 支持-组件初始化 component
- 支持-业务模块 feature
- 支持-服务初始化 service
- 支持-pipe
- 支持-directive
- 支持-model

### 1.1. 项目初始化

```
schematics sy-fe:project
```

**name**: 项目的名称，为必填项 **demo**: [点击查看](http://auto-project-1815-dev.sy/guidance)

![](/download/attachments/182485832/init-project.png?version=1&modificationDate=1735868168779&api=v2)

### 1.2.创建 组件 Component

tips：切换工作区到指定位置，再执行 command

```
schematics sy-fe:component
```

**name**: 组件的名称，为必填项  
**module**: 是否为当前组件创建 NgModule  
**viewObject**: 是否为当前组件创建对应的 ViewObject  
**models**: 是否为当前组件创建 models 目录  
**services**: 是否为当前组件创建 services 目录  
**pipes**: 是否为当前组件创建 pipes 目录  
**directives**: 是否为当前组件创建 directives 目录  
![](/download/attachments/182485832/init-component.png?version=1&modificationDate=1735868169081&api=v2)

### 1.3.创建 业务模块 Feature

tips：切换工作区到指定位置，再执行 command

```
schematics sy-fe:feature
```

**name**: feature 的名称，为必填项  
![](/download/attachments/182485832/init-feature.png?version=1&modificationDate=1735868168994&api=v2)

### 1.4.创建 Service

tips：切换工作区到指定位置，再执行 command

```
 schematics sy-fe:service
```

**name**: service 的名称，为必填项  
![](/download/attachments/182485832/init-service.png?version=1&modificationDate=1735868168678&api=v2)

### 1.5.创建 Pipe

tips：切换工作区到指定位置，再执行 command

```
 schematics sy-fe:pipe
```

**name**: pipe 的名称，为必填项  
![](/download/attachments/182485832/init-pipe.png?version=1&modificationDate=1735868168943&api=v2)

### 1.6.创建 Directive

tips：切换工作区到指定位置，再执行 command

```
 schematics sy-fe:directive
```

**name**: directive 的名称，为必填项  
![](/download/attachments/182485832/init-directive.png?version=1&modificationDate=1735868169042&api=v2)

### 1.7.创建 Model

tips：切换工作区到指定位置，再执行 command

```
 schematics sy-fe:model
```

**name**: model 的名称，为必填项
