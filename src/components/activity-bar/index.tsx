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
    &.active {
      color: red;
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
        onClick={() => changeMode('file')}
        className={currentMode === 'file' ? 'active' : ''}
      />
      <FaTags
        onClick={() => changeMode('tag')}
        className={currentMode === 'tag' ? 'active' : ''}
      />
      <FaSearch />

      <div className="end">
        <FaCog />
      </div>
    </StyledBar>
  );
};

export default ActivityBar;
