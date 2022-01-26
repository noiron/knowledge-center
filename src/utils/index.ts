import { ITree } from '@/types';
import values from 'lodash/values';

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
