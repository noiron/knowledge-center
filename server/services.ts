import fs from 'fs';
import path from 'path';
import * as utils from './utils';
import { exec } from 'child_process';
import { homedir } from 'os';

// export const filePath = path.resolve(__dirname, '../mds');
export const filePath = path.resolve(
  homedir(),
  './Desktop/markdown-notes-sync'
);

/**
 * 获取一个 markdown 文件的内容
 */
export async function getMarkdownFile(ctx) {
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
export async function renderList(ctx) {
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
export async function runCommand(ctx) {
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
export async function getMarkdownList(ctx) {
  const baseNameOfFolder = path.basename(filePath);
  const rootNode = {
    path: baseNameOfFolder,
    type: 'folder',
    children: [],
    isRoot: true,
  };

  const nodes = {
    [baseNameOfFolder]: rootNode,
  };
  const list = utils.walkFolder({
    rootPath: filePath,
    folderRelativePath: './',
    nodes,
    parentNode: rootNode,
  });
  ctx.body = list;
}

export async function getUserConfig(ctx) {
  const config = await import('./user-config.js');
  ctx.body = config;
}

export async function saveUserConfig(ctx) {
  const configPath = path.resolve(__dirname, './user-config.js');
  const config = ctx.request.body;

  // eslint-disable-next-line @typescript-eslint/no-var-requires
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
export async function getTags(ctx) {
  // 先不考虑多级目录的情况
  let fileList = fs.readdirSync(filePath);
  fileList = fileList.filter(utils.isMarkdownFile);

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

/**
 * 获取含有指定 tag 的 markdown 文件列表
 */
export async function getTag(ctx) {
  const searchTag = ctx.params[0];

  const list: string[] = [];
  let fileList = fs.readdirSync(filePath);
  fileList = fileList.filter(utils.isMarkdownFile);
  fileList.forEach((file) => {
    const content = fs.readFileSync(path.resolve(filePath, file), 'utf8');
    const tag = content.match(/(?<=(^|\s))#(?!(\s|#))([\S]+)/gm);
    if (tag && searchTag === tag[0].slice(1)) {
      list.push(file);
    }
  });

  ctx.body = {
    success: true,
    data: list,
  };
}