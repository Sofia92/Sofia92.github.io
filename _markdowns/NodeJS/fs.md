---
title: NodeJS fs模块
date: 2022-08-11 16:26:23
category: NodeJS
tags:
  - NodeJS
---

# NodeJS fs 模块

## 本地存储 json 文件

```javascript
const announcements = [];
announcements.push(announcement + "");

const dir = "./announcement";
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}
fs.writeFileSync(`./announcements.json`, `${JSON.stringify(announcements)}`);
```
