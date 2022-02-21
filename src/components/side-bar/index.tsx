import { useRef, CSSProperties, useState } from 'react';
import styled from 'styled-components';
import { MODES } from '@/constants';
import { INode, ITags, ModeType } from '@/types';
import {
  getRootNodes,
  openFileInTypora,
  openFileInVSCode,
  openFolderInVSCode,
} from '@/utils';
import TagList from '../tag-list';
import Tree from '../tree';
import FolderName from './folder-name';
import FileList from '../file-list';
import { FileInfo } from '@common/types';
import { ControlledMenu, MenuItem, useMenuState } from '@szhsin/react-menu';
import '@szhsin/react-menu/dist/index.css';

const StyledSideBar = styled.div`
  height: 100%;
  position: relative;
  border-right: 1px solid var(--border-color);
  width: var(--width);
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
  padding: 0 0px;
  flex-shrink: 0;
`;

interface SideBarProps {
  width: number;
  list: { [key: string]: INode };
  /** 当前选中的文件名称 */
  activeFile: string;
  clickFile: (fileName: string) => void;
  setLeftWidth: (width: number) => void;
  saveLeftWidth: (width: number) => void;
  mode: ModeType;
  tags: ITags;
  clickTag: (tag: string) => void;
  activeTag: string;
  fileInfoList: FileInfo[];
  askUserToInputFolderPath: () => void;
}

const SideBar = (props: SideBarProps) => {
  const {
    list,
    activeFile,
    clickFile,
    width,
    mode,
    activeTag,
    clickTag,
    fileInfoList,
    askUserToInputFolderPath,
  } = props;
  const ref = useRef<any>();

  // https://stackoverflow.com/a/62437093
  // const handler = useCallback(() => {
  //   function onMouseMove(e: any) {
  //     props.setLeftWidth(e.clientX - ref.current.offsetLeft);
  //   }
  //   function onMouseUp(e: any) {
  //     document.removeEventListener('mousemove', onMouseMove);
  //     document.removeEventListener('mouseup', onMouseUp);
  //     // 因为 handler 使用了 useCallback 包装，所以直接保存上层传入的 width 值会是一个固
  //     // 定值，需要手动传入要保存的值
  //     props.saveLeftWidth(e.clientX - ref.current.offsetLeft);
  //   }
  //   document.addEventListener('mousemove', onMouseMove);
  //   document.addEventListener('mouseup', onMouseUp);
  // }, []);

  const rootNodes = getRootNodes(list);

  const renderByMode = () => {
    if (mode === MODES.FILE) {
      return <Tree onSelect={clickFile} list={list} activeFile={activeFile} />;
    }

    if (mode === MODES.TAG) {
      return (
        <TagList
          tags={props.tags}
          clickFile={clickFile}
          activeFile={activeFile}
          activeTag={activeTag}
          clickTag={clickTag}
        />
      );
    }

    if (mode === MODES.SEARCH) {
      return (
        <div
          style={{
            textAlign: 'center',
            marginTop: 50,
          }}
        >
          搜索功能开发中
        </div>
      );
    }

    if (mode === MODES.LIST) {
      return (
        <FileList
          fileInfoList={fileInfoList}
          clickFile={clickFile}
          activeFilePath={activeFile}
          onContextMenu={({ filePath, x, y }) => {
            toggleMenu(true);
            setAnchorPoint({ x, y });
            setContextMenuFilePath(filePath);
          }}
        />
      );
    }

    return null;
  };

  const { toggleMenu, ...menuProps } = useMenuState();
  const [anchorPoint, setAnchorPoint] = useState({ x: 0, y: 0 });
  // 当前是在哪个文件上展示了右键菜单
  const [contextMenuFilePath, setContextMenuFilePath] = useState('');

  return (
    <StyledSideBar
      style={{ '--width': width + 'px' } as CSSProperties}
      ref={ref}
    >
      {renderByMode()}

      <FolderName
        name={rootNodes[0]?.path || ''}
        askUserToInputFolderPath={askUserToInputFolderPath}
      />

      <ControlledMenu
        {...menuProps}
        anchorPoint={anchorPoint}
        onClose={() => {
          toggleMenu(false);
          setContextMenuFilePath('');
        }}
      >
        <MenuItem
          onClick={() => {
            openFileInVSCode(contextMenuFilePath);
          }}
        >
          Open File In VSCode
        </MenuItem>
        <MenuItem
          onClick={() => {
            openFolderInVSCode(contextMenuFilePath);
          }}
        >
          Open Folder In VSCode
        </MenuItem>
        <MenuItem
          onClick={() => {
            openFileInTypora(contextMenuFilePath);
          }}
        >
          Open In Typora
        </MenuItem>
      </ControlledMenu>
    </StyledSideBar>
  );
};

export default SideBar;
