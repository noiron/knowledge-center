import styled from 'styled-components';

const StyledFileList = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  border-right: 1px solid #eee;
  width: 200px;
  height: 100%;
  padding: 0 0px;
`;

const StyledFileItem = styled.div<{ isActive: boolean }>`
  padding: 10px;
  background: ${(props) => (props.isActive ? '#eee' : null)};
`;

interface FileListProps {
  list: string[];
  /** 当前选中的文件名称 */
  activeFile: string;
  clickFile: (fileName: string) => void;
}

const FileList = (props: FileListProps) => {
  const { list, activeFile, clickFile } = props;

  return (
    <StyledFileList>
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
    </StyledFileList>
  );
};

export default FileList;
