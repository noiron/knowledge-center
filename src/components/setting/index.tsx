/**
 * 项目的设置，首先提供样式的配置
 */
import styled from 'styled-components';
import Drawer from '@mui/material/Drawer';
// import Box from '@mui/material/Box';

const StyledSetting = styled.div`
  padding: 20px;
  width: 250px;
  background: #fff;
  box-sizing: border-box;
  text-align: center;
`; 

interface SettingProps {
  isOpen: boolean;
  onClose: () => void;
}

const Setting = (props: SettingProps) => {
  const { isOpen, onClose } = props;
  const anchor = 'right';

  // TODO: 读取可选的样式文件供选择

  return (
    <Drawer
      anchor={anchor}
      open={isOpen}
      onClose={onClose}
    >
      <StyledSetting>
        在这里配置选项
      </StyledSetting>
    </Drawer>
  );
};

export default Setting;
