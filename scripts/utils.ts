// @ts-check
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { exec } from 'child_process';
import inquirer from 'inquirer';
import emoji from 'node-emoji';
import { traverseFolderWithInfo } from '../server/utils';
import { isMarkdownFile } from 'kainotes-tools';
import { Tags } from '../common/types';

/**
 * 从文件列表中选择一个打开
 * @param {string[]} files
 */
export function selectFileToOpen(files, firstTime = true) {
  // if (firstTime) {
  //   console.log(emoji.get('file_folder') + ' 下列是最近一周内编辑过的文件：');
  //   files.forEach((fileName, index) => {
  //     logFile(fileName, index);
  //   });
  // }

  inquirer
    .prompt([
      {
        name: 'fileIndex',
        type: 'checkbox',
        message: firstTime
          ? '请选择想查看的文件编号'
          : '打开另一个文件（0退出）？',
        pageSize: 10,
        loop: false,
        choices: files.map((fileName, index) => ({
          name: `${index + 1}. ${chalk.yellow(
            getFileTitle(fileName)
          )}（${path.relative(process.cwd(), fileName)}）`,
          value: index + 1,
        })),
      },
    ])
    .then((answers) => {
      const { fileIndex } = answers;
      // if (fileIndex < 1 || fileIndex > files.length) {
      //   return;
      // }
      fileIndex.forEach((i) => exec('open -a typora ' + files[i - 1]));
      // selectFileToOpen(files, false);
    })
    .catch((error) => {
      console.log(error);
    });
}

/**
 * 列出在给定时间段内编辑过的文件
 * @param {number} ms 距今毫秒数
 */
export function getFileListInTimeRange(ms: number) {
  const list = [];
  traverseFolderWithInfo(path.resolve(process.cwd()), list);
  const filteredList = list
    .filter((item: any) => isMarkdownFile(item.absolutePath))
    .filter((item) => {
      const { lastModifiedTime } = item;
      return Date.now() - new Date(lastModifiedTime).getTime() < ms;
    })
    .sort((a: any, b: any) => {
      return (
        new Date(b.lastModifiedTime).getTime() -
        new Date(a.lastModifiedTime).getTime()
      );
    });
  return filteredList;
}

function logFile(fileName, index) {
  console.log(
    `${emoji.get('newspaper')} ${index + 1}. ${path.relative(
      process.cwd(),
      fileName
    )}`
  );
}

/**
 * 在浏览器中打开标签云页面
 * @param {*} tags
 */
export function openTagCloudInBrowser(tags: Tags) {
  const templatePath = path.resolve(__dirname, './tag-cloud-template.html');
  let html = fs.readFileSync(templatePath, {
    encoding: 'utf-8',
  });
  html = html.replace('__tags__', JSON.stringify(tags));
  const writePath = path.resolve(__dirname, '../dist/tag-cloud.html');
  fs.writeFileSync(writePath, html);
  exec(`open -a 'google chrome' ${writePath}`);
}

/**
 * 从文件内容中获得文件标题，一般为文件的第一行，以 # 开头
 * @param {string} filePath
 */
export function getFileTitle(filePath: string) {
  const content = fs.readFileSync(filePath, {
    encoding: 'utf-8',
  });
  const lines = content.split('\n');
  const firstLine = lines[0];
  if (firstLine.startsWith('# ')) {
    return firstLine.substring(2).trim();
  }
  return '';
}
