import path from 'path';
import { traverseFolder, isMarkdownFile, checkFileTags } from '../server/utils';
import { Tags } from './types';

/**
 * 在标签文字的获取过程中，可能会带上开头的 #，统一用这个函数去处理
 */
export const purifyTag = (tag: string) => {
  if (typeof tag !== 'string' || tag.length === 0) return '';
  if (tag[0] !== '#') return tag;
  return tag.slice(1);
};

/**
 * 给定文件夹地址，找出所有文件种包含的标签
 * @param folder string 文件夹路径
 * @returns tags
 */
export function getTags(folder: string) {
  const list: string[] = [];
  traverseFolder(folder, list);
  const fileList = list.filter(isMarkdownFile);

  const tags: Tags = {};
  fileList.forEach((file) => {
    const absolutePath = path.resolve(folder, file);
    const matchedTags = checkFileTags(absolutePath);
    if (matchedTags) {
      matchedTags.forEach((t) => {
        t = purifyTag(t);
        tags[t] = !tags[t] ? 1 : tags[t] + 1;
      });
    }
  });
  return tags;
}
