import styled from 'styled-components';
import { ACTIVITY_BAR_WIDTH } from '../../configs';
import { FaFile, FaTags, FaSearch, FaCog } from 'react-icons/fa';
import { ModeType } from '../../types';

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
    cursor: pointer;
  }

  .end {
    margin-top: auto;
    margin-bottom: 15px;
  }
`;

interface BarProps {
  changeMode: (mode: ModeType) => void;
}

const ActivityBar = (props: BarProps) => {
  const { changeMode } = props;

  return (
    <StyledBar>
      <FaFile onClick={() => changeMode('file')} />
      <FaTags onClick={() => changeMode('tag')} />
      <FaSearch />

      <div className="end">
        <FaCog />
      </div>
    </StyledBar>
  );
};

export default ActivityBar;
