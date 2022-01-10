const fs = require('fs');
const path = require('path');
const Koa = require('koa');
const router = require('@koa/router')();
const serve = require('koa-static');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const {
  renderList,
  getMarkdownList,
  getMarkdownFile,
  runCommand,
  getUserConfig,
  saveUserConfig,
  filePath,
} = require('./services');

const app = new Koa();
app.use(cors());
app.use(bodyParser());
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

// TODO: 处理多级目录
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
