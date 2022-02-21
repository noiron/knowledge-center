import styled from 'styled-components';
import { FileInfo } from '@common/types';
import { extractFileName, formatTime } from '@/utils';
import { OnContextMenu } from '@/types';

const StyledFileList = styled.div`
  overflow-y: auto;
  height: calc(100vh - 50px);
`;

const FileItem = styled.div`
  padding: 3px 0 3px 15px;
  border-bottom: 1px dashed #eee;
  font-size: 14px;
  cursor: pointer;
  p {
    margin: 0px;
  }
  p.time {
    font-size: 10px;
    color: #999;
  }
  &.active {
    background-color: var(--active-color);
  }
`;

interface Props {
  fileInfoList: FileInfo[];
  clickFile: (filePath: string) => void;
  activeFilePath: string;
  /** 展示右键操作 */
  onContextMenu: OnContextMenu;
}

const FileList = (props: Props) => {
  const { fileInfoList, clickFile, onContextMenu } = props;
  fileInfoList.sort((a, b) => {
    return (
      new Date(b.lastModifiedTime).getTime() -
      new Date(a.lastModifiedTime).getTime()
    );
  });

  return (
    <StyledFileList>
      {fileInfoList.map((item) => {
        return (
          <FileItem
            key={item.path}
            onClick={() => clickFile(item.path)}
            className={item.path === props.activeFilePath ? 'active' : ''}
            onContextMenu={(e) => {
              e.preventDefault();
              onContextMenu({
                filePath: item.path,
                x: e.clientX,
                y: e.clientY,
              });
            }}
          >
            <p>{extractFileName(item.path)}</p>
            <p className="time">Edit: {formatTime(item.lastModifiedTime)}</p>
          </FileItem>
        );
      })}
    </StyledFileList>
  );
};

export default FileList;
