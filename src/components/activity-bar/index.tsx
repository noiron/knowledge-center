import React from 'react';
import styled from 'styled-components';
import { ACTIVITY_BAR_WIDTH } from '@/configs';
import {
  FaFile,
  FaTags,
  FaSearch,
  FaCog,
  FaCloud,
  FaList,
  FaGitAlt,
} from 'react-icons/fa';
import { Modal } from '@mui/material';
import { ModeType } from '@/types';
import { MODES } from '@/constants';
import { getGitStatus } from '@/api';
import GitInfo from '../git-info';

const StyledBar = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: ${ACTIVITY_BAR_WIDTH}px;
  height: 100vh;
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
    display: flex;
    flex-direction: column;
    align-items: center;
  }
`;

interface BarProps {
  currentMode: ModeType;
  changeMode: (mode: ModeType) => void;
}

const ActivityBar = (props: BarProps) => {
  const { changeMode, currentMode } = props;
  const [gitStatus, setGitStatus] = React.useState<string | null>(null);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const list = [
    {
      mode: MODES.FILE,
      icon: FaFile,
    },
    {
      mode: MODES.TAG,
      icon: FaTags,
    },
    {
      mode: MODES.CLOUD,
      icon: FaCloud,
    },
    {
      mode: MODES.LIST,
      icon: FaList,
    },
    {
      mode: MODES.SEARCH,
      icon: FaSearch,
    },
  ];

  return (
    <>
      <StyledBar>
        {list.map((item) => {
          const Icon = item.icon;
          return (
            <Icon
              key={item.mode}
              onClick={() => changeMode(item.mode)}
              className={currentMode === item.mode ? 'active' : ''}
            />
          );
        })}

        <div className="end">
          <FaGitAlt
            onClick={() => {
              getGitStatus().then((res) => {
                console.log(res.data.data);
                setGitStatus(res.data.data);
              });
              handleOpen();
            }}
          />
          <FaCog />
        </div>
      </StyledBar>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div>
          <GitInfo gitStatus={gitStatus || ''} />
        </div>
      </Modal>
    </>
  );
};

export default ActivityBar;
