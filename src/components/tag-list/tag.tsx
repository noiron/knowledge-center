import styled from 'styled-components';
import { FaTags, FaReact, FaNodeJs } from 'react-icons/fa';
import { SiLeetcode, SiWebpack, SiJavascript, SiVite } from 'react-icons/si';

const StyledTag = styled.div<{ isActive: boolean }>`
  font-size: 12px;
  padding: 2px 10px;
  display: inline-flex;
  border-radius: 5px;
  background: ${(props) => (props.isActive ? '#ddd' : '#eee')};

  svg {
    margin-right: 5px;
    margin-top: 0.4em;
  }
`;

const TAG_ICONS: { [key: string]: any } = {
  react: <FaReact />,
  leetcode: <SiLeetcode />,
  nodejs: <FaNodeJs />,
  webpack: <SiWebpack />,
  javascript: <SiJavascript />,
  vite: <SiVite />,
};

interface TagProps {
  text: string;
  count: number;
  onClick: (text: string) => void;
  isActive: boolean;
}

const Tag = (props: TagProps) => {
  const { onClick, isActive, count } = props;

  let text = props.text;
  if (text[0] === '#') {
    text = text.slice(1);
  }

  return (
    <StyledTag
      onClick={() => {
        onClick(text);
      }}
      isActive={isActive}
    >
      {TAG_ICONS[text] || <FaTags />}
      {text} x {count}
    </StyledTag>
  );
};

export default Tag;
