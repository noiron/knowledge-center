import fs from 'fs';
import path from 'path';
import * as utils from './utils';
import { promisify } from 'util';
import { exec } from 'child_process';
import * as commonUtils from '../common/utils';
import { FileInfo } from '../common/types';

const promisifyExec = promisify(exec);
// import { homedir } from 'os';

// export const filePath = path.resolve(__dirname, '../mds');
// export const FILE_PATH = path.resolve(
//   homedir(),
//   './Desktop/markdown-notes-sync'
// );

const configPath = path.resolve(__dirname, './user-config.js');
const existed = fs.existsSync(configPath);
if (!existed) {
  fs.writeFileSync(
    configPath,
    `module.exports = {
      folderPath: '${path.resolve(__dirname, '../mds')}'
    }`,
    { encoding: 'utf8' }
  );
}

// eslint-disable-next-line @typescript-eslint/no-var-requires
const userConfig = require(configPath);

/**
 * 获取文件夹的基础路径，写成一个函数是因为在运行过程中这个文件夹可能变化
 */
export const getFilePath = () => {
  return userConfig.folderPath;
};

/**
 * 获取一个 markdown 文件的内容
 */
export async function getMarkdownFile(ctx) {
  const FILE_PATH = getFilePath();
  const fileName = ctx.params[0];

  try {
    const myMarkdown = fs.readFileSync(
      path.resolve(FILE_PATH, `${fileName}`),
      'utf8'
    );
    ctx.body = {
      success: true,
      data: myMarkdown,
    };
  } catch {
    ctx.body = {
      success: false,
      message: '文件不存在',
    };
  }
}

/**
 * 读取目录下的文件，使用基本的链接形式展示为列表
 */
export async function renderList(ctx) {
  const FILE_PATH = getFilePath();
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
  const FILE_PATH = getFilePath();
  const query = ctx.request.query;
  const { file } = query;
  exec('open -a typora ' + path.resolve(FILE_PATH, file));
  ctx.body = {
    success: true,
  };
}

export async function openFile(ctx) {
  const FILE_PATH = getFilePath();
  const query = ctx.request.query;
  const { file } = query;
  exec('code ' + path.resolve(FILE_PATH, file));
  ctx.body = {
    success: true,
  };
}

/**
 * 获取目录下所有的 markdown 文件，以树形结构返回
 */
export async function getMarkdownTree(ctx) {
  const FILE_PATH = getFilePath();
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
  ctx.body = {
    success: true,
    data: list,
  };
}

/**
 * 获取目录下所有的 markdown 文件，以列表形式返回，按编辑时间排序
 */
export async function getMarkdownList(ctx) {
  const FILE_PATH = getFilePath();
  const list: FileInfo[] = [];
  utils.traverseFolderWithInfo(FILE_PATH, list);
  const fileList = list.filter((item) => {
    return utils.isMarkdownFile(item.absolutePath || '');
  });
  fileList.forEach((file) => {
    file.path = path.relative(FILE_PATH, file.absolutePath || '');
    delete file.absolutePath;
  });

  ctx.body = fileList;
}

export async function getUserConfig(ctx) {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const config = require(configPath);
  ctx.body = config;
}

export async function saveUserConfig(ctx) {
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
  const FILE_PATH = getFilePath();
  const tags = commonUtils.getTags(FILE_PATH);

  ctx.body = {
    success: true,
    data: tags,
  };
}

/**
 * 获取含有指定 tag 的 markdown 文件列表
 */
export async function getTag(ctx) {
  const FILE_PATH = getFilePath();
  const searchTag = ctx.params[0];

  const list: string[] = [];
  const fileList = [];
  // TODO: 这里的内容应该在获取 tags 的时候就缓存过，在缓存中没有的情况下才再次获取
  utils.traverseFolder(FILE_PATH, fileList);
  fileList.filter(utils.isMarkdownFile).forEach((file) => {
    const absolutePath = path.resolve(FILE_PATH, file);
    const matchedTags = utils.checkFileTags(absolutePath);
    if (matchedTags) {
      for (const tag of matchedTags) {
        if (commonUtils.purifyTag(tag) === searchTag) {
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

export async function getGitStatus(ctx) {
  const FILE_PATH = getFilePath();

  const { stdout, stderr } = await promisifyExec(`git -C ${FILE_PATH} status`);

  if (stderr) {
    ctx.body = {
      success: false,
      data: stderr,
    };
  } else {
    ctx.body = {
      success: true,
      data: stdout,
    };
  }
}

export async function postGenerateMenu(ctx) {
  const { folderPath } = ctx.request.body;
  const FILE_PATH = getFilePath();
  const filePath = path.join(FILE_PATH, folderPath);

  utils.generateMenu(filePath);

  ctx.body = {
    success: true,
    data: folderPath,
  }
}
