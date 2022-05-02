#!/usr/bin/env ts-node
// @ts-check
// import fs from 'fs';
import path from 'path';
import { exec, fork } from 'child_process';
import { Command } from 'commander';
import chalk from 'chalk';
// import emoji from 'node-emoji';
import {
  getFileListInTimeRange,
  openTagCloudInBrowser,
  selectFileToOpen,
} from './utils';
import * as commonUtils from '../common/utils';

const serverPath = path.resolve(__dirname, '../server/index.ts');
// fork(serverPath);

const program = new Command();

program
  .name('knowledge-center')
  .description('CLI to manage your markdown files')
  .version('0.0.1');

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

program
  .command('tags')
  .description('列出所有标签')
  .option('-o, --open', '在浏览器中打开标签云')
  .action(({ open }) => {
    const tags = commonUtils.getTags(process.cwd());
    const keys = Object.keys(tags);
    const tagList = keys.map((key) => [key, tags[key]]);
    // @ts-ignore
    tagList.sort((a, b) => b[1] - a[1]);
    const str = tagList.reduce((prev, tag) => {
      return (prev += `${chalk.green(tag[0])} x ${chalk.yellow(tag[1])}\n`);
    }, '');
    console.log(str);

    if (open) {
      openTagCloudInBrowser(tags);
    }
  });

program.parse();
