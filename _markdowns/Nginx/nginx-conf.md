---
title: Nginx 常用配置指南
date: 2022-09-22 10:29:17
category: Nginx
tags:
  - Snippets
---

# Nginx 常用配置指南

---

## 核心配置模板

```nginx
user  nginx;                        # 运行用户
worker_processes  auto;             # 工作进程数（建议设为CPU核心数）

events {
    worker_connections  1024;       # 单个进程最大连接数
    use epoll;                      # 使用高效事件模型
}

http {
    include       mime.types;       # 加载MIME类型文件
    default_type  application/octet-stream;
    sendfile        on;             # 启用零拷贝传输
    keepalive_timeout  65;          # 长连接超时时间
    gzip  on;                       # 开启Gzip压缩
    gzip_types text/plain text/css application/json;
}
```

---

## 常用场景配置

### 1. 静态资源服务器

```nginx
server {
    listen 80;
    server_name static.example.com;

    location / {
        root /var/www/static;       # 静态文件根目录
        index index.html;
        autoindex on;               # 开启目录列表
        expires 7d;                 # 缓存有效期
    }

    # 禁止访问隐藏文件
    location ~ /\. {
        deny all;
    }
}
```

### 2. 反向代理配置

```nginx
server {
    listen 80;
    server_name api.example.com;

    location / {
        proxy_pass http://localhost:3000;  # 后端服务地址
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;

        # WebSocket支持
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

### 3. 负载均衡配置

```nginx
upstream backend {
    server 192.168.1.101:8000 weight=3;  # 权重分配
    server 192.168.1.102:8000;
    server 192.168.1.103:8000 backup;    # 备用服务器

    least_conn;  # 最少连接算法
    keepalive 32; # 连接池保持数
}

server {
    location / {
        proxy_pass http://backend;
        proxy_next_upstream error timeout invalid_header;
    }
}
```

### 4. HTTPS 安全配置

```nginx
server {
    listen 443 ssl http2;
    server_name secure.example.com;

    ssl_certificate /etc/ssl/certs/example.crt;
    ssl_certificate_key /etc/ssl/private/example.key;

    # 加密协议配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers on;

    # HSTS 安全头
    add_header Strict-Transport-Security "max-age=31536000" always;
}
```

### 5. 访问控制配置

```nginx
location /admin {
    # IP白名单
    allow 192.168.1.0/24;
    allow 10.0.0.1;
    deny all;

    # 基础认证
    auth_basic "Restricted Area";
    auth_basic_user_file /etc/nginx/.htpasswd;
}
```

---

## 实用配置技巧

### 日志配置优化

```nginx
http {
    log_format main '$remote_addr - $remote_user [$time_local] '
                    '"$request" $status $body_bytes_sent '
                    '"$http_referer" "$http_user_agent"';

    access_log /var/log/nginx/access.log main buffer=32k flush=5m;
    error_log /var/log/nginx/error.log warn;
}
```

### 性能优化参数

```nginx
# 文件缓存配置
open_file_cache max=1000 inactive=20s;
open_file_cache_valid 30s;
open_file_cache_min_uses 2;

# 客户端限制
client_max_body_size 10m;        # 最大上传文件大小
client_body_buffer_size 128k;    # 请求体缓冲区大小
```

### 重定向规则

```nginx
# HTTP强制跳转HTTPS
server {
    listen 80;
    server_name example.com;
    return 301 https://$host$request_uri;
}

# 旧地址重定向
location /old-page {
    return 302 /new-page;
}
```

---

## 调试与维护命令

| 功能         | 命令              |
| ------------ | ----------------- | ----------- |
| 检查配置语法 | `nginx -t`        |
| 热重载配置   | `nginx -s reload` |
| 查看运行状态 | `ps aux           | grep nginx` |
| 查看连接状态 | `netstat -tulpn   | grep nginx` |

---

> **注意事项**：
>
> 1. 修改配置前务必执行 `nginx -t` 验证语法
> 2. 敏感目录（如证书文件）应设置 700 权限
> 3. 生产环境建议禁用服务器版本号显示  
>    `server_tokens off;`
