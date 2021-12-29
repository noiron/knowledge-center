import styled from 'styled-components';
import { ACTIVITY_BAR_WIDTH } from '../../configs';
import { FaFile, FaTags, FaSearch, FaCog } from 'react-icons/fa';

const StyledBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: ${ACTIVITY_BAR_WIDTH}px;
  height: 100vh;
  border: 1px solid #eee;
  background: #eee;
  display: flex;
  flex-direction: column;
  align-items: center;

  svg {
    font-size: 25px;
    margin: 0.5em 0;
    color: #666;
  }

  .end {
    margin-top: auto;
    margin-bottom: 15px;
  }
`;

const ActivityBar = () => {
  return (
    <StyledBar>
      <FaFile />
      <FaTags />
      <FaSearch />

      <div className="end">
        <FaCog />
      </div>
    </StyledBar>
  );
};

export default ActivityBar;
