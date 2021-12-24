const fs = require('fs');
const path = require('path');
const Koa = require('koa');
const router = require('@koa/router')();
const serve = require('koa-static');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const { exec } = require('child_process');

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
  .post('/save-config', saveUserConfig);

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

app.listen(4001);
