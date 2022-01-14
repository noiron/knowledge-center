import { useEffect, useState } from 'react';
import { getFileContent, getFileList, getTags, getUserConfig } from '../api';
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
      setTags(res.data.data);
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
};

/**
 * 获取用户配置
 */
export const useUserConfig = () => {
  const [userConfig, setUserConfig] = useState<any>({});
  useEffect(() => {
    getUserConfig().then((res) => {
      setUserConfig(res.data);
    });
  }, []);

  return userConfig;
};
