import { useEffect, useState } from 'react';
import { getFileList, getTags } from '../api';
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
      console.log('获取到的标签如下：', res.data.data);
      setTags(res.data.data.map((_) => _.slice(1)));
    });
  }, []);

  return tags;
};
