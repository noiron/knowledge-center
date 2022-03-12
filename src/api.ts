import axios, { AxiosPromise } from 'axios';
import { INode, ITags } from './types';
import { FileInfo } from '@common/types';

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

export function getGitStatus(): AxiosPromise<{
  success: boolean;
  data: string;
}> {
  return axios.get('/api/git-status');
}

export function postOpenFileInVSCode(filePath: string): AxiosPromise {
  return axios.post(`/api/open?file=${filePath}`);
}

export function postOpenFileInTypora(filePath: string): AxiosPromise {
  return axios.post(`/api/run?file=${filePath}`);
}

export function postGenerateMenu(folderPath: string): AxiosPromise {
  return axios.post('/api/generate-menu', { folderPath });
}
