import { CSSProperties, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MarkdownIt from 'markdown-it';
import styled from 'styled-components';
import taskLists from 'markdown-it-task-lists';
import hljs from 'highlight.js';
import FileList from './components/file-list';
import {
  getFileContent,
  getFileList,
  getUserConfig,
  postUserConfig,
} from './api';
import ActivityBar from './components/activity-bar';
import { ACTIVITY_BAR_WIDTH } from './configs';
import { INode } from './components/tree';
import { ModeType } from './types';

const md = new MarkdownIt({
  breaks: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (__) {}
    }

    return ''; // 使用额外的默认转义
  },
});
md.use(taskLists);

const Box = styled.div`
  height: 100vh;
  position: relative;
`;

const Content = styled.div`
  margin-left: var(--margin-left);
  max-height: 100vh;
  padding: 10px 20px;
  overflow-y: auto;
`;

const Button = styled.div`
  padding: 10px;
  border: 1px solid #eee;
  display: inline-block;
  background: #fff;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  border-radius: 4px;
  position: absolute;
  right: 20px;
  top: 20px;
`;

function App() {
  const [list, setList] = useState<{ [key: string]: INode }>({});
  const [mode, setMode] = useState<ModeType>('file');
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [userConfig, setUserConfig] = useState<any>({});
  const [leftWidth, setLeftWidth] = useState(200);
  const [tags, setTags] = useState<string[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getUserConfig().then((res) => {
      setUserConfig({
        ...userConfig,
        ...res.data,
      });

      if (res.data.leftWidth) {
        setLeftWidth(res.data.leftWidth);
      }
    });
  }, []);

  useEffect(() => {
    getFileList().then((res) => {
      setList(res.data);
    });
  }, []);

  useEffect(() => {
    if (Object.keys(list).length === 0) return;
    setFileName(userConfig.lastActiveFile || list[0]);
  }, [list, userConfig.lastActiveFile]);

  useEffect(() => {
    if (fileName === '') return;
    getFileContent(fileName).then((res) => {
      setContent(md.render(res.data));
    });
  }, [fileName]);

  const clickFile = (filePath: string) => {
    setFileName(filePath);
    saveUserConfig({ lastActiveFile: filePath });

    const arr = filePath.trim().split('/');
    arr.pop();
    const prefix = arr.join('/');
    navigate(prefix + '/');
  };

  const saveLeftWidth = (width: number) => {
    saveUserConfig({ leftWidth: width });
  };

  const saveUserConfig = (data: any) => {
    postUserConfig(data);
  };

  const changeMode = (mode: ModeType) => {
    setMode(mode);
  };

  useEffect(() => {
    axios.get('/api/tags').then((res) => {
      console.log('获取到的标签如下：', res.data.data);
      setTags(res.data.data);
    });
  }, []);

  return (
    <Box>
      <ActivityBar changeMode={changeMode} />

      <FileList
        width={leftWidth}
        list={list}
        clickFile={clickFile}
        activeFile={fileName}
        setLeftWidth={setLeftWidth}
        saveLeftWidth={saveLeftWidth}
        mode={mode}
        tags={tags}
      />

      <Content
        style={
          {
            '--margin-left': leftWidth + 20 + ACTIVITY_BAR_WIDTH + 'px',
          } as CSSProperties
        }
      >
        {fileName && (
          <Button
            onClick={() => {
              axios.post(`/api/run?file=${fileName}`);
            }}
          >
            在 Typora 中打开
          </Button>
        )}
        {content ? (
          <div
            dangerouslySetInnerHTML={{
              __html: content as string,
            }}
          ></div>
        ) : (
          <p>这里没有内容</p>
        )}
      </Content>
    </Box>
  );
}

export default App;
