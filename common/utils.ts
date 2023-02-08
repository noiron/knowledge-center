import path from 'path';
import { traverseFolder, checkFileTags } from '../server/utils';
import { isMarkdownFile, purifyTag } from 'kainotes-tools';
import { Tags } from './types';

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

/**
 * 给定文件夹地址，找出所有包含某标签的文件
 * @param folder 文件夹路径
 * @param searchTag 要查找的标签
 */
export function getTag(folder: string, searchTag: string) {
  const list: string[] = [];
  const fileList: string[] = [];
  // todo: 这里的内容应该在获取 tags 的时候就缓存过，在缓存中没有的情况下才再次获取
  traverseFolder(folder, fileList);
  fileList.filter(isMarkdownFile).forEach((file) => {
    const absolutePath = path.resolve(folder, file);
    const matchedTags = checkFileTags(absolutePath);
    if (matchedTags) {
      for (const tag of matchedTags) {
        if (purifyTag(tag) === searchTag) {
          list.push(path.relative(folder, absolutePath));
          break;
        }
      }
    }
  });
  return list;
}
