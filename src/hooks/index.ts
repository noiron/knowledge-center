import { useEffect, useState } from 'react';
import { getFileContent, getFileList, getTags } from '../api';
import { INode } from '../components/tree';

/**
 * 获取文件列表，以树形结构返回
 */
export const useFileList = (): { [key: string]: INode } => {
  const [list, setList] = useState<{ [key: string]: INode }>({});

  useEffect(() => {
    getFileList().then((res) => {
      setList(res.data);
    });
  }, []);

  return list;
};

/**
 * 获取标签列表
 */
export const useTags = (): string[] => {
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    getTags().then((res) => {
      // todo: 如何处理 #tag 前面的井字符
      setTags(res.data.data.map((_) => _.slice(1)));
    });
  }, []);

  return tags;
};

/**
 * 根据文件路径来获取文件的内容
 */
export const useFileContent = (fileName: string) => {
  const [content, setContent] = useState('');

  useEffect(() => {
    if (!fileName) return;
    getFileContent(fileName).then((res) => {
      setContent(res.data);
    });
  }, [fileName]);

  return content;
}
