const fs = require('fs');
const path = require('path');
const Koa = require('koa');
const router = require('@koa/router')();
const serve = require('koa-static');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const { exec } = require('child_process');
const utils = require('./utils');

const app = new Koa();
app.use(cors());
app.use(bodyParser());
const filePath = path.resolve(__dirname, '../mds');

app.use(serve(filePath));

router
  .get('/', renderList)
  .get('/list', getMarkdownList)
  .get('/file/(.*)', getMarkdownFile)
  .post('/run', runCommand)
  .get('/user-config', getUserConfig)
  .post('/save-config', saveUserConfig)
  .get('/tags', getTags);

app.use(router.routes());

async function getMarkdownList(ctx) {
  // let fileList = fs.readdirSync(filePath);
  // fileList = fileList.filter((file) => {
  //   const extname = path.extname(file).toLowerCase();
  //   return extname === '.md' || extname === '.markdown';
  // });
  // ctx.body = fileList;

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
  console.log('query: ', query);
  const { file } = query;
  exec('open -a typora ' + path.resolve(__dirname, '../mds', file));
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

/** 读取给定目录下的 markdown 文件，并查找带有 #tag 的内容 */
async function getTags(ctx) {
  // 先不考虑多级目录的情况
  let fileList = fs.readdirSync(filePath);
  fileList = fileList.filter((file) => {
    const extname = path.extname(file).toLowerCase();
    return extname === '.md' || extname === '.markdown';
  });

  const tags = new Set();
  fileList.forEach((file) => {
    const content = fs.readFileSync(
      path.resolve(__dirname, '../mds', file),
      'utf8'
    );
    const tag = content.match(/(?<=(^|\s))#(?!(\s|#))([\S]+)/gm);
    if (tag) {
      tag.forEach((t) => {
        tags.add(t);
      });
    }
  });

  ctx.body = {
    success: true,
    data: Array.from(tags),
  };
}

app.listen(4001);
