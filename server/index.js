const fs = require('fs');
const path = require('path');
const Koa = require('koa');
const router = require('@koa/router')();
const cors = require('@koa/cors');
const { exec } = require('child_process');

const app = new Koa();
app.use(cors());

const filePath = path.resolve(__dirname, '../mds');

router
  .get('/', renderList)
  .get('/list', getMarkdownList)
  .get('/file/:fileName', getMarkdownFile)
  .post('/run', runCommand)
  .get('/user-config', getUserConfig);

app.use(router.routes());

async function getMarkdownList(ctx) {
  let fileList = fs.readdirSync(filePath);
  fileList = fileList.filter((file) => {
    const extname = path.extname(file).toLowerCase();
    return extname === '.md' || extname === '.markdown';
  });
  ctx.body = fileList;
}

async function getMarkdownFile(ctx) {
  const { fileName } = ctx.params;
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

app.listen(4001);
