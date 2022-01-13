import { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Tag from './tag';

const StyledFileItem = styled.div<{ isActive: boolean }>`
  padding: 10px;
  background: ${(props) => (props.isActive ? '#ccc' : '#eee')};
`;

interface Props {
  /** 所有的标签的列表 */
  tags: string[];
  clickFile: (fileName: string) => void;
}

const TagList = (props: Props) => {
  const { tags } = props;
  const [activeTag, setActiveTag] = useState('');
  const [fileList, setFileList] = useState(['1/测试.md']);

  /**
   * 获取特定标签对应的文件列表
   */
  const getTag = (text: string) => {
    axios.get(`/api/tag/${text}`).then((res) => {
      setFileList(res.data.data);
    });
  };

  return (
    <div>
      <div>
        {tags.map((tag: string) => {
          return (
            <div
              style={{
                padding: '0px 20px',
                margin: '10px 0',
              }}
              key={tag}
            >
              <Tag
                text={tag}
                isActive={activeTag === tag}
                onClick={(text) => {
                  getTag(text);
                  setActiveTag(text);
                }}
              />
            </div>
          );
        })}
      </div>
      <div
        style={{
          borderTop: '4px solid #eee',
          padding: '20px',
        }}
      >
        <p>这里是包含选中标签的文件列表</p>
        {fileList.map((file: string) => {
          return (
            <StyledFileItem
              key={file}
              isActive={false}
              onClick={() => {
                props.clickFile(file);
              }}
            >
              {file}
            </StyledFileItem>
          );
        })}
      </div>
    </div>
  );
};

export default TagList;
