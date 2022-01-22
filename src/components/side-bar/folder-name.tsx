/**
 * 展示及编辑文件夹名称
 */
import { postUserConfig } from '@/api';
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
`;

interface Props {
  name: string;
  setFolderPath: (path: string) => void;
}

const FolderName = (props: Props) => {
  const { name } = props;

  const inputFolderPath = () => {
    const path = prompt('请输入一个新的文件夹地址：');
    if (path) {
      postUserConfig({ folderPath: path });
      props.setFolderPath(path);
    }
  };

  return <Box onClick={inputFolderPath} className='folder-name'>{name}</Box>;
};

export default FolderName;
