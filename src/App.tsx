import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { Toaster } from 'react-hot-toast';
import TextField from '@mui/material/TextField';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import SideBar from './components/side-bar';
import { postUserConfig, UserConfig } from './api';
import ActivityBar from './components/activity-bar';
import Content from './components/content';
import { ModeType } from './types';
import {
  useFileContent,
  useFileInfoList,
  useFileTree,
  useTags,
  useUserConfig,
} from './hooks';
import { MODES } from './constants';
import TagCloud from './components/tag-cloud';

const Box = styled.div`
  width: 100%;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
`;

const BORDER_WIDTH = 4;

const RightBorder = styled.div`
  background-color: var(--border-color);
  width: ${BORDER_WIDTH}px;
  height: 100vh;
  cursor: col-resize;
`;

const InputWrapper = styled.div`
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  box-shadow: 24px;
  border-radius: 4px;
  background: #fff;
  padding: 20px 30px 40px;
`;

function App() {
  const userConfig = useUserConfig();
  const [folderPath, setFolderPath] = useState(userConfig.folderPath);
  const list = useFileTree(folderPath);
  const [fileName, setFileName] = useState('');
  const content = useFileContent(fileName);
  const [searchParams] = useSearchParams();
  const tags = useTags(folderPath);
  const [activeTag, setActiveTag] = useState('');

  const fileInfoList = useFileInfoList();

  const [mode, setMode] = useState<ModeType>(MODES.FILE);
  const [leftWidth, setLeftWidth] = useState(200);
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (userConfig.leftWidth) {
      setLeftWidth(userConfig.leftWidth);
    }
  }, [userConfig.leftWidth]);

  const fileParam = searchParams.get('file');
  useEffect(() => {
    if (Object.keys(list).length === 0) return;

    // url 上带有 file 参数时，以其为最高优先级
    if (fileParam) {
      setFileName(fileParam);
      return;
    }

    setFileName(userConfig.lastActiveFile || list[0]);
  }, [list, userConfig.lastActiveFile, fileParam]);

  useEffect(() => {
    setMode(userConfig.mode || MODES.TAG);
  }, [userConfig.mode]);

  const clickFile = (filePath: string) => {
    setFileName(filePath);
    saveUserConfig({ lastActiveFile: filePath });

    navigate({
      pathname: window.location.pathname,
      search: '?file=' + filePath,
    });
  };

  const clickTag = (tag: string) => {
    setActiveTag(tag);
    setMode(MODES.TAG);
  };

  const saveLeftWidth = (width: number) => {
    saveUserConfig({ leftWidth: width });
  };

  const changeMode = (mode: ModeType) => {
    setMode(mode);
    saveUserConfig({ mode });
  };

  const saveUserConfig = (data: Partial<UserConfig>) => {
    postUserConfig(data);
  };

  const ref = useRef<any>();

  // https://stackoverflow.com/a/62437093
  const handler = useCallback(() => {
    function onMouseMove(e: any) {
      setLeftWidth(e.clientX - ref.current.offsetLeft - 2);
    }
    function onMouseUp(e: any) {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      // 因为 handler 使用了 useCallback 包装，所以直接保存上层传入的 width 值会是一个固
      // 定值，需要手动传入要保存的值
      saveLeftWidth(e.clientX - ref.current.offsetLeft - 2);
    }
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, []);

  const askUserToInputFolderPath = () => {
    setIsModalOpen(true);
    // const path = prompt(
    //   '请输入你的 Markdown 文件所在文件夹的路径\n（如：/Users/me/Desktop/markdown-notes）'
    // );
    // if (path) {
    //   // TODO: 检查路径是否存在
    //   setFolderPath(path);
    //   saveUserConfig({ folderPath: path });
    // }
  };

  useEffect(() => {
    const folderPath = userConfig.folderPath;
    if (!folderPath) return;

    // 如果文件夹地址是默认的，则询问用户输入
    if (folderPath.match(/knowledge-center\/mds$/)) {
      const storageKey = 'lastAskTime';
      const lastAskTime = localStorage.getItem(storageKey);
      const currentTime = new Date().getTime();
      const oneDay = 24 * 60 * 60 * 1000;
      if (!lastAskTime || currentTime - +lastAskTime > oneDay) {
        askUserToInputFolderPath();
        localStorage.setItem(storageKey, currentTime.toString());
      }
    }
  }, [userConfig.folderPath]);

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const [folderPathInput, setFolderPathInput] = useState(''); // TextField 中的输入值
  const onFolderPathChange = (path: string) => {
    setFolderPathInput(path);
  };

  return (
    <Box>
      <ActivityBar changeMode={changeMode} currentMode={mode} />
      {mode !== MODES.CLOUD && (
        <div
          style={{
            display: 'flex',
            marginLeft: 50,
          }}
          ref={ref}
        >
          <SideBar
            width={leftWidth}
            list={list}
            clickFile={clickFile}
            activeFile={fileName}
            setLeftWidth={setLeftWidth}
            saveLeftWidth={saveLeftWidth}
            mode={mode}
            tags={tags}
            activeTag={activeTag}
            clickTag={clickTag}
            fileInfoList={fileInfoList}
            askUserToInputFolderPath={askUserToInputFolderPath}
          />

          <RightBorder onMouseDown={handler}></RightBorder>

          <Content
            content={content}
            fileName={fileName}
            leftWidth={leftWidth}
            clickFile={clickFile}
            clickTag={clickTag}
          />
        </div>
      )}
      {mode === MODES.CLOUD && <TagCloud tags={tags} clickTag={clickTag} />}
      <Toaster />
      {/* <Modal open={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <InputWrapper>
          <p>请输入你的 Markdown 文件所在文件夹的路径</p>
          <p>（如：/Users/me/Desktop/markdown-notes）</p>
          <TextField
            id="outlined-basic"
            label="请输入文件夹路径"
            variant="outlined"
            style={{
              width: '80%',
            }}
            onBlur={(e) => {
              const path = e.target.value;
              if (path) {
                // TODO: 检查路径是否存在
                setFolderPath(path);
                saveUserConfig({ folderPath: path });
              }
            }}
          />
        </InputWrapper>
      </Modal> */}
      <Dialog open={isModalOpen} onClose={closeModal}>
        {/* todo: 这个样式是因为 markdown 的样式污染了这里 */}
        <DialogTitle style={{ borderBottom: 'none' }}>
          输入文件夹路径
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            请输入你的 Markdown 文件所在文件夹的路径
            （如：/Users/me/Desktop/markdown-notes）
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="请输入文件夹路径"
            fullWidth
            variant="standard"
            onChange={(e) => {
              onFolderPathChange(e.target.value);
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal}>取消</Button>
          <Button
            onClick={() => {
              if (folderPathInput) {
                setFolderPath(folderPathInput);
                saveUserConfig({ folderPath: folderPathInput });
                closeModal();
              }
            }}
          >
            确认
          </Button>
        </DialogActions>
      </Dialog>
      )
    </Box>
  );
}

export default App;
