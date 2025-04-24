
# RESTfulAPI

在 2000 年，Roy Fielding 提议使用[表述性状态转移](https://en.wikipedia.org/wiki/Representational_state_transfe) (REST Representational State Transfer) 作为设计 Web 服务的体系性方法。随着互联网产业的发展，REST API 设计已经成为现代 WEB 服务 API 的主流标准规范。

过去传统的 RPC 服务多以行为和方法(method)作为接口的表达形式，即对外暴露“方法”接口来供客户端直接调用。然而随着服务的演进与发展，这种思想设计的接口带来了越来越多的混乱及越来越大的管理难度，究其原因，是方法接口往往是碎片的、细粒度的，没有办法与业务的领域模型形成良好的绑定与映射。

基于 HTTP 协议的 REST API 设计，资源将一对一地映射到 URL 上，而对于资源的操作也将自然地映射到 HTTP 方法上（GET、POST 等），这种设计风格能够较大地减少学习成本，而开发者可以把更多的精力聚焦在资源和它们之间的业务逻辑关系上。

目前，公司的绝大多数业务项目都已经遵循 REST 进行 API 设计，RESTful 的 API 风格也成为公司多数研发同事认同的事实标准。下面罗列了有关 RESTful 风格的公司 API 设计建议（与准则），供大家参考。

## **MUST**  采用 RESTful 风格进行 API 设计

除非有非常特殊的情况，公司业务项目的 API **必需**遵循 Restful 风格进行设计，避免采用 SOAP 等其他 API 设计风格以及数据交换协议，简单来说， API 设计应当遵循：

- 采用  **JSON**  数据格式交互数据，并且通过 HTTP Header 进行规范（即  **Accept**  与  **Content-type** ，详见  ）
- 对 API 的资源进行命名，比如多数情况**应该使用名词**来定义 URI 以及路由（详见 #2 围绕"资源"进行 API 命名）
- API 应基于 HTTP 协议语义进行设计，并基于 HTTP Method （GET、POST、PUT、DELETE）实现对于资源的操作。

> 对于要求使用 JSON 进行数据交互，开发组可以根据项目的实际需求进行调整（比如需求方要求使用 XML 等），并不是所有接口都需要严格遵循

## 统一的 API 资源命名

在 REST 这种面向资源设计的 API， 资源就是一种命名实体，是对于业务逻辑中业务实体的一种映射。因此，如果可能，**API 应基于名词（资源）而不是动词（对资源执行的操作）进行命名。**

```bash
// Good
http://app.sy/users

// Bad
http://app.sy/create-user
```

资源命名**应该**遵循以下规则：

- 必须是合法的一般编程语言标识符（\[a-zA-Z\_\]\[a-zA-Z0-9\_\]\*）
- 资源应该使用清晰贴切的英文表达，对于资源是英文短语的，可以用短横线连接（例如“resource-name”）
- 应该尽量避免仅使用通用词，例如：
  - elements
  - entries
  - instances
  - items
  - objects
  - resources
  - types
  - values

在一般情况下，资源通常是种实体的集合，因此**应该**使用复数来表示：

```bash
http://app.sy/users
```

少数情况下，一些资源是全局的单例 （Singleton），以及一些单词没有复数形式（如 Whether），可以采用单数形式。

比较常见的场景是，一些业务需求用动词表达简洁直观，却很难用名词来表达，同时这类需求很难直接映射到 HTTP Method 方法上（增删改查）。这种情况我们会采用自定义方法来解决，参考#

对于资源中集合的某一单项，我们可以将集合和项的 URI 组成层次结构，例如 ID 为 42 的用户，可以如下表示：

```bash
http://app.sy/users/42
```

对于资源之间的关联，例如我们想表示用户 42 的有关设置：

```bash
http://app.sy/users/42/settings
```

有些场景我们不需要资源项的具体 ID（比如搜索），这时候我们可以作为短划线 "**\-**" 作为通配符，例如我们要搜索订单的所有项目：

```bash
http://app.sy/orders/-/items?filter=xxxxxx
```

不过需要注意的是，这种级联模型不应过度扩展，不然会导致 URI 复杂度过高而难以维护，因此**建议 URI 的级联关系不要超过两层**。如有必要可以考虑 HATEOAS 构建可导航链接，或者直接用短划线构建资源（一般情况不建议这么做）：

```bash
http://app.sy/user-settings/42
```

## **MUST**  根据 HTTP 方法（GET/POST/DELETE/PUT） 定义操作

开发者**应该使用 HTTP 标准方法并根据其语义来构建 API** ，常见的有

- **GET** -  **获取**请求资源的详细信息
- **POST** \- **创建**资源，而对于一些基于业务需求的自定义方法，我们也可以用 POST 来表示 （详见 ）
- **PUT** \- **完全更新**资源，与 PATCH 不同，PUT 的请求体包含了想要更新资源的所有字段信息，资源会被请求体完全替换
- **PATCH** - **部分更新**资源，与 PUT 不同，PATCH 的请求体仅包含了想要更新的字段数据
- **DELETE** - **删除**资源

对于类 CURD 的业务需求，**必需使用上述 HTTP 方法设计 API**。

除了上述常见方法，还有

- **HEAD** \- HEAD 请求资源 URI ，URI 将仅返回 HTTP Header 而不返回 Body，一般可以用 HEAD 先请求大型二进制资源来确定 Content-Length 与 Accept-Ranges ，之后通过 Ranges 逐步下载请求资源
- **OPTIONS** - OPTIONS 请求资源 URI， URI 将返回这个 URI 支持的 HTTP 方法、CORS 预检信息（Access-Control-Allow-Origin, Access-Control-Allow-Header 等）

对于常用的 HTTP 方法，有一些需要注意的细节：

### GET 方法

成功的 GET 方法应返回状态代码 200 （正常），**如果找不到资源，该方法应返回 404 （未找到）。**

> 找不到 URL 路由等错误信息混淆，但实际上从架构组运维的角度来讲，仍然希望业务系统能够返回与 HTTP 语义一致的信息，以方便追踪与监控

一般来说，**GET 请求不应该包含请求体(Request Body)**，虽然 HTTP 规范已经支持 GET 带请求体的语义，以及是 ElasticSearch API 的标准做法，但很多框架和开发工具其实缺乏对于这种用法的有效支持（比如 Angular）。

如果请求参数过长超出 URL 的最大长度，那么**可以考虑使用 POST 带请求体进行请求**，但在 URI 上作为自定义方法要有所体现。

### POST 方法

如果 POST 方法创建了新资源，**则应该返回 HTTP 状态码 201 （已创建）**。**建议新资源的 URI 包含在 Response Header 的 Location 中** **，响应正文包含新创建资源的具体信息**。

如果这个创建的语义没有可返回的结果，**该方法应该返回 204 （无内容）且不返回任何响应正文**。

POST 创建方法需要注意的一个情况是幂等性，即多个请求同时创建同个资源的情况，具体参考 #

对于很多不适于用常规 HTTP 方法表达的业务，我们称为自定义方法，我们可以将这些自定义方法映射到 POST 上，并用命名加以区分，详见 #

### PUT 方法

PUT 方法将更新整个资源，**如果成功应该返回 200** **（并在请求体中返回更新后的资源数据），如果不想返回更新后的资源则返回 201（已创建）并且返回空响应体。**

**在某些情况下，系统可能无法更新现有资源（例如资源被保护或被锁定），那么可以返回 419（冲突）**

PUT 方法可以考虑支持批量更新，即一个请求里更新多个资源，这种请求可以在集合 URI 上进行设计，例如：

```bash
PUT /users
[{
  "id": 1,
  "name": "Alice",
  "email": "alice@synyi.com"
 },
 {
  "id": 2,
  "name": "Bob",
  "email": "bob@synyi.com"
 }]
```

通过向集合 URI "/user" 发出 PUT 请求，即可完成批量更新。

PUT 方法同样需要考虑幂等性，具体参考 #

### PATCH 方法

PATCH 方法将局部更新请求的资源，PATCH 不会描述整个资源，只描述一组要应用的更改。

一般有两种主要的 PATCH 请求格式，分别是 “JSON Patch”（[RFC 7396](https://tools.ietf.org/html/rfc7396)） 与 "JSON Merge Patch"（[RFC 6902](https://tools.ietf.org/html/rfc6902)）

传统直观的方案是 JSON Merge Patch 方法，即文档结构与原始资源相同，但只包含要更改或修改的子集。

此外可以通过在请求中为字段值指定 null ，来删除该字段。

例如有资源如下：

```JSON
{
 "name": "gizmo",
 "category": "widgets",
 "color": "blue",
 "price": 10
}
```

下面是 JSON Merge Patch 格式的请求：

```JSON
{
 "price": 12,
 "color": null
}
```

这样告知服务器要更新 price，删除 color。有关 JSON 合并修补的请参阅  [RFC 7396](https://tools.ietf.org/html/rfc7396) ，JSON 合并修补的媒体类型是  application/merge-patch+json。

但这种做法存在一些问题，首先如果业务数据中 null 值有特殊保留的含义，那么这种 null 来删除指定字段值的方法可能就不适合，另外，这种方法无法指定应用更新字段的顺序，且对于深层次更新的字段 （如 "/a/b/c/d/e" ）更新起来比较麻烦。

因此另一种格式 JSON Patch ([RFC 6902](https://tools.ietf.org/html/rfc6902))适合更加多变的情况，举例如下：

```JSON
[
  {"op": "remove", "path": "/a/b/c" },
  {"op": "add", "path": "/a/b/c", "value": ["foo", "bar"]},
  {"op": "replace", "path": "/a/b/c", "value": 42}
]
```

开发同事**可以根据实际的需要选择 Patch 数据格式方案，对于不复杂的需求可以使用 "JSON Merge Patch"**

### DELETE 方法

如果请求成功，**服务器应返回状态码 204 （无内容）作为响应，且正文不包含任何其他信息。**若资源不存在，则返回状态码 404。

## 自定义方法满足非标准需求

在实际开发业务的过程中，遵循 REST 设计会发现采用 HTTP 标准方法并采用名词命名资源会存在不小的局限性，其实一些场景下，仅仅使用 HTTP 标准方法可能无法准确表达业务的性质，比如在云服务中，对于一台机器要进行重启，这种操作我们往往只能使用动词（即 "restart"）来描述。

对于这种并不少见的情况，业界通常有两种解决方案：

第一种是坚持面向资源设计的标准，将所有的动词都“名词化”，然后向 URI 发送 POST 请求，对应于之前的场景：

```bash
http://cloud.sy/machine/xxxx/restarter
```

使用“restarter”代表“重启”这个资源，然后通过 POST 请求来触发机器的重启

第二种是我们更为推荐的做法（源自 ElasticSearch），**对于自定义方法，我们将可以准确表达行为的动词加上下划线前缀，作为资源的子项，然后映射到 POST 方法上进行操作**：

```bash
http://cloud.sy/machine/xxxx/_restart
```

在 Google API 标准中规定，使用冒号 ":" 作为动词的前缀，但经过调研发现一些路由框架会占用冒号作为关键字，因此考虑使用下划线代替。

注意，我们一般使用 “POST" 方法来表明该自定义方法具有副作用，如果自定义方法不涉及副作用（比如搜索），那么考虑使用 GET 方法。

## 参考资料

- Zalendo API Guidelines -  [https://opensource.zalando.com/restful-api-guidelines/](https://opensource.zalando.com/restful-api-guidelines/)
- Paypal API Standards - [https://github.com/paypal/api-standards](https://github.com/paypal/api-standards)
- Google Cloud API Design Guide - [https://cloud.google.com/apis/design/](https://cloud.google.com/apis/design/)
- Microsoft Azure API Design - [https://docs.microsoft.com/zh-cn/azure/architecture/best-practices/api-design](https://docs.microsoft.com/zh-cn/azure/architecture/best-practices/api-design)
- Github API v3 - [https://developer.github.com/v3/](https://developer.github.com/v3/)
- OpenAPI Problem JSON Schema -  [https://opensource.zalando.com/problem/schema.yaml#/Problem](https://opensource.zalando.com/problem/schema.yaml#/Problem)
- Paypal API Error JSON - [https://github.com/paypal/api-standards/blob/master/v1/schema/json/draft-04/error.json](https://github.com/paypal/api-standards/blob/master/v1/schema/json/draft-04/error.json)
- Swagger Editor - [https://editor.swagger.io/](https://editor.swagger.io/)
- OpenAPI Spec Mindmap - [https://openapi-map.apihandyman.io/](https://openapi-map.apihandyman.io/)
- Swagger Intillij IDEA - [https://plugins.jetbrains.com/search?search=swagger+Monte](https://plugins.jetbrains.com/search?search=swagger+Monte)
