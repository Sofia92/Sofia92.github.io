---
title: vscode 配置 launch.json
date: 2023-08-16 10:37:59
category: vscode
tags:
  - vscode
---

# vscode 配置 launch 文件

<!-- more -->

```json
{
  // Use IntelliSense to learn about possible attributes.
  // Hover to view descriptions of existing attributes.
  // For more information, visit: https://go.microsoft.com/fwlink/?linkid=830387
  "version": "0.2.0",
  "configurations": [
    {
      "type": "pwa-chrome",
      "request": "launch",
      "name": "Launch Chrome",
      "url": "http://localhost:4200",
      "webRoot": "${workspaceFolder}",
      "skipFiles": ["<node_internals>/**", "${workspaceFolder}/node_modules/**"]
    },
    {
      "type": "pwa-msedge",
      "request": "launch",
      "name": "Launch Edge against localhost",
      "url": "http://localhost:4200",
      "webRoot": "${workspaceFolder}",
      "skipFiles": ["<node_internals>/**", "${workspaceFolder}/node_modules/**"]
    }
  ]
}
```
