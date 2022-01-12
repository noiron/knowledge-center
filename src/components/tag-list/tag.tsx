import styled from 'styled-components';
import axios from 'axios';
import { FaTags } from 'react-icons/fa';

const StyledTag = styled.div`
  border: 1px solid #eee;
  padding: 5px 15px;
  display: inline-flex;
  border-radius: 5px;
  background: #eee;

  svg {
    margin-right: 5px;
  }
`;

interface TagProps {
  text: string;
  onClick: (text: string) => void;
}

const Tag = (props: TagProps) => {
  let text = props.text;
  if (text[0] === '#') {
    text = text.slice(1);
  }

  return (
    <StyledTag
      onClick={() => {
        props.onClick(text);
      }}
    >
      <FaTags></FaTags>
      {text}
    </StyledTag>
  );
};

export default Tag;
