import { CSSProperties, useEffect } from 'react';
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
  clickFile: (fileName: string) => void;
}

const Content = (props: Props) => {
  const { content, leftWidth, fileName } = props;

  useEffect(() => {
    if (!content) return;

    const allLinks = document.querySelectorAll('a');
    const relativeLinks = Array.from(allLinks).filter((a) => {
      // 用一个粗暴的方法来找出所有的相对链接
      if (a.href.indexOf('http://localhost:4000') > -1) return true;
      return false;
    });

    relativeLinks.forEach((a) => {
      a.addEventListener('click', (e) => {
        // 阻止默认的跳转，行为改为和点击了文件树种的文件一样
        e.preventDefault();
        const fileName = a.href.split('http://localhost:4000');
        props.clickFile(fileName[1]);
      });
    });
  }, [content]);

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
