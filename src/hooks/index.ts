import { INode } from '@/types';
import { FileInfo } from '@common/types';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  getFileContent,
  getFileTree,
  getTags,
  getUserConfig,
  getFileInfoList,
} from '../api';

/**
 * 获取文件列表，以树形结构返回
 */
export const useFileTree = (folderPath: string): { [key: string]: INode } => {
  const [list, setList] = useState<{ [key: string]: INode }>({});

  useEffect(() => {
    getFileTree().then((res) => {
      if (res.data.success) {
        setList(res.data.data);
      }
    });
  }, [folderPath]);

  return list;
};

/**
 * 获取文件列表，以数组形式返回
 */
export const useFileInfoList = (): FileInfo[] => {
  const [list, setList] = useState<FileInfo[]>([]);

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
export const useTags = (folderPath: string): { [key: string]: number } => {
  const [tags, setTags] = useState<{ [index: string]: number }>({});

  useEffect(() => {
    getTags().then((res) => {
      setTags(res.data.data);
    });
  }, [folderPath]);

  return tags;
};

/**
 * 根据文件路径来获取文件的内容
 */
export const useFileContent = (fileName: string) => {
  const [content, setContent] = useState('');

  useEffect(() => {
    if (!fileName) return;
    getFileContent(fileName)
      .then((res) => {
        if (res.data.success) {
          setContent(res.data.data);
        } else {
          throw new Error(res.data.message);
        }
      })
      .catch((err) => {
        toast(err.message, {
          icon: '❌',
        });
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
