import { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Tag from './tag';
import { ITags } from '@/types';

const StyledFileItem = styled.div<{ isActive: boolean }>`
  padding: 8px 20px;
  font-size: 14px;
  cursor: pointer;
  background: ${(props) => (props.isActive ? '#ddd' : '#eee')};
  &:not(:last-child) {
    border-bottom: 1px solid #ddd;
  }
`;

interface Props {
  /** 所有的标签数量的列表 */
  tags: ITags;
  activeFile: string;
  clickFile: (fileName: string) => void;
  activeTag: string;
  setActiveTag: (tag: string) => void;
}

const TagList = (props: Props) => {
  const { tags, activeFile, setActiveTag, activeTag, clickFile } = props;
  const [fileList, setFileList] = useState<string[]>([]);

  /**
   * 获取特定标签对应的文件列表
   */
  const getTag = (text: string) => {
    axios.get(`/api/tag/${text}`).then((res) => {
      setFileList(res.data.data);
    });
  };

  useEffect(() => {
    if (!activeTag) return;
    getTag(activeTag);
  }, [activeFile]);

  // 切换标签后自动选中第一个文件
  useEffect(() => {
    if (fileList.length > 0 && fileList.indexOf(activeFile) === -1) {
      clickFile(fileList[0]);
    }
  }, [fileList]);

  return (
    <div>
      <div>
        {Object.keys(tags).map((tag: string) => {
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
                count={tags[tag]}
              />
            </div>
          );
        })}
      </div>
      <div
        style={{
          borderTop: '4px solid #eee',
          padding: '20px 0',
        }}
      >
        {fileList.map((filePath: string) => {
          const arr = filePath.trim().split('/');
          const fileName = arr.pop();

          return (
            <StyledFileItem
              key={filePath}
              isActive={activeFile === filePath}
              onClick={() => {
                clickFile(filePath);
              }}
              title={filePath}
            >
              {fileName}
            </StyledFileItem>
          );
        })}
      </div>
    </div>
  );
};

export default TagList;
