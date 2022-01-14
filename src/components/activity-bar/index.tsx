import styled from 'styled-components';
import { ACTIVITY_BAR_WIDTH } from '../../configs';
import { FaFile, FaTags, FaSearch, FaCog } from 'react-icons/fa';
import { ModeType } from '../../types';
import { MODES } from '../../constants';

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
    color: #999;
    cursor: pointer;
    &.active {
      color: #333;
    }
  }

  .end {
    margin-top: auto;
    margin-bottom: 15px;
  }
`;

interface BarProps {
  currentMode: ModeType;
  changeMode: (mode: ModeType) => void;
}

const ActivityBar = (props: BarProps) => {
  const { changeMode, currentMode } = props;

  return (
    <StyledBar>
      <FaFile
        onClick={() => changeMode(MODES.FILE)}
        className={currentMode === MODES.FILE ? 'active' : ''}
      />
      <FaTags
        onClick={() => changeMode(MODES.TAG)}
        className={currentMode === MODES.TAG ? 'active' : ''}
      />
      <FaSearch />

      <div className="end">
        <FaCog />
      </div>
    </StyledBar>
  );
};

export default ActivityBar;
