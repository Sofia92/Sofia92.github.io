---
 title: 创建 Git 仓库
 category: VersionControl
---

# ![Setting up a repository](https://wac-cdn.atlassian.com/dam/jcr:064b3f9e-39d1-44f2-9fd1-c4dac0f9d42e/hero.svg?cdnVersion=1230)

# I.目标

本篇教程将会教导你完成以下目标：

- 初始化一个 Git 仓库（repository）
- 克隆一个已经存在的 Git 仓库
- 配置 Git 仓库使其支持远程协作

# II. 什么是 Git 仓库

Git 仓库（Git Repository）是一种 Git 定义的针对项目的虚拟仓储。在 Git 仓库中，就可以完成项目的版本控制，并可以通过 Git 命令进行项目版本的管理。

# III . 初始化一个 Git 仓库 - git init

如果要创建一个新的仓库，我们需要运用命令 "git init"。git init 将会针对一个项目目录完成 Git 仓库的初始化。

该命令运行后，会在项目目录创建一个名为 ".git" 的子目录，同时创建一个名为 "master" 的分支。

## **课题 1.1  - 为本地已存在的项目初始化 Git 仓库**

在 bootcamp 资料包里找到课题项目 "example-1-1" ，通过 cd 命令进入：

通过 ls 命令我们可以看到，example-1-1 目录中存在一个 .Net Core 项目，这是我通过 Dotnet CLI 创建的 Web API 样板项目：

这个项目目前没有纳入 Git 管理，因此我们需要利用 git init 命令进行初始化，创建对应的 git 代码仓库：

根据 git init 命令返回的提示可知，我们的 Git 仓库已经初始化完成了，这时若是使用 "ls -a" （显示当前目录隐藏文件）命令，就可以看到我们的项目目录中与之前相比多了一个名为 ".git" 的子目录：

除了在项目目录中利用 "git init" 初始化 git 仓库之外，还可以利用 "git init <路径>" 指定项目目录进行初始化：

# IV. 克隆已存在的代码库 - git clone

如果代码库已经在一个 Git 服务端代码库中创建了（如公司的 [http://git.sy](http://git.sy) ），我们可以利用 git clone 命令将代码库从服务端拉取到本地。

git clone 的基本用法形如：`git clone <repo url>`

其中，"repo url" 即远端 git 仓库的地址，该地址支持多种协议，主要为 HTTP 协议与 SSH 协议，下面我们以 SSH 协议的 Git 仓库 Url 地址为例。

一般我们建议使用 SSH 协议远程获取和更新远端项目，因为 SSH 项目往往能带来更高的安全性

Git SSH Url 遵循以下格式： `git@HOSTNAME:USERNAME/REPONAME.git`

以公司 git.sy 项目（[http://git.sy/bootcamp/git/example-1-2](http://git.sy/bootcamp/git/example-1-2)）的 SSH Url 为例：[git@git.sy](mailto:git@git.sy):bootcamp/git/example-1-2.git ，对应上述 Url 格式的含义是：

- HOSTNAME: git 远端主机地址，git.sy
- USERNAME: 组名或用户名， bootcamp/git/
- REPONAME: 仓库名， example-1-2

当我们执行克隆命令时，git 会将远端代码仓库 master 分支上最新版本的文件复制到本地，并且创建一个名称对应 REPONAME （本例中 example-1-2）的目录，该目录会包含远端 git 仓库的所有历史变更内容并且创建一个新本地分支 master。

## **课题 1.2  - 克隆一个远端项目到本地**

我们在公司 gitlab （ [http://git.sy](http://git.sy) ）准备了一个项目 example-1-2 ，  我们可以通过 git clone 命令进行拉取：
