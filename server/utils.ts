import fs from 'fs';
import path from 'path';
import { extractTagsFromContent, isMarkdownFile } from 'kainotes-tools';

// todo: 这里全部是用同步的方式，可考虑改为异步的
export const walkFolder = ({
  rootPath,
  folderRelativePath,
  nodes,
  parentNode,
}: {
  /** 这个文件夹的根目录 */
  rootPath: string;
  /** 正在遍历的这个文件夹相对于根目录的相对路径 */
  folderRelativePath: string;
  /** 要保存的数据内容，以相对路径为 key */
  nodes: any;
  /** 当前文件的父级文件夹，遍历时需要修改 parent 的 children 属性 */
  parentNode: any;
}) => {
  const files = fs.readdirSync(path.resolve(rootPath, folderRelativePath));

  files.forEach((file) => {
    const absolutePath = path.resolve(rootPath, folderRelativePath, file);
    const relativePath = path.relative(rootPath, absolutePath);
    const stats = fs.statSync(absolutePath);

    if (stats.isFile() && isMarkdownFile(absolutePath)) {
      nodes[relativePath] = {
        path: relativePath,
        type: 'file',
      };
      parentNode.children.push(relativePath);
    }
    if (stats.isDirectory() && !isHiddenDir(file)) {
      // 文件夹保存的是绝对路径，而文件保存的相对路径
      const newParent = {
        path: relativePath,
        type: 'folder',
        children: [],
      };

      walkFolder({
        rootPath,
        folderRelativePath: relativePath,
        nodes,
        parentNode: newParent,
      });
      nodes[relativePath] = newParent;
      parentNode.children.push(relativePath);
    }
  });

  return nodes;
};

/**
 * 判断一个文件夹是否为隐藏文件夹
 */
export const isHiddenDir = (dirName: string) => {
  return dirName.startsWith('.');
};

/**
 * 读取给定根目录下的所有文件，按数组格式返回
 */
export const traverseFolder = (rootPath: string, list: string[]) => {
  const files = fs.readdirSync(rootPath);

  files.forEach((file) => {
    const absolutePath = path.resolve(rootPath, file);
    const stats = fs.statSync(absolutePath);

    if (stats.isFile()) {
      list.push(absolutePath);
    }

    if (stats.isDirectory() && !isHiddenDir(file)) {
      traverseFolder(absolutePath, list);
    }
  });

  return list;
};

export const traverseFolderWithInfo = (rootPath: string, list: any[]) => {
  const files = fs.readdirSync(rootPath);

  files.forEach((file) => {
    const absolutePath = path.resolve(rootPath, file);
    const stats = fs.statSync(absolutePath);

    if (stats.isFile()) {
      list.push({
        absolutePath,
        lastModifiedTime: stats.mtime,
      });
    }

    if (stats.isDirectory() && !isHiddenDir(file)) {
      traverseFolderWithInfo(absolutePath, list);
    }
  });

  return list;
};

// /**
//  * 检查给定的内容中是否包含标签
//  */
// const checkTags = (content: string) => {
//   return content.match(/(?<=(^|\s))#(?!(\s|#|!))([\S]+)/gm);
// };

/**
 * 给定文件路径，读取内容，检查其中是否包含标签
 */
export const extractFileTags = (filePath: string) => {
  const content = fs.readFileSync(filePath, 'utf8');
  return extractTagsFromContent(content);
};

/**
 * 给定一个文件夹的地址，将所有的文件内容生成一个目录
 */
export const generateMenu = (folderPath: string) => {
  const list: string[] = [];
  traverseFolder(folderPath, list);

  const contents: {
    relativePath: string;
    title: string;
  }[] = [];
  list.forEach((filePath) => {
    const stats = fs.statSync(filePath);
    if (stats.isFile() && isMarkdownFile(filePath)) {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const firstLine = fileContent.split('\n')[0];
      if (firstLine.startsWith('# ')) {
        contents.push({
          relativePath: path.relative(folderPath, filePath),
          title: firstLine.slice(2),
        });
      }
    }
  });

  // TODO: 写入文件前是否要先清空？

  // https://stackoverflow.com/questions/50092740/newline-in-fs-writefile
  const CreateFiles = fs.createWriteStream(
    path.resolve(folderPath, '_menu.md'),
    {
      flags: 'a', // flags: 'a' preserved old data
    }
  );

  for (let i = 0; i < contents.length; i++) {
    CreateFiles.write(`[${contents[i].title}](${contents[i].relativePath})\n`);
  }
};
