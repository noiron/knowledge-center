# 学习 Koa

>  参考资料：
>
> https://koajs.com/
>
> 

## 基础的 Koa 服务器

> A Koa application is an object containing an array of middleware functions which are composed and executed in a stack-like manner upon request.

```javascript
const Koa = require('koa');
const app = new Koa();

app.use(async ctx => {
  ctx.body = 'Hello World';
});

app.listen(3000);
```



## 如何处理 CORS

使用 `@koa/cors` 这个包

```javascript
const Koa = require('koa');
const cors = require('@koa/cors');

const app = new Koa();
app.use(cors());
```

> https://stackoverflow.com/a/53873385



## 如何处理 GET 请求

如何获取 get 参数

> https://stackoverflow.com/a/43257949



## 如何处理 POST 请求

> https://github.com/koajs/koa/issues/719



## 如何使用 Koa Router

