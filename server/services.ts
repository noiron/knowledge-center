import fs from 'fs';
import path from 'path';
import * as utils from './utils';
import { exec } from 'child_process';
import { homedir } from 'os';

// export const filePath = path.resolve(__dirname, '../mds');
export const FILE_PATH = path.resolve(
  homedir(),
  './Desktop/markdown-notes-sync'
);

/**
 * 获取一个 markdown 文件的内容
 */
export async function getMarkdownFile(ctx) {
  const fileName = ctx.params[0];
  const myMarkdown = fs.readFileSync(
    path.resolve(FILE_PATH, `${fileName}`),
    'utf8'
  );
  ctx.body = myMarkdown;
}

/**
 * 读取目录下的文件，使用基本的链接形式展示为列表
 */
export async function renderList(ctx) {
  const fileList = fs.readdirSync(FILE_PATH);
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
  exec('open -a typora ' + path.resolve(FILE_PATH, file));
  ctx.body = {
    code: 0,
    message: 'success',
  };
}

/**
 * 获取目录下所有的 markdown 文件，以树形结构返回
 */
export async function getMarkdownTree(ctx) {
  const baseNameOfFolder = path.basename(FILE_PATH);
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
    rootPath: FILE_PATH,
    folderRelativePath: './',
    nodes,
    parentNode: rootNode,
  });
  ctx.body = list;
}

/**
 * 获取目录下所有的 markdown 文件，以列表形式返回，按编辑时间排序
 */
export async function getMarkdownList(ctx) {
  const list: any[] = [];
  utils.traverseFolderWithInfo(FILE_PATH, list);
  const fileList = list.filter((item) => {
    return utils.isMarkdownFile(item.absolutePath || '');
  });
  fileList.forEach((file) => {
    file.path = path.relative(FILE_PATH, file.absolutePath);
    delete file.absolutePath;
  });

  ctx.body = fileList;
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

/** 读取给定目录下的 markdown 文件，并查找带有 #tag 的内容 */
export async function getTags(ctx) {
  const list = [];
  utils.traverseFolder(FILE_PATH, list);
  const fileList = list.filter(utils.isMarkdownFile);

  const tags = {};
  fileList.forEach((file) => {
    const absolutePath = path.resolve(FILE_PATH, file);
    const matchedTags = utils.checkFileTags(absolutePath);
    if (matchedTags) {
      matchedTags.forEach((t) => {
        if (t[0] === '#') t = t.slice(1); // 去掉开头的 hash
        tags[t] = !tags[t] ? 1 : tags[t] + 1;
      });
    }
  });

  ctx.body = {
    success: true,
    data: tags,
  };
}

/**
 * 获取含有指定 tag 的 markdown 文件列表
 */
export async function getTag(ctx) {
  const searchTag = ctx.params[0];

  const list: string[] = [];
  const fileList = [];
  utils.traverseFolder(FILE_PATH, fileList);
  fileList.filter(utils.isMarkdownFile).forEach((file) => {
    const absolutePath = path.resolve(FILE_PATH, file);
    const matchedTags = utils.checkFileTags(absolutePath);
    if (matchedTags) {
      for (const tag of matchedTags) {
        if (tag.slice(1) === searchTag) {
          list.push(path.relative(FILE_PATH, absolutePath));
          break;
        }
      }
    }
  });

  ctx.body = {
    success: true,
    data: list,
  };
}
