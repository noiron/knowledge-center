#!/usr/bin/env ts-node
// @ts-check
import { fork } from 'child_process';
import path from 'path';
import { Command } from 'commander';
import { getFileListInTimeRange, selectFileToOpen } from './utils';

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
    const week = 1000 * 60 * 60 * 24 * 7;
    const list = getFileListInTimeRange(week);
    const fileNames = list.map((item) => item.absolutePath);
    selectFileToOpen(fileNames);
  });

program.parse();
