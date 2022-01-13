import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
import MarkdownIt from 'markdown-it';
import styled from 'styled-components';
import taskLists from 'markdown-it-task-lists';
import hljs from 'highlight.js';
import FileList from './components/file-list';
import { getFileContent, getUserConfig, postUserConfig, UserConfig } from './api';
import ActivityBar from './components/activity-bar';
import Content from './components/content';
import { ModeType } from './types';
import { useFileList, useTags } from './hooks';

const md = new MarkdownIt({
  breaks: true,
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return hljs.highlight(lang, str).value;
      } catch (err) {
        console.log(err);
      }
    }

    return ''; // 使用额外的默认转义
  },
});
md.use(taskLists);

const Box = styled.div`
  height: 100vh;
  position: relative;
`;

function App() {
  const list = useFileList();
  const tags = useTags();
  const [mode, setMode] = useState<ModeType>('file');
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [userConfig, setUserConfig] = useState<any>({});
  const [leftWidth, setLeftWidth] = useState(200);
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
    if (Object.keys(list).length === 0) return;
    setFileName(userConfig.lastActiveFile || list[0]);
  }, [list, userConfig.lastActiveFile]);

  useEffect(() => {
    setMode(userConfig.mode || 'file');
  }, [userConfig.mode]);

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

  const saveUserConfig = (data: Partial<UserConfig>) => {
    postUserConfig(data);
  };

  const changeMode = (mode: ModeType) => {
    setMode(mode);
    saveUserConfig({ mode });
  };

  return (
    <Box>
      <ActivityBar changeMode={changeMode} currentMode={mode} />

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

      <Content content={content} fileName={fileName} leftWidth={leftWidth} />
    </Box>
  );
}

export default App;
