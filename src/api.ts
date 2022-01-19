import axios, { AxiosPromise } from 'axios';
import { INode } from './components/tree';
import { ITags } from './types';

export function getFileList(): AxiosPromise<{ [key: string]: INode }> {
  return axios.get('/api/list');
}

export function getFileContent(fileName: string): AxiosPromise<string> {
  return axios.get(`/api/file/${fileName}`);
}

export interface UserConfig {
  lastActiveFile: string;
  leftWidth: number;
  mode: string;
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
