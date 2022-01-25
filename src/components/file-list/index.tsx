import styled from 'styled-components';
import { FileInfo } from '@/types';
import { extractFileName, formatTime } from '@/utils';

const StyledFileList = styled.div`
  overflow-y: auto;
  height: calc(100vh - 50px);
`;

const FileItem = styled.div`
  padding-left: 15px;
  border-bottom: 1px dashed #eee;
  font-size: 14px;
  cursor: pointer;
  p {
    margin: 5px;
  }
  p.time {
    font-size: 12px;
    color: #999;
  }
`;

interface Props {
  fileInfoList: FileInfo[];
  clickFile: (filePath: string) => void;
}

const FileList = (props: Props) => {
  const { fileInfoList, clickFile } = props;
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
          <FileItem key={item.path} onClick={() => clickFile(item.path)}>
            <p>{extractFileName(item.path)}</p>
            <p className="time">{formatTime(item.lastModifiedTime)}</p>
          </FileItem>
        );
      })}
    </StyledFileList>
  );
};

export default FileList;
