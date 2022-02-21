import values from 'lodash/values';
import { ITree } from '@/types';
import { postOpenFileInTypora, postOpenFileInVSCode } from '@/api';

export function extractFileName(filePath: string) {
  return filePath.split('/').pop();
}

export function formatTime(time: string) {
  const date = new Date(time);
  return date.toLocaleString();
}

/** 从节点树中取出根节点 */
export function getRootNodes(treeData: ITree) {
  return values(treeData).filter((node) => node.isRoot === true);
}

/** 使用 VSCode 来打开文件 */
export function openFileInVSCode(filePath: string) {
  postOpenFileInVSCode(filePath);
}

/** 使用 VSCode 来打开文件所在的文件夹 */
export function openFolderInVSCode(filePath: string) {
  const arr = filePath.split('/');
  const folder = arr.slice(0, arr.length - 1).join('/');
  postOpenFileInVSCode(folder);
}

/** 使用 Typora 来打开文件 */
export function openFileInTypora(filePath: string) {
  postOpenFileInTypora(filePath);
}
