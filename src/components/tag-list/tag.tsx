import styled from 'styled-components';
import { FaTags } from 'react-icons/fa';

const StyledTag = styled.div<{ isActive: boolean }>`
  border: 1px solid #eee;
  padding: 5px 15px;
  display: inline-flex;
  border-radius: 5px;
  background: ${(props) => (props.isActive ? '#ddd' : '#eee')};

  svg {
    margin-right: 5px;
  }
`;

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
      <FaTags></FaTags>
      {text} x {count}
    </StyledTag>
  );
};

export default Tag;
