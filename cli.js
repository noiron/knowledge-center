#!/usr/bin/env node
// 写这个脚本的原因是 server 需要使用 ts-node 开启，但是现在还不知道如何在 .sh 脚本中处理绝对路径
const { fork } = require('child_process');
const path = require('path');

const serverPath = path.resolve(__dirname, './server/index.ts');
fork(serverPath);
