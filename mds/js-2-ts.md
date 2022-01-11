# 如何将一个 JavaScript 的 Node.js 项目改为 Typescript

原项目是一个用 JavaScript 写的 Koa 服务器项目，这里记录将其改为 TypeScript 的操作。

## 使用 ts-node 运行

原入口文件是 `index.js`, 现改为 `index.ts`。

对应需要使用 `ts-node` 来运行，先安装：

````shell
yarn add ts-node
````

修改 `package.json` 的 `scripts` 字段：

```diff
- "start": "node ./index.js"
+ "start": "ts-node ./index.ts"
```

开发时使用的是 `nodemon` 来监听改动，命令重写为：

```diff
- "server:dev": "nodemon ./server/index.js"
+ "server:dev": "nodemon --exec 'ts-node' ./server/index.ts"
```



## 新建 tsconfig.json 文件

如果没有安装 TypeScript，需要先在项目中安装。

```shell
yarn add typescript -D
```

可以使用 `tsc` 命令来初始化一个 `tsconfig.json` 文件：

1. 有全局的 `tsc` 命令：`tsc --init`
2. TypeScript 安装在本地：`node ./node_modules/.bin/tsc --init`



或者项目中已有基本的 `tsconfig.json` 文件，可以 `extends` 基础配置，然后只修改不同的部分

```json

{
  "extends": "../tsconfig.json",
  "compilerOptions": {
    "noImplicitAny": false,
    "module": "commonjs",
    "allowSyntheticDefaultImports": true,
    "esModuleInterop": true,
  }
}
```



## 修改引入和导出的方式

JavaScript 项目中使用 `require` 来引入模块：

```javascript
const fs = require('fs');
const path = require('path');
const utils = require('./utils');
```

需要改为使用 `import`:

```javascript
import fs from 'fs';
import path from 'path';
import * as utils from './utils';
```



设置 `"esModuleInterop": true`，以便能使用 `import fs from 'fs'` 这样的导入形式。





## 添加 eslint





---



> https://cloud.tencent.com/developer/article/1550040
>
> https://www.devextent.com/import-es-modules-in-nodejs-with-typescript-and-babel/
>
> https://stackoverflow.com/questions/62096269/cant-run-my-node-js-typescript-project-typeerror-err-unknown-file-extension



