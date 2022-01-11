const fs = require('fs');
const path = require('path');
const utils = require('./utils');
const { exec } = require('child_process');

const filePath = path.resolve(__dirname, '../mds');

/**
 * 获取一个 markdown 文件的内容
 */
async function getMarkdownFile(ctx) {
  const fileName = ctx.params[0];
  const myMarkdown = fs.readFileSync(
    path.resolve(filePath, `${fileName}`),
    'utf8'
  );
  ctx.body = myMarkdown;
}

/**
 * 读取目录下的文件，使用基本的链接形式展示为列表
 */
async function renderList(ctx) {
  const fileList = fs.readdirSync(filePath);
  const links = fileList
    .map((file) => {
      return `<a href='./file/${file}'>${file}</a>`;
    })
    .join('<br />');

  ctx.body = `<html><head><title>Hello Everyone</title></head><body>
      <h1>Hello Everyone</h1>
      ${links}
      </body>
    </html>`;
  ctx.type = 'html';
}

/**
 * 运行一个 shell 命令
 */
async function runCommand(ctx) {
  const query = ctx.request.query;
  const { file } = query;
  exec('open -a typora ' + path.resolve(filePath, file));
  ctx.body = {
    code: 0,
    message: 'success',
  };
}

/**
 * 获取目录下所有的 markdown 文件，以树形结构返回
 */
async function getMarkdownList(ctx) {
  // TODO: mds 这个文件名从 filePath 中获取
  const root = {
    path: './mds',
    type: 'folder',
    children: [],
    isRoot: true,
  };

  const myList = {
    './mds': root,
  };
  // TODO: 函数参数改为对象格式
  const list = utils.myWalk(filePath, './', myList, root);
  ctx.body = list;
}

async function getUserConfig(ctx) {
  const config = require('./user-config.js');
  ctx.body = config;
}

async function saveUserConfig(ctx) {
  const configPath = path.resolve(__dirname, './user-config.js');
  const config = ctx.request.body;
  const originalConfig = require(configPath);
  const newConfig = Object.assign(originalConfig, config);
  const str = `module.exports = ${JSON.stringify(newConfig)}`;
  fs.writeFileSync(configPath, str, 'utf8');
  ctx.body = {
    success: true,
  };
}

// TODO: 处理多级目录
/** 读取给定目录下的 markdown 文件，并查找带有 #tag 的内容 */
async function getTags(ctx) {
  // 先不考虑多级目录的情况
  let fileList = fs.readdirSync(filePath);
  fileList = fileList.filter((file) => {
    const extname = path.extname(file).toLowerCase();
    return extname === '.md' || extname === '.markdown';
  });

  const tags = new Set();
  fileList.forEach((file) => {
    const content = fs.readFileSync(path.resolve(filePath, file), 'utf8');
    const tag = content.match(/(?<=(^|\s))#(?!(\s|#))([\S]+)/gm);
    if (tag) {
      tag.forEach((t) => {
        tags.add(t);
      });
    }
  });

  ctx.body = {
    success: true,
    data: Array.from(tags),
  };
}

module.exports = {
  getMarkdownList,
  getMarkdownFile,
  renderList,
  runCommand,
  getUserConfig,
  saveUserConfig,
  filePath,
  getTags,
};
