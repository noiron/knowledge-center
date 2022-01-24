import axios, { AxiosPromise } from 'axios';
import { INode } from './components/tree';
import { FileInfo, ITags } from './types';

export function getFileTree(): AxiosPromise<{
  success: boolean;
  data: { [key: string]: INode };
}> {
  return axios.get('/api/file-tree');
}

export function getFileInfoList(): AxiosPromise<FileInfo[]> {
  return axios.get('/api/file-list');
}

export function getFileContent(fileName: string): AxiosPromise<{
  success: boolean;
  data: string;
  message: string;
}> {
  return axios.get(`/api/file/${fileName}`);
}

export interface UserConfig {
  lastActiveFile: string;
  leftWidth: number;
  mode: string;
  folderPath: string;
}

export function getUserConfig(): AxiosPromise<UserConfig> {
  return axios.get('/api/user-config');
}

export function postUserConfig(userConfig: Partial<UserConfig>): AxiosPromise {
  return axios.post('/api/save-config', userConfig);
}

export function getTags(): AxiosPromise<{
  success: true;
  data: ITags;
}> {
  return axios.get('/api/tags');
}
