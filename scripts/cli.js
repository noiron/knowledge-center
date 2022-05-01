#!/usr/bin/env ts-node
// 写这个脚本的原因是 server 需要使用 ts-node 开启，但是现在还不知道如何在 .sh 脚本中处理绝对路径
// @ts-check
import { fork } from 'child_process';
import path from 'path';
import { Command } from 'commander';
import {
  traverseFolder,
  isMarkdownFile,
  traverseFolderWithInfo,
} from '../server/utils';
import { ListFormat } from 'typescript';

const serverPath = path.resolve(__dirname, '../server/index.ts');
// fork(serverPath);

const program = new Command();

program
  .name('string-util')
  .description('CLI to some JavaScript string utilities')
  .version('0.8.0');

program
  .command('start')
  .description('开启服务')
  .action(() => {
    fork(serverPath);
  });

program
  .command('week')
  .description('列出最近一周内编辑过的文件')
  .action(() => {
    const list = [];
    traverseFolderWithInfo(path.resolve(process.cwd()), list);
    const filteredList = list
      .filter((item) => isMarkdownFile(item.absolutePath))
      .filter((item) => {
        const { lastModifiedTime } = item;
        const week = 1000 * 60 * 60 * 24 * 7;
        return Date.now() - new Date(lastModifiedTime).getTime() < week;
      })
      .sort((a, b) => {
        return (
          new Date(b.lastModifiedTime).getTime() -
          new Date(a.lastModifiedTime).getTime()
        );
      });
    const fileNames = filteredList.map((item) => item.absolutePath);
    console.log('fileNames: ', fileNames);
  });

program.parse();
