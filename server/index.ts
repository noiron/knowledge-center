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

router
  .get('/', renderList)
  .get('/file-tree', getMarkdownTree)
  .get('/file-list', getMarkdownList)
  .get('/file/(.*)', getMarkdownFile)
  .post('/run', runCommand)
  .get('/user-config', getUserConfig)
  .post('/save-config', saveUserConfig)
  .get('/tags', getTags)
  .get('/tag/(.*)', getTag)
  .get('/git-status', getGitStatus);

app.use(router.routes());
app.listen(4001);
