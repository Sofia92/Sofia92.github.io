---
title: Angular Error Handler
date: 2021-12-23 15:21:50
category: Angular手册
tags:
  - indexDB
  - Angular ErrorHandler
---

# Angular 统一错误处理

<!-- more -->

> 本次优化只到日志存储，日志上报后续进行

## 采集内容

当异常出现的时候，我们需要知道异常的具体信息，根据异常的具体信息来决定采用什么样的解决方案。在采集异常信息时，可以遵循 4W 原则：

> WHO did WHAT and get WHICH exception in WHICH environment?

### 用户信息

出现异常时该用户的信息，例如：该用户在当前时刻的状态、权限等，以及需要区分用户可多终端登录时，异常对应的是哪一个终端。

### 行为信息

用户进行什么操作时，产生了异常？所在的界面路径，执行了什么操作？操作时使用了哪些数据？当时的 API 吐了什么数据给客户端？如果是提交操作，提交了什么数据？上一个路径，上一个行为日志记录 ID 等。

### 异常信息

产生异常的代码信息：用户操作的 DOM 元素节点；异常级别；异常类型；异常描述；代码 stack 信息等。

### 环境信息

网络环境；设备型号和标识码；操作系统版本；客户端版本；API 接口版本等。

## 采集变量具体内容

```typescript
interface ILog {
  // 通用字段
  errorType: string; // 错误类型如： "Error" | "RangeError" | "TypeError" | "HttpErrorResponse"
  errorMessage: string; // 错误message
  errorStack: string;
  screenX: number;
  screenY: number;
  syEditorVer: string;
  network: string; // `网络连接type为：${connection.type} ， 当前 downlink 为： ${connection.downlink}`,
  userAgent: string;
  userInfo: string;
  path: string; // location.href
  time: number;
  timeString: string; // 'yyyy/MM/dd HH:mm:ss'

  // window error 包含下述字段
  errorFileName: string; // 出错文件
  errorLineNo: number; // 出错文件行号
  errorColNo: number; // 出错文件列号
  errorTimeStamp: number;

  // HttpErrorResponse 错误包含下述字段
  httpStatus: number; // status code
  url: string; // request URL
  requestMethod: string; // 如： "GET" | "POST"
  requestHeaders: { key; value };
  requestBody: Object;
  responseType: string;
}
```

## 异常捕获

前端捕获异常分为：全局捕获和单点捕获。全局捕获代码集中，易于管理；本次日志先完成全局捕获

通过实现 Angular 的 ErrorHandle 捕获项目的错误

- HTTP 响应错误
- 客户端错误

主要设计三个文件：
src
|- app
|-- src/app/app.module.ts // 全局注测自定义 errorHandle 类
|-- error-handler.ts // log 应用层
|-- indexDB.ts // 数据库的 CRUD 逻辑

## 自定义 ErrorHandler 实现自 Angular 的 ErrorHandler

```typescript
// error-handler.ts
import { HttpErrorResponse } from "@angular/common/http";
import { ErrorHandler } from "@angular/core";
import { format as dateFormat, subDays } from "date-fns";
import { EMRIndexedDB, IStorNameType } from "./indexDB";

interface IHttpErrorResponse extends HttpErrorResponse {
  method: string;
  requestBody: any;
  responseType: string;
}

export class EmrErrorHandler extends ErrorHandler {
  private dbManage: EMRIndexedDB;
  private dataBase: IDBDatabase;

  constructor() {
    super();
    if (this.isChrome) {
      this.dbManage = new EMRIndexedDB("EMRAPP", 1);
      this.init();

      const errMethod = console.error;

      console.error = (message, ...args) => {
        const error = new Error(message);
        this.clientErrorHandle(error);
        errMethod(message, ...args);
      };

      Object.freeze(console);
    }
  }

  public get isChrome(): boolean {
    return !!/Chrome/.test(navigator.userAgent);
  }

  public async init(): Promise<void> {
    this.dataBase = await this.dbManage.openDatabase();
  }

  public handleError(error: Error | HttpErrorResponse): void {
    if (
      error.message.startsWith("ExpressionChangedAfterItHasBeenCheckedError")
    ) {
      return;
    }
    if (error instanceof HttpErrorResponse) {
      this.serverErrorHandle(error as IHttpErrorResponse);
    } else {
      this.clientErrorHandle(error);
    }
    console.error(error);
  }

  private serverErrorHandle(event: IHttpErrorResponse): void {
    const {
      method,
      headers,
      message,
      name,
      status,
      url,
      requestBody,
      responseType,
    } = event;
    this.storeError(IStorNameType.ServerError, {
      error: { message },
      errorType: name,
      httpRequest: { url, headers: headers["lazyUpdate"], requestBody },
      httpStatus: status,
      httpMethod: method,
      responseType,
    });
  }
  private clientErrorHandle(
    event: Error | ErrorEvent | PromiseRejectionEvent | any
  ): void {
    const { name, message, stack, fileName, lineNumber, columnNumber, error } =
      event;
    this.storeError(IStorNameType.ClientError, {
      error: {
        name,
        message,
        stack: stack?.split("\n"),
        fileName,
        lineNumber,
        columnNumber,
        error,
      },
      errorType: name,
    });
  }

  private storeError(storeName: string, storeValue: any): void {
    this.clearExpiredData();
    this.dbManage.openDatabase().then(() => {
      this.dbManage
        .add(storeName, { ...storeValue, ...this.addContextInfo() })
        .then((res) => res);
    });
  }

  private addContextInfo(): any {
    const now = new Date();
    const { screenX, screenY, navigator, location } = window;
    const { title, referrer } = document;
    const emrInpatientPatient = window.__EMRInpatientPatientVModel__;
    const connection =
      navigator["connection"] ||
      navigator["mozConnection"] ||
      navigator["webkitConnection"];
    const { userAgent, language } = navigator;
    return {
      time: +now,
      timeString: dateFormat(now, "yyyy-MM-dd HH:mm:ss"),

      // 部署
      emrRelease: {
        version: `${window.CI_COMMIT_SHA}-${window.CI_COMMIT_REF_SLUG}`,
        time: window.CI_COMMIT_TIMESTAMP,
      },
      emrThirdParty: {
        cdssSDK_version: window.cdssSDK_version,
        syEditor_version: window.__EMR_EDITOR_VER__,
      },

      document: { title, referrer, location: location.href },

      browser: {
        navigator: {
          userAgent,
          deviceMemory: navigator["deviceMemory"],
          language,
        },
        screen: { screenX, screenY },
        network: `网络连接type为：${connection.type} ， 当前 downlink 为： ${connection.downlink}`,
      },

      emr_business: {
        emrInpatientPatient: emrInpatientPatient && {
          inpatId: emrInpatientPatient?.currentPatient?.inpatId,
          patientName: emrInpatientPatient?.currentPatient?.patientName,
          patientId: emrInpatientPatient?.currentPatient?.patientId,
        },
      },
    };
  }

  // 清除存储 >7天 的数据
  private async clearExpiredData(): Promise<void> {
    const lastDay = 7;
    const startTime = subDays(new Date(), lastDay); // 获取时间为自动向前推算 7 天
    if (this.dataBase) {
      const expiredErrorKeys = await this.dbManage.getAll(
        IStorNameType.ClientError,
        IDBKeyRange.upperBound(+startTime, true)
      );
      (expiredErrorKeys || [])
        .filter(
          (result: { key: number; value: any }) => result.value.time < startTime
        )
        .forEach((result) => {
          this.dbManage.delete(IStorNameType.ClientError, result.key);
        });
      const expiredHttpErrorKeys = await this.dbManage.getAll(
        IStorNameType.ServerError,
        IDBKeyRange.upperBound(+startTime, true)
      );
      (expiredHttpErrorKeys || [])
        .filter(
          (result: { key: number; value: any }) => result.value.time < startTime
        )
        .forEach((result) => {
          this.dbManage.delete(IStorNameType.ServerError, result.key);
        });
    }
  }
}
```

## 将自定义 ErrorHandler 注册到根 Module 里

```typescript
// app.module.ts
...
@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule
    ],
    providers: [
        { provide: ErrorHandler, useClass: EmrErrorHandler }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

```

## 编写 IndexedDB 读写逻辑

```typescript
export enum IErrorType {
  HttpErrorResponse = "HttpErrorResponse",
}
export enum IStorNameType {
  ServerError = "Server",
  ClientError = "Client",
  Custom = "Custom",
}

export class EMRIndexedDB {
  private indexedDB: IDBFactory;
  private dbName: string;
  private dbVersion: number;
  private db: IDBDatabase;

  constructor(dbName: string, version: number) {
    this.dbName = dbName;
    this.dbVersion = version;
    this.db = null;
    this.indexedDB =
      window.indexedDB ||
      (window as any).mozIndexedDB ||
      (window as any).webkitIndexedDB ||
      (window as any).msIndexedDB;
  }

  public openDatabase(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const request = this.indexedDB.open(this.dbName, this.dbVersion);
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onerror = (e) => {
        reject(
          "IndexedDB 打开出错了: " + (e.target as any).errorCode
            ? (e.target as any).errorCode + " (" + (e.target as any).error + ")"
            : (e.target as any).errorCode
        );
      };

      request.onupgradeneeded = (event) => {
        this.db = event.target["result"];
        if (this.db.objectStoreNames.contains("Error")) {
          this.db.deleteObjectStore("Error");
        }
        if (this.db.objectStoreNames.contains("HttpError")) {
          this.db.deleteObjectStore("HttpError");
        }
        if (!this.db.objectStoreNames.contains(IStorNameType.ClientError)) {
          const objectStore = this.db.createObjectStore(
            IStorNameType.ClientError,
            { keyPath: "id", autoIncrement: true }
          );
          objectStore.createIndex("timeString", "timeString");
        }
        if (!this.db.objectStoreNames.contains(IStorNameType.ServerError)) {
          const objectStore = this.db.createObjectStore(
            IStorNameType.ServerError,
            { keyPath: "id", autoIncrement: true }
          );
          objectStore.createIndex("timeString", "timeString");
          objectStore.createIndex("httpStatus", "httpStatus");
        }
        if (!this.db.objectStoreNames.contains(IStorNameType.Custom)) {
          const objectStore = this.db.createObjectStore(IStorNameType.Custom, {
            keyPath: "id",
            autoIncrement: true,
          });
          objectStore.createIndex("timeString", "timeString");
        }
      };
    });
  }

  public getAll(storeName: string, keyRange?: IDBKeyRange): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.validateBeforeTransaction(storeName, reject);

      const transaction = this.createTransaction({
        storeName,
        dbMode: "readonly",
        error: (e: Event) => {
          reject(e);
        },
        complete: () => {},
      });
      const objectStore = transaction.objectStore(storeName);
      const result: any[] = [];
      let request: IDBRequest;
      request = objectStore.openCursor(keyRange);

      request.onerror = (e) => {
        reject(e);
      };

      request.onsuccess = (evt: Event) => {
        const cursor: any = (evt.target as IDBOpenDBRequest).result;
        if (cursor) {
          result.push({ key: cursor.key, value: cursor.value });
          cursor["continue"]();
        } else {
          resolve(result);
        }
      };
    });
  }

  public add(storeName: string, value: any, key?: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.validateBeforeTransaction(storeName, reject);

      const transaction = this.createTransaction({
        storeName,
        dbMode: "readwrite",
        error: (e: Event) => {
          reject(e);
        },
        complete: () => {
          resolve({ key, value });
        },
      });
      const objectStore = transaction.objectStore(storeName);

      const request = objectStore.add(value, key);
      request.onsuccess = (evt: any) => {
        key = evt.target.result;
      };
    });
  }

  public delete(storeName: string, key: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.validateBeforeTransaction(storeName, reject);

      const transaction = this.createTransaction({
        storeName,
        dbMode: "readwrite",
        error: (e: Event) => {
          reject(e);
        },
        complete: () => {
          resolve();
        },
        abort: (e: Event) => {
          reject(e);
        },
      });
      const objectStore = transaction.objectStore(storeName);

      objectStore["delete"](key);
    });
  }

  public clear(storeName: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.validateBeforeTransaction(storeName, reject);

      const transaction = this.createTransaction({
        storeName,
        dbMode: "readwrite",
        error: (e: Event) => {
          reject(e);
        },
        complete: () => {
          resolve();
        },
        abort: (e: Event) => {
          reject(e);
        },
      });
      const objectStore = transaction.objectStore(storeName);
      objectStore.clear();
      resolve();
    });
  }

  private validateStoreName(storeName: string): boolean {
    return this.db.objectStoreNames.contains(storeName);
  }

  private validateBeforeTransaction(storeName: string, reject: any): any {
    if (!this.db) {
      reject(
        "You need to use the openDatabase function to create a database before you query it!"
      );
    }
    if (!this.validateStoreName(storeName)) {
      reject("objectStore does not exists: " + storeName);
    }
  }

  private createTransaction(options: {
    storeName: string;
    dbMode: IDBTransactionMode;
    error: (e: Event) => any;
    complete: (e: Event) => any;
    abort?: (e: Event) => any;
  }): IDBTransaction {
    const trans: IDBTransaction = this.db.transaction(
      options.storeName,
      options.dbMode
    );
    trans.onerror = options.error;
    trans.oncomplete = options.complete;
    trans.onabort = options.abort;
    return trans;
  }
}
```

## 日志查看

打开控制台，进入 Application 标签，找到左侧的 indexedDB ，打开 EMRAPP 数据库，可供查看的日志包括：

Client - 客户端报错：Angular 错误，内部 exception，console error 等）
Custom
Server - HTTP 响应错误 如 4xx, 5xx

## 日志导出

然而出于 Chrome DevTool 开发者工具 IndexedDB 管理界面的功能限制，对于这些日志的查询分析仍然存在不便利。因此，我写了个简单的日志导出脚本，生成可下载的 txt 日志文件，导出后可以发回到家里进行分析。

脚本源码如下：

```Javascript
(() => {
  function num2(n) {
    return n.toString().padStart(2, "0");
  }
  function formatDate(date) {
    return `${date.getFullYear()}-${num2(date.getMonth() + 1)}-${num2(date.getDate())} ${num2(date.getHours())}:${num2(date.getMinutes())}:${num2(date.getSeconds())}`;
  }
  function parseDate(str) {
    const reg = /(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})/g;
    const matched = reg.exec(str);
    if (!matched) {
      const message = "日期格式不正确，应为YYYY-MM-DD HH:mm:ss";
      alert(message);
      throw new Error(message);
    }
    const [_, year, month, day, hour, min, sec] = matched;
    const date = new Date();
    date.setFullYear(+year);
    date.setMonth(+month - 1);
    date.setDate(+day);
    date.setHours(+hour);
    date.setMinutes(+min);
    date.setSeconds(+sec);
    return date;
  }
  async function loadDb(db, start, name) {
    const objectStore = db.transaction([name]).objectStore(name);
    console.log(`loading with start=${start}, ${formatDate(start)}`);
    const range = IDBKeyRange.lowerBound(+start);
    const cursor = objectStore.openCursor(range);
    return await new Promise((resolve, reject) => {
      const results = [];
      cursor.onsuccess = function(e) {
        const result = e.target.result;
        if (result) {
          const resultObj = { key: result.key, value: result.value };
          if (result.key >= start) {
            console.log("track", resultObj);
            results.push(resultObj);
          } else {
            console.log("skipped", resultObj);
          }
          result.continue();
        } else {
          console.log(`load db ${name} done`);
          resolve(results);
        }
      };
      cursor.onerror = reject;
    });
  }
  async function collect(startFrom, dbName, objStoreNames) {
    const request = window.indexedDB.open(dbName);
    const collection = await new Promise((resolve, reject) => {
      request.onsuccess = function() {
        Promise.all(objStoreNames.map(async (name) => {
          const loaded = await loadDb(this.result, startFrom, name);
          return { name, result: loaded };
        })).then(resolve).catch(reject);
      };
      request.onerror = reject;
    });
    return collection;
  }
  function formatLog(name, results, verbose = false) {
    return results.map(({ value }) => `${value?.timeString}|${name}|${JSON.stringify(verbose ? value : { errorType: value?.errorType, location: value?.document?.location, message: value?.error?.message })}`).join("\n");
  }
  function exportFile(text, filename) {
    const blob = new Blob([text], { type: "text/plain" });
    const link = document.createElement("a");
    link.download = filename;
    link.href = window.URL.createObjectURL(blob);
    link.click();
  }
  !async function() {
    const objStoreNames = ["Client", "Server"];
    const now = new Date();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    const startOfToday = now;
    const dateString = prompt("输入日志起始时间，默认为今天零时起", formatDate(startOfToday)) ?? formatDate(startOfToday);
    const parsed = parseDate(dateString);
    const collection = await collect(parsed, "syEMRAPP", objStoreNames);
    const text = collection.map(({ result, name }) => formatLog(name, result, true)).join("\n");
    exportFile(text, `emr_log_${+new Date()}.txt`);
  }();
})();
```
