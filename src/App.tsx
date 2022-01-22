import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styled from 'styled-components';
import { Toaster } from 'react-hot-toast';
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
            setActiveTag={setActiveTag}
            activeTag={activeTag}
            fileInfoList={fileInfoList}
            setFolderPath={setFolderPath}
          />

          <RightBorder onMouseDown={handler}></RightBorder>

          <Content
            content={content}
            fileName={fileName}
            leftWidth={leftWidth}
            clickFile={clickFile}
          />
        </div>
      )}

      {mode === MODES.CLOUD && (
        <TagCloud
          tags={tags}
          clickTag={(tag) => {
            setActiveTag(tag);
            setMode(MODES.TAG);
          }}
        />
      )}

      <Toaster />
    </Box>
  );
}

export default App;
