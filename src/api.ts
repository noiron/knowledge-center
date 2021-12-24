import axios, { AxiosPromise } from 'axios';

export function getFileList(): AxiosPromise<string[]> {
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
