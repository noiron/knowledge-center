import styled from "styled-components";
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
}

const Tag = (props: TagProps) => {

  let text = props.text;
  if (text[0] === '#') {
    text = text.slice(1);
  }

  return (
    <StyledTag>
      <FaTags></FaTags>{text}
    </StyledTag>
  );
}

export default Tag;
