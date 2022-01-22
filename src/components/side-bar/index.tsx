import { useRef, CSSProperties } from 'react';
import styled from 'styled-components';
import { MODES } from '@/constants';
import { FileInfo, ITags, ModeType } from '@/types';
import TagList from '../tag-list';
import Tree, { INode } from '../tree';
import FolderName from './folder-name';
import FileList from '../file-list';
import values from 'lodash/values';


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
  setActiveTag: (tag: string) => void;
  activeTag: string;
  fileInfoList: FileInfo[];
  setFolderPath: (path: string) => void;
}

const SideBar = (props: SideBarProps) => {
  const {
    list,
    activeFile,
    clickFile,
    width,
    mode,
    setActiveTag,
    activeTag,
    fileInfoList,
    setFolderPath,
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

  // FIXME: 这个函数和 Tree 组件中的是重复的
  const getRootNodes = () => {
    return values(list).filter((node) => node.isRoot === true);
  };

  const rootNodes = getRootNodes();

  return (
    <StyledSideBar
      style={{ '--width': width + 'px' } as CSSProperties}
      ref={ref}
    >
      {mode === MODES.FILE && (
        <Tree onSelect={clickFile} list={list} activeFile={activeFile} />
      )}

      {mode === MODES.TAG && (
        <div>
          <TagList
            tags={props.tags}
            clickFile={clickFile}
            activeFile={activeFile}
            setActiveTag={setActiveTag}
            activeTag={activeTag}
          />
        </div>
      )}

      {mode === MODES.SEARCH && (
        <div
          style={{
            textAlign: 'center',
            marginTop: 50,
          }}
        >
          搜索功能开发中
        </div>
      )}

      {mode === MODES.LIST && (
        <FileList fileInfoList={fileInfoList} clickFile={clickFile} />
      )}

      <FolderName name={rootNodes[0]?.path || ''}
        setFolderPath={setFolderPath}
      />
    </StyledSideBar>
  );
};

export default SideBar;
