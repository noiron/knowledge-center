import { CSSProperties, useEffect } from 'react';
import styled from 'styled-components';
import { ACTIVITY_BAR_WIDTH } from '@/configs';
import { purifyTag } from 'kainotes-tools';
import md from './md';

const StyledContent = styled.div`
  max-height: 100vh;
  padding: 10px 50px 50px;
  overflow-y: auto;
  flex-grow: 1;
  box-sizing: border-box;
`;

interface Props {
  content: string;
  leftWidth: number;
  fileName: string;
  clickFile: (fileName: string) => void;
  clickTag: (tag: string) => void;
}

const Content = (props: Props) => {
  const { content: rawContent, leftWidth, fileName, clickTag } = props;
  const content = md.render(rawContent || '');
  const origin = location.origin; // 一般是 http://localhost:4000

  useEffect(() => {
    if (!content) return;

    const allLinks = document.querySelectorAll('a');
    const relativeLinks = Array.from(allLinks).filter((link) => {
      return link.href.startsWith(origin);
    });

    relativeLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        // 阻止默认的跳转，行为改为和点击了文件树中的文件一样
        e.preventDefault();
        const fileName = link.href.split(origin)[1];
        props.clickFile(fileName);
      });
    });
  }, [content]);

  // 由 markdown 转换来的图片如果引用的是相对路径
  // 比如根目录下的 1/2/3.md，引用了一张同级目录下的一张图片，<img src="assets/3.png" />
  // 读取 img.src 属性，其值和当前页面的 url 是相关的
  // 如果是 http://localhost:4000，那么 img.src 就是 http://localhost:4000/assets/3.png
  // 如果是 http://localhost:4000/1/2，那么 img.src 就是 http://localhost:4000/1/2/assets/3.png
  // 只有后一张情况才能正常访问图片，所以需要把 img 标签中的 src 替换为以 http:// 开头的绝对路径
  useEffect(() => {
    if (!content) return;

    const allImages = document.querySelectorAll('img');
    Array.from(allImages).forEach((img) => {
      // 网络图片不做处理
      if (!img.src.startsWith(origin)) return;

      const outerHTML = img.outerHTML;
      const matches = outerHTML.match(/src="(.+?)"/); // 问号表示非贪婪模式
      if (!matches) return;

      const src = matches[1];
      const paths = fileName.split('/');
      paths.pop();

      const completeSrc = ['http://localhost:4001', ...paths, src].join('/');
      // const completeSrc = [origin, ...paths, src].join('/');
      img.outerHTML = outerHTML.replace(src, completeSrc);
    });
  }, [content]);

  useEffect(() => {
    if (!content) return;
    document.querySelectorAll('span.tag').forEach((tag) => {
      tag.addEventListener('click', () => {
        clickTag(purifyTag(tag.innerHTML));
      });
    });
  }, [content]);

  return (
    <StyledContent
      className="content"
      style={
        {
          '--margin-left': leftWidth + 20 + ACTIVITY_BAR_WIDTH + 'px',
        } as CSSProperties
      }
    >
      {fileName && content ? (
        <div
          dangerouslySetInnerHTML={{
            __html: content as string,
          }}
        ></div>
      ) : (
        <p>
          <img
            src={
              'http://c.tenor.com/Fml1EdnqjfwAAAAi/%E4%BD%95%E3%82%82%E3%81%AA%E3%81%84-%E3%82%BC%E3%83%AD.gif'
            }
          />
        </p>
      )}
    </StyledContent>
  );
};

export default Content;
