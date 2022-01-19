import { useEffect, useState } from 'react';
import {
  getFileContent,
  getFileTree,
  getTags,
  getUserConfig,
  getFileInfoList,
} from '../api';
import { INode } from '../components/tree';

/**
 * 获取文件列表，以树形结构返回
 */
export const useFileTree = (): { [key: string]: INode } => {
  const [list, setList] = useState<{ [key: string]: INode }>({});

  useEffect(() => {
    getFileTree().then((res) => {
      setList(res.data);
    });
  }, []);

  return list;
};

/**
 * 获取文件列表，以数组形式返回
 */
export const useFileInfoList = (): any[] => {
  const [list, setList] = useState<any>([]);

  useEffect(() => {
    getFileInfoList().then((res) => {
      setList(res.data);
    });
  }, []);

  return list;
};

/**
 * 获取标签列表
 */
export const useTags = (): { [key: string]: number } => {
  const [tags, setTags] = useState<{ [index: string]: number }>({});

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
