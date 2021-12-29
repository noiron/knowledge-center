import axios, { AxiosPromise } from 'axios';
import { INode } from './components/tree';

export function getFileList(): AxiosPromise<{ [key: string]: INode }> {
  return axios.get('/api/list');
}

export function getFileContent(fileName: string): AxiosPromise<string> {
  return axios.get(`/api/file/${fileName}`);
}

interface UserConfig {
  lastActiveFile: string;
  leftWidth: number;
}

export function getUserConfig(): AxiosPromise<UserConfig> {
  return axios.get('/api/user-config');
}

export function postUserConfig(userConfig: any): AxiosPromise {
  return axios.post('/api/save-config', userConfig);
}
