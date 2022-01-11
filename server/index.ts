import Koa from 'koa';
import Router from '@koa/router';
import serve from 'koa-static';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import {
  renderList,
  getMarkdownList,
  getMarkdownFile,
  runCommand,
  getUserConfig,
  saveUserConfig,
  getTags,
  filePath,
} from './services';

const router = Router();
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
