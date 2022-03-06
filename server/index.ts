import Koa from 'koa';
import Router from '@koa/router';
import serve from 'koa-static';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';
import mount from 'koa-mount';
import detect from 'detect-port';
import chalk from 'chalk';
import emoji from 'node-emoji';
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
  openFile,
} from './services';

const FILE_PATH = getFilePath();

const router = Router();
const app = new Koa();
app.use(cors());
app.use(bodyParser());
// FIXME: 如何处理 FILE_PATH 改变的情况
app.use(serve(FILE_PATH));

app.use(serve(__dirname + '/../dist'));
// app.use(mount('/styles', serve(__dirname + '/../src/styles')));

router
  .get('/', renderList)
  .get('/api/file-tree', getMarkdownTree)
  .get('/api/file-list', getMarkdownList)
  .get('/api/file/(.*)', getMarkdownFile)
  .post('/api/run', runCommand)
  .post('/api/open', openFile)
  .get('/api/user-config', getUserConfig)
  .post('/api/save-config', saveUserConfig)
  .get('/api/tags', getTags)
  .get('/api/tag/(.*)', getTag)
  .get('/api/git-status', getGitStatus);

const PORT = 4001;
app.use(router.routes());

detect(PORT)
  .then((port) => {
    if (port === PORT) {
      app.listen(PORT);
      console.log(
        emoji.get('rocket'),
        chalk.green('App in running at'),
        chalk.blue('http://localhost:' + PORT)
      );
    } else {
      console.log(emoji.get('frog'), `Sorry, port:${PORT} was occupied.`);
    }
  })
  .catch((err) => {
    console.log(err);
  });
