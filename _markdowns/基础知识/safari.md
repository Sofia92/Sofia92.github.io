---
title: Safari 兼容
date: 2021-11-30 10:29:17
category: Infrastructure
---

记录EMR-APP兼容 Safari 过程

<!-- more -->

## 支持 touch 事件 

```typescript
// pre
<div class="bed-card" (singleClick)="handleCardClick($event)"
    (doubleClick)="handleCardDBClick($event)" 
    emrClickEvent>

// in Ipad
<div class="bed-card" (singleClick)="handleCardClick($event)"
    (doubleClick)="handleCardDBClick($event)" 
    (touchStart)="handleCardDBClick($event)" 
    emrClickEvent>
```

## 正则优化

Safari 不支持 `?<=` 正则匹配，需要做转换，具体可以在在线的正则网站上进行测试。

```typescript
// before
return url.replace(/(?<=(\/|=)):.*?(?=\/|$|\?|&)/g, (name) => values[name.substr(1)]);
// after
return url.replace(/(?:\/|):.*?(?=\/|$|\?|&)/g, (name) => values[name.substr(1)]);
```

```typescript
// before
let diagType: any = popupUrl.match(/(?<=diagType=)\d*(?=(&|$))/g);
// after
let diagType: any = popupUrl.match(new RegExp("(?<=diagType=)\d*(?=(&|$))", 'g'));
```

## 其它优化

一些校验浏览器属性的util

```typescript
public get OSType(): { xp: boolean; } {
    const ua = navigator.userAgent;
    return {
        xp: ua.indexOf("Windows NT 5") > 0
    };
}
public get isChrome(): boolean {
    return !!/Chrome/.test(navigator.userAgent) && !/Safari/.test(navigator.userAgent);
}
```