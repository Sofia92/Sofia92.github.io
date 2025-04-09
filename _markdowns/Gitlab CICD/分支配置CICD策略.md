---
title: 分支配置CICD策略
category: DevOps
tags:
  - DevOps
  - GitLab CICD
---

# 分支配置CICD策略

<details>
<summary>事情是这样的</summary>
周同学 2021-12-29 下午 10:25 

几位，关于现在打包前端项目跑的非常慢，改完一次代码要跑2次CI，总共26分钟才能打包。导致现在每次发版都非常慢，最近经常是12点以后，最晚是4点多。找沈邗聊了一下，建议我们前端非主要分支，ci策略大量减轻，主要分支，一定量减轻ci任务 ，各位怎么看？  
  
DevOps大佬 2021-12-29 下午 10:26

1\. 对于非打包分支，可以只跑lint和去掉AOT的npm build;  
  
架构师 2021-12-29 下午 10:28  
编译两次26分钟 现在自己pc机器本地编译的话要多久呢@我  
  
DevOps大佬 2021-12-29 下午 10:28  
2\. 对于develop分支，也可以考虑关闭AOT、采用不合并静态资源的方式，并且可以分模块并行添加，以加速构建速度；  
  
DevOps大佬 2021-12-29 下午 10:28  
3\. 对于develop分支，建议上差分包；

我 2021-12-30 上午 10:05  
@所有人 现状：  
现在跑两遍CI是因为启用的分支保护策略及merge策略：个人分支merge回开发主分支需要 自己分支或fork的仓库分支Pipelines must succeed即第一次，合并回来后触发集成CI即第二次。

每次的pipeline 过程为：  
master分支 stages包括「build，package」总体10min  
test分支 stages包括「build，review」总体10min  
master、test以外分支stages包括「lint，build，review」总体10min-21min

现在部署用的不是打包专业的master分支，时间会> 10min  
pipeline中耗时久的是build stage，时间5min-10min，都是AOT编译。  
  
我 2021-12-30 上午 10:05  
我觉得现在可以优化的点是可以特定快速验证分支可以不触发CI，直接在快速验证分支跑一遍CI，有问题也是快速修复的方式。  
  
我 2021-12-30 上午 10:12  
第二点是：构建模式优化 快速验证的分支采用开发 build，正式部署交付的分支采用production build（AOT）  
  
架构师 2021-12-30 上午 10:13  
我觉得可以的 这样一次快速验证构建可以在10分钟内  
  
架构师 2021-12-30 上午 10:13  
去aot的话会更快  
  
架构师 2021-12-30 上午 10:28  
@PM @周同学 基本和老沈昨天的建议一致，那么我们先按照这个思路走下去试试？

我 2021-12-30 下午 1:52

![](/download/attachments/50464663/image2022-1-6%2013%3A51%3A5.png?version=1&modificationDate=1641448267038&api=v2)![](/download/attachments/50464663/image2022-1-6%2013%3A51%3A13.png?version=1&modificationDate=1641448274949&api=v2)  
DevOps大佬 2021-12-30 下午 1:53  
效果很好  
  
架构师 2021-12-30 下午 1:53  
👍  
  
PM 2021-12-30 下午 1:56  
\[强\]

  
周同学 2021-12-30 下午 1:57  
package 不会影响打包么  
  
我 2021-12-30 下午 1:57  
CI和Dockerfile 的修改改在了develop和hotfix分支，用其它分支部署先确保同步过这俩分支  
  
我 2021-12-30 下午 1:58  
\> package 不会影响打包么  
触发package的只有master分支，和原来的master构建一致的，没动，不影响
</details>

好，开始整改
## CI-pipelines配置
<table class="fixed-table wrapped confluenceTable" resolved=""><colgroup><col style="width: 138.0px;"><col style="width: 47.0px;"><col style="width: 56.0px;"><col style="width: 87.0px;"><col style="width: 95.0px;"><col style="width: 78.0px;"><col style="width: 125.0px;"><col style="width: 103.0px;"><col style="width: 168.0px;"></colgroup><tbody><tr><th colspan="1" class="confluenceTh">&nbsp;</th><th style="text-align: center;" class="confluenceTh"><span style="color: rgb(48,48,48);">Lint</span></th><th style="text-align: center;" class="confluenceTh"><span style="color: rgb(48,48,48);">Build</span></th><th style="text-align: center;" class="confluenceTh"><span style="color: rgb(48,48,48);">Review</span></th><th style="text-align: center;" class="confluenceTh"><span style="color: rgb(48,48,48);"><span style="color: rgb(48,48,48);">Production</span></span></th><th style="text-align: center;" class="confluenceTh"><span style="color: rgb(48,48,48);">Package</span></th><th style="text-align: center;" class="confluenceTh"><span style="color: rgb(48,48,48);"><span style="color: rgb(48,48,48);">Documentation</span></span></th><th style="text-align: center;" colspan="1" class="confluenceTh">build方式</th><th style="text-align: center;" colspan="1" class="confluenceTh">耗时</th></tr><tr><th colspan="1" class="confluenceTh"><span>feature/fix分支<br>个人分支</span></th><td style="text-align: center;" colspan="8" class="confluenceTd">-</td></tr><tr><th colspan="1" class="confluenceTh">develop</th><td style="text-align: center;" class="confluenceTd"><div><span style="color: rgb(112,112,112);">✅</span></div></td><td style="text-align: center;" class="confluenceTd"><p class="checked">✅</p></td><td style="text-align: center;" class="confluenceTd"><p>✅</p></td><td style="text-align: center;" class="confluenceTd">-</td><td style="text-align: center;" class="confluenceTd">-</td><td style="text-align: center;" class="confluenceTd"><span>✅</span></td><td style="text-align: center;" colspan="1" class="confluenceTd"><span>develop</span></td><td style="text-align: center;" colspan="1" class="confluenceTd"><span style="color: rgb(48,48,48);">00:</span>17:48</td></tr><tr><th colspan="1" class="confluenceTh">test</th><td style="text-align: center;" class="confluenceTd">-</td><td style="text-align: center;" class="confluenceTd"><span>✅</span></td><td style="text-align: center;" class="confluenceTd"><span>✅</span></td><td style="text-align: center;" class="confluenceTd">-</td><td style="text-align: center;" colspan="2" class="confluenceTd">-</td><td style="text-align: center;" colspan="1" class="confluenceTd"><span>develop</span></td><td style="text-align: center;" colspan="1" class="confluenceTd"><span style="color: rgb(48,48,48);">00:08</span><span>:28</span></td></tr><tr><th colspan="1" class="confluenceTh">master</th><td style="text-align: center;" class="confluenceTd">-</td><td style="text-align: center;" class="confluenceTd"><span>✅</span></td><td style="text-align: center;" class="confluenceTd">-</td><td style="text-align: center;" class="confluenceTd"><span>✅</span></td><td style="text-align: center;" class="confluenceTd"><span>✅</span></td><td style="text-align: center;" class="confluenceTd">-</td><td style="text-align: center;" colspan="1" class="confluenceTd">AOT</td><td style="text-align: center;" colspan="1" class="confluenceTd"><span style="color: rgb(48,48,48);">00:</span><span>14:12</span></td></tr><tr><th colspan="1" class="confluenceTh">hotfix</th><td style="text-align: center;" colspan="1" class="confluenceTd">-</td><td style="text-align: center;" colspan="1" class="confluenceTd"><span>✅</span></td><td style="text-align: center;" colspan="4" class="confluenceTd">-</td><td style="text-align: center;" colspan="1" class="confluenceTd">develop</td><td style="text-align: center;" colspan="1" class="confluenceTd"><span style="color: rgb(48,48,48);">00:06:59</span></td></tr></tbody></table>