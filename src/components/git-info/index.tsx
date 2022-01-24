/**
 * 展示 Git 信息
 */
import styled from 'styled-components';

const Box = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  box-shadow: 24px;
  border-radius: 4px;

  pre {
    padding: 10px;
    margin: 0;
  }
`;

interface Props {
  gitStatus: string;
}

const GitInfo = (props: Props) => {
  return (
    <Box>
      <Box>
        <pre>{props.gitStatus}</pre>
      </Box>
    </Box>
  );
};

export default GitInfo;
