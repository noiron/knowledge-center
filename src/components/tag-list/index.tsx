import { useState, useEffect } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import Tag from './tag';
import { ITags } from '@/types';
import { extractFileName } from '@/utils';

const StyledFileItem = styled.div<{ isActive: boolean }>`
  padding: 6px 18px;
  font-size: 12px;
  cursor: pointer;
  background: ${(props) =>
    props.isActive ? 'var(--active-color)' : 'transparent'};
  border-bottom: 1px dashed #eee;
  /* &:not(:last-child) {
    border-bottom: 1px solid var(--border-color);
  } */
`;

const TagsBox = styled.div`
  padding-top: 10px;
  max-height: 60vh;
  overflow: auto;
  .wrapper {
    padding: 0px 20px;
    margin: 0.2em 0;
  }
`;

const ListBox = styled.div`
  border-top: 4px solid #eee;
  padding: 5px 0;
`;

interface Props {
  /** 所有的标签数量的列表 */
  tags: ITags;
  activeFile: string;
  clickFile: (fileName: string) => void;
  activeTag: string;
  clickTag: (tag: string) => void;
}

const TagList = (props: Props) => {
  const { tags, activeFile, activeTag, clickFile, clickTag } = props;
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
  }, [activeTag]);

  // 切换标签后自动选中第一个文件
  useEffect(() => {
    if (fileList.length > 0 && fileList.indexOf(activeFile) === -1) {
      clickFile(fileList[0]);
    }
  }, [fileList]);

  const allTags = Object.keys(tags);
  // 将标签按数量从多到少排序
  allTags.sort((tag1, tag2) => tags[tag2] - tags[tag1]);

  return (
    <div>
      <TagsBox>
        {allTags.map((tag: string) => {
          return (
            <div className="wrapper" key={tag}>
              <Tag
                text={tag}
                isActive={activeTag === tag}
                onClick={(tag) => {
                  clickTag(tag);
                }}
                count={tags[tag]}
              />
            </div>
          );
        })}
      </TagsBox>

      <ListBox>
        {fileList.map((filePath: string) => {
          const fileName = extractFileName(filePath);
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
      </ListBox>
    </div>
  );
};

export default TagList;
