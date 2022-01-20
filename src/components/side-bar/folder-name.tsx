/**
 * 展示及编辑文件夹名称
 */
import styled from 'styled-components';

const Box = styled.div`
  width: 100%;
  height: 50px;
  border-top: 4px solid #eee;
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
}

const FolderName = (props: Props) => {
  const { name } = props;

  return (
    <div>
      {/* TODO: 加入点击事件 */}
      <Box>{name}</Box>
    </div>
  );
};

export default FolderName;
