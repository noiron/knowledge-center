const fs = require('fs');
const path = require('path');

// todo: 这里全部是用同步的方式，可考虑改为异步的
/**
 * basePath 指的是这个文件夹的根目录
 * filePath 指的是当前文件的相对于根目录的相对路径
 * myList 是要保存的数据内容，以相对路径为 key
 * parent 是当前文件的父级文件夹，遍历时需要修改 parent 的 children 属性
 */
const myWalk = ({ basePath, filePath, myList, parent }) => {
  const files = fs.readdirSync(path.resolve(basePath, filePath));
  files.forEach((file) => {
    const absolutePath = path.resolve(basePath, filePath, file);
    const relativePath = path.relative(basePath, absolutePath);
    const stats = fs.statSync(absolutePath);
    const extname = path.extname(file).toLowerCase();

    if (stats.isFile()) {
      if (extname === '.md' || extname === '.markdown') {
        myList[relativePath] = {
          path: relativePath,
          type: 'file',
        };
        if (parent.children) {
          parent.children.push(relativePath);
        }
      }
    }
    if (stats.isDirectory()) {
      // 文件夹保存的是绝对路径，而文件保存的相对路径
      const newParent = {
        path: relativePath,
        type: 'folder',
        children: [],
      };

      myWalk({
        basePath,
        filePath: relativePath,
        myList,
        parent: newParent,
      });
      myList[relativePath] = newParent;

      if (parent.children) {
        parent.children.push(relativePath);
      }
    }
  });

  return myList;
};

module.exports = {
  myWalk,
};
