import { useEffect, useState } from 'react';
import axios from 'axios';
import MarkdownIt from 'markdown-it';
import styled from 'styled-components';
import { API_PREFIX } from './configs';
import taskLists from 'markdown-it-task-lists';
import FileList from './components/file-list';

const md = new MarkdownIt({
  breaks: true,
});
md.use(taskLists);

const Box = styled.div`
  height: 100vh;
  position: relative;
`;

const Content = styled.div`
  margin-left: 220px;
  max-height: 100vh;
  padding: 10px 20px;
  overflow-y: auto;
`;

const Button = styled.div`
  padding: 10px;
  border: 1px solid #eee;
  display: inline-block;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  border-radius: 4px;
  position: absolute;
  right: 20px;
  top: 20px;
`;

function App() {
  const [list, setList] = useState([]);
  const [content, setContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [userConfig, setUserConfig] = useState<any>({});

  useEffect(() => {
    axios.get(`${API_PREFIX}/user-config`).then((res) => {
      setUserConfig({
        ...userConfig,
        ...res.data,
      });
    });
  }, []);

  useEffect(() => {
    axios.get(`${API_PREFIX}/list`).then((res) => {
      setList(res.data);
    });
  }, []);

  useEffect(() => {
    if (list.length === 0) return;
    setFileName(userConfig.lastActiveFile || list[0]);
  }, [list, userConfig.lastActiveFile]);

  useEffect(() => {
    if (fileName === '') return;
    axios.get(`${API_PREFIX}/file/${fileName}`).then((res) => {
      setContent(md.render(res.data));
    });
  }, [fileName]);

  const clickFile = (fileName: string) => {
    setFileName(fileName);
  };

  return (
    <Box>
      <FileList list={list} clickFile={clickFile} activeFile={fileName} />

      <Content>
        {fileName && (
          <Button
            onClick={() => {
              axios.post(`${API_PREFIX}/run?file=` + fileName);
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
