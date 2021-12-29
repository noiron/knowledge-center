import { useCallback, useRef, CSSProperties } from 'react';
import styled from 'styled-components';
import { ACTIVITY_BAR_WIDTH } from '../configs';
import Tree from './tree';

const BORDER_WIDTH = 4;

const StyledFileList = styled.div`
  position: absolute;
  top: 0;
  left: ${ACTIVITY_BAR_WIDTH}px;
  border-right: 1px solid #eee;
  width: var(--width);
  height: 100%;
  padding: 0 0px;
`;

const RightBorder = styled.div`
  background-color: #eee;
  position: absolute;
  top: 0;
  right: -${BORDER_WIDTH}px;
  width: ${BORDER_WIDTH}px;
  height: 100%;
  cursor: col-resize;
`;

const StyledFileItem = styled.div<{ isActive: boolean }>`
  padding: 10px;
  background: ${(props) => (props.isActive ? '#eee' : null)};
`;

interface FileListProps {
  width: number;
  list: string[];
  /** 当前选中的文件名称 */
  activeFile: string;
  clickFile: (fileName: string) => void;
  setLeftWidth: (width: number) => void;
  saveLeftWidth: (width: number) => void;
}

const FileList = (props: FileListProps) => {
  const { list, activeFile, clickFile, width } = props;
  const ref = useRef<any>();

  // https://stackoverflow.com/a/62437093
  const handler = useCallback(() => {
    function onMouseMove(e: any) {
      props.setLeftWidth(e.clientX - ref.current.offsetLeft);
    }
    function onMouseUp(e: any) {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      // 因为 handler 使用了 useCallback 包装，所以直接保存上层传入的 width 值会是一个固
      // 定值，需要手动传入要保存的值
      props.saveLeftWidth(e.clientX - ref.current.offsetLeft);
    }
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, []);

  return (
    <StyledFileList
      style={{ '--width': width + 'px' } as CSSProperties}
      ref={ref}
    >
      {/* <div>
        {list.map((fileName) => {
          return (
            <StyledFileItem
              onClick={() => clickFile(fileName)}
              key={fileName}
              isActive={activeFile === fileName}
            >
              {fileName}
            </StyledFileItem>
          );
        })}
      </div> */}

      <Tree onSelect={clickFile} list={list} activeFile={activeFile} />

      <RightBorder onMouseDown={handler} ref={ref}></RightBorder>
    </StyledFileList>
  );
};

export default FileList;
