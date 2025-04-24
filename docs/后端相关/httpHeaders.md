
# HTTP Headers 与 HTTP Response

## 规范使用 HTTP 标准头

开发者**应该**遵循 HTTP 规范使用 HTTP 标准的 Header，常用的标准头罗列如下：

### 请求头

| Header                            | Type                                  | Description                                                                                                                                                                                                                         |
| :-------------------------------- | :------------------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Authorization                     | 字符串                                | 关于授权认证的请求头，一般会携带授权 Token                                                                                                                                                                                          |
| Date                              | 日期                                  | 请求的时间戳，来源是客户端时间，日期时间格式遵循  [RFC 5322](https://tools.ietf.org/html/rfc5322#section-3.3) 。服务器端**不应该**对于客户端准确性有任何的假设。                                                                    |
| Accept                            | 内容类型                              | 请求期望返回的内容类型，例如: <br> application/xml <br> text/xml <br> application/json <br> text/javascript (for JSONP)<br>服务器端**应该**根据请求头 Accept 返回对应格式的内容，如果无法返回请求要求的格式，可以考虑抛出错误码 406 |
| Accept-Encoding                   | Gzip, deflate                         | 期望返回的内容编码，服务器**应该**支持 GZIP 与 DEFLATE 编码                                                                                                                                                                         |
| Accept-Language                   | "en", "es", etc.                      | 期望返回的内容语言                                                                                                                                                                                                                  |
| Accept-Charset                    | 字符编码集类型，如 "UTF-8"            | 期望返回的字符编码，默认**应该**为 "UTF-8"                                                                                                                                                                                          |
| Content-Type                      | 内容类型                              | 请求体的编码类型 (PUT/POST/PATCH)，                                                                                                                                                                                                 |
| Prefer                            | return=minimal, return=representation | 请求对于响应的偏好，若设置了 return=minimal，对于创建与更新资源的请求，服务器**应该**返回空响应体。如果设置了 return=representation，服务应该在响应中返回创建与更新成功的资源。                                                     |
| If-Match, If-None-Match, If-Range | 字符串                                | 与 ETag 配合使用作为客户端缓存使用                                                                                                                                                                                                  |

### 响应头

| Response Header    | Required                                      | Description                                                                                                                                      |
| :----------------- | :-------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------- |
| Date               | 所有请求                                      | 响应的时间戳，来源是服务端时间，日期时间格式遵循  [RFC 5322](https://tools.ietf.org/html/rfc5322#section-3.3) 。服务应该在所有响应中带上此响应头 |
| Content-Type       | 所有请求                                      | 响应的内容类型                                                                                                                                   |
| Content-Encoding   | 所有请求                                      | 响应内容的编码类型，GZIP 或 DEFLATE                                                                                                              |
| Preference-Applied | 应用请求头 Prefer 的场景                      | 被应用的 Perfer 类型                                                                                                                             |
| ETag               | When the requested resource has an entity tag | 与 If-Match, If-None-Match 配合使用实现客户端缓存                                                                                                |

## 使用 HTTP Header 进行内容协商 (Content-Negotiation)

开发者**应该**借助 Accept 与 Content-Type 进行响应内容的协商，在绝大多数通过 JSON 传递的请求，Accept 可以为如下值：

```Bash
Accept: application/json,application/problem+json
```

其中， application/problem+json 为  [RFC 7807](https://tools.ietf.org/html/rfc7807)  所定义的错误响应的 Media Type ，**建议**在错误响应体的 Content-Type 使用 application/problem+json

此外，**建议**在 PATCH 接口考虑根据使用  application/merge-patch+json 以及  application/json-patch+json 作为 media type （根据实际使用的 PATCH 方法来决定）

## 除了 X-REQUEST-ID ，不使用自定义的 HTTP Header

开发者**不应该**自定义 HTTP Header，唯一例外的情况是 X-REQUEST-ID，即对于每个发起请求，开发者可以创建一个全局唯一的 X-REQUEST-ID ，用以日志及追踪。

架构组将提供一个统一方案实现服务器端 X-REQUEST-ID 的自动注入

## 成功响应的内容不应过度封装

对于成功返回的响应（200），我们**不建议**对返回内容进行封装，例如：

```JSON
{
 "status": "success",
 "data": { ... }
}
```

在一般情况下，前端开发人员**应该**通过 HTTP 状态码来判断服务响应的结果并通过 Header 来获取响应的元信息。
