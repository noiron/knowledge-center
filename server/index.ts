import Koa from 'koa';
import Router from '@koa/router';
import serve from 'koa-static';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import {
  renderList,
  getMarkdownTree,
  getMarkdownFile,
  runCommand,
  getUserConfig,
  saveUserConfig,
  getTags,
  getTag,
  FILE_PATH,
} from './services';

const router = Router();
const app = new Koa();
app.use(cors());
app.use(bodyParser());
app.use(serve(FILE_PATH));

router
  .get('/', renderList)
  .get('/file-tree', getMarkdownTree)
  .get('/file/(.*)', getMarkdownFile)
  .post('/run', runCommand)
  .get('/user-config', getUserConfig)
  .post('/save-config', saveUserConfig)
  .get('/tags', getTags)
  .get('/tag/(.*)', getTag);

app.use(router.routes());
app.listen(4001);
