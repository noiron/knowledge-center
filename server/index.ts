import Koa from 'koa';
import Router from '@koa/router';
import serve from 'koa-static';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import {
  renderList,
  getMarkdownTree,
  getMarkdownList,
  getMarkdownFile,
  runCommand,
  getUserConfig,
  saveUserConfig,
  getTags,
  getTag,
  getFilePath,
  getGitStatus,
} from './services';

const FILE_PATH = getFilePath();

const router = Router();
const app = new Koa();
app.use(cors());
app.use(bodyParser());
// FIXME: 如何处理 FILE_PATH 改变的情况
app.use(serve(FILE_PATH));

app.use(serve(__dirname + '/../dist'));

router
  .get('/', renderList)
  .get('/api/file-tree', getMarkdownTree)
  .get('/api/file-list', getMarkdownList)
  .get('/api/file/(.*)', getMarkdownFile)
  .post('/api/run', runCommand)
  .get('/api/user-config', getUserConfig)
  .post('/api/save-config', saveUserConfig)
  .get('/api/tags', getTags)
  .get('/api/tag/(.*)', getTag)
  .get('/api/git-status', getGitStatus);

app.use(router.routes());
app.listen(4001);
