const fs = require('fs');
const path = require('path');
const utils = require('./utils');
const { exec } = require('child_process');

async function getMarkdownFile(ctx) {
  const fileName = ctx.params[0];
  const myMarkdown = fs.readFileSync(
    path.resolve(__dirname, `../mds/${fileName}`),
    'utf8'
  );
  ctx.body = myMarkdown;
}

async function renderList(ctx) {
  const fileList = fs.readdirSync(filePath);
  const links = fileList
    .map((file) => {
      return `<a href='./file/${file}'>${file}</a>`;
    })
    .join('<br />');

  ctx.body = `<html><head><title>Hello Everyone</title></head><body>
      <h1>Hello Everyone</h1>
      ${links}
      </body>
    </html>`;
  ctx.type = 'html';
}

async function runCommand(ctx) {
  const query = ctx.request.query;
  const { file } = query;
  exec('open -a typora ' + path.resolve(__dirname, '../mds', file));
}

async function getMarkdownList(ctx) {
  const root = {
    path: './mds',
    type: 'folder',
    children: [],
    isRoot: true,
  };

  const myList = {
    './mds': root,
  };
  const list = utils.myWalk(
    path.resolve(__dirname, '../mds'),
    './',
    myList,
    root
  );
  ctx.body = list;
}

async function getUserConfig(ctx) {
  const config = require('./user-config.js');
  ctx.body = config;
}

async function saveUserConfig(ctx) {
  const configPath = path.resolve(__dirname, './user-config.js');
  const config = ctx.request.body;
  const originalConfig = require(configPath);
  const newConfig = Object.assign(originalConfig, config);
  const str = `module.exports = ${JSON.stringify(newConfig)}`;
  fs.writeFileSync(configPath, str, 'utf8');
  ctx.body = {
    success: true,
  };
}

module.exports = {
  getMarkdownList,
  getMarkdownFile,
  renderList,
  runCommand,
  getUserConfig,
  saveUserConfig,
};
