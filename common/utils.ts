import path from 'path';
import { traverseFolder, checkFileTags } from '../server/utils';
import { Tags } from './types';

/**
 * 判断一个文件是否为 markdown 文件
 */
export const isMarkdownFile = (filePath: string) => {
  const extname = path.extname(filePath).toLowerCase();
  return extname === '.md' || extname === '.markdown';
};

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
  fileList.filter(isMarkdownFile).forEach((absolutePath) => {
    const tagsInFile = checkFileTags(absolutePath);
    const relativePath = path.relative(folder, absolutePath);

    if (tagsInFile) {
      for (const tag of tagsInFile) {
        if (purifyTag(tag) === searchTag) {
          list.push(relativePath);
          break;
        }
      }
    } else if (!searchTag) {
      // 查找所有不包含标签的文件
      list.push(relativePath);
    }
  });
  return list;
}

/**
 * 判断一个链接是否是图片
 * @param link 链接或本地文件路径
 */
export function isImage(link: string) {
  return /\.(jpe?g|png|svg|gif)$/i.test(link);
}
