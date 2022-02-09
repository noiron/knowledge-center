import styled from 'styled-components';
import { FaTags, FaReact, FaNodeJs } from 'react-icons/fa';
import { SiLeetcode, SiWebpack, SiJavascript, SiVite } from 'react-icons/si';
import { RiTodoLine } from 'react-icons/ri';

const StyledTag = styled.div<{ isActive: boolean }>`
  font-size: 12px;
  padding: 2px 10px;
  display: inline-flex;
  border-radius: 5px;
  background: ${(props) => (props.isActive ? 'var(--active-color)' : '#eee')};
  white-space: nowrap;
  cursor: pointer;
  &:hover {
    background: var(--active-color);
  }
  &:active {
    position: relative;
    top: 1px;
    left: 1px;
    opacity: 0.9;
  }

  svg {
    margin-right: 5px;
    margin-top: 0.4em;
  }
  .count {
    margin-left: 5px;
    padding-left: 8px;
    border-left: 1px solid #ccc;
  }
`;

const TAG_ICONS: { [key: string]: any } = {
  react: <FaReact />,
  leetcode: <SiLeetcode />,
  nodejs: <FaNodeJs />,
  webpack: <SiWebpack />,
  javascript: <SiJavascript />,
  vite: <SiVite />,
  todo: <RiTodoLine />,
};

interface TagProps {
  text: string;
  count: number;
  onClick: (text: string) => void;
  isActive: boolean;
}

const Tag = (props: TagProps) => {
  const { onClick, isActive, count, text } = props;

  return (
    <StyledTag
      onClick={() => {
        onClick(text);
      }}
      isActive={isActive}
    >
      {TAG_ICONS[text] || <FaTags />}
      {text}
      <span className="count">{count}</span>
    </StyledTag>
  );
};

export default Tag;
