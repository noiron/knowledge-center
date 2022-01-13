import { CSSProperties } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { ACTIVITY_BAR_WIDTH } from '../../configs';

const StyledContent = styled.div`
  margin-left: var(--margin-left);
  max-height: 100vh;
  padding: 10px 20px;
  overflow-y: auto;
`;

const Button = styled.div`
  padding: 10px;
  border: 1px solid #eee;
  display: inline-block;
  background: #fff;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  border-radius: 4px;
  position: absolute;
  right: 20px;
  top: 20px;
`;

interface Props {
  content: string;
  leftWidth: number;
  fileName: string;
}

const Content = (props: Props) => {
  const { content, leftWidth, fileName } = props;

  return (
    <StyledContent
      style={
        {
          '--margin-left': leftWidth + 20 + ACTIVITY_BAR_WIDTH + 'px',
        } as CSSProperties
      }
    >
      {fileName && (
        <Button
          onClick={() => {
            axios.post(`/api/run?file=${fileName}`);
          }}
        >
          在 Typora 中打开
        </Button>
      )}
      {content ? (
        <div
          dangerouslySetInnerHTML={{
            __html: content as string,
          }}
        ></div>
      ) : (
        <p>这里没有内容</p>
      )}
    </StyledContent>
  );
};

export default Content;
