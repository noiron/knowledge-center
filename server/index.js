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
  getTags,
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
app.listen(4001);
