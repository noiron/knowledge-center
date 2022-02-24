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

const styleFiles1 = ['../../styles/my.less'];
const styleFiles2 = ['../../styles/bear.css', '../../styles/second.css'];

const Setting = (props: SettingProps) => {
  const { isOpen, onClose } = props;
  const anchor = 'right';

  return (
    <Drawer anchor={anchor} open={isOpen} onClose={onClose}>
      <StyledSetting>
        在这里配置选项
        <div>
          <button
            onClick={() => {
              styleFiles1.forEach((file) => {
                import(file);
              });
            }}
          >
            使用样式1
          </button>
        </div>
        <div>
          <button
            onClick={() => {
              styleFiles2.forEach((file) => {
                import(file);
              });
            }}
          >
            使用样式2
          </button>
        </div>
        <div>
          <button
            onClick={() => {
              ['../../styles/3.css'].forEach((file) => {
                import(file);
              });
            }}
          >
            使用样式3
          </button>
        </div>
      </StyledSetting>
    </Drawer>
  );
};

export default Setting;
