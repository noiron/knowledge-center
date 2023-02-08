// @ts-check
import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import { exec } from 'child_process';
import inquirer from 'inquirer';
import emoji from 'node-emoji';
import markdownLinkExtractor from 'markdown-link-extractor';
import { traverseFolder, traverseFolderWithInfo } from '../server/utils';
import { isImage, isMarkdownFile } from '../common/utils';
import { FileInfo, Tags } from '../common/types';

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
      // TODO: 打开方式可选
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
  const list: FileInfo[] = [];
  traverseFolderWithInfo(path.resolve(process.cwd()), list);
  const filteredList = list
    .filter((item) => isMarkdownFile(item.path))
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

/**
 * 给定文件地址，提取文件种的所有链接
 * @param filePath
 * @returns
 */
export function extractLinks(filePath: string): string[] {
  const markdown = fs.readFileSync(filePath, { encoding: 'utf8' });
  // todo: 这个库使用的是解析整个 markdown 文件，然后提取链接的方式，可以考虑更换
  const links = markdownLinkExtractor(markdown);
  return links;
}

export function getAllLinks() {
  const list = [];
  traverseFolder(process.cwd(), list);

  const graph: { [file: string]: string[] } = {};

  list.forEach((file) => {
    const links: string[] = extractLinks(file)
      .filter(isLocalLink)
      .filter((link: string) => !isImage(link))
      .filter((link: string) => !isBearLink(link));
    if (links.length > 0) {
      // console.log(chalk.green('---------------------'));
      // console.log(chalk.yellow(file));
      // console.log(path.dirname(file));
      const processedLinks = links.map((link) => {
        const absolutePath = path.resolve(
          path.dirname(file),
          decodeURIComponent(link)
        );
        return path.relative(process.cwd(), absolutePath);
      });
      graph[path.relative(process.cwd(), file)] = processedLinks;
    }
  });

  fs.writeFileSync(__dirname + '/graph.json', JSON.stringify(graph, null, 2));
}

function isLocalLink(link: string) {
  if (link.startsWith('http')) return false;
  return true;
}

function isBearLink(link: string) {
  return link.startsWith('bear://x-callback-url');
}

getAllLinks();
