/**
 * 展示及编辑文件夹名称
 */
import styled from 'styled-components';

const Box = styled.div`
  width: 100%;
  height: 50px;
  box-sizing: border-box;
  border-top: 4px solid var(--border-color);
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  cursor: pointer;
`;

interface Props {
  name: string;
  askUserToInputFolderPath: () => void;
}

const FolderName = (props: Props) => {
  const { name, askUserToInputFolderPath } = props;

  return (
    <Box onClick={askUserToInputFolderPath} className="folder-name">
      {name}
    </Box>
  );
};

export default FolderName;
