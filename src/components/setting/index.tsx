/**
 * 项目的设置，首先提供样式的配置
 */
import styled from 'styled-components';
import Drawer from '@mui/material/Drawer';
import { extractFileName } from '@/utils';
import { useEffect, useState } from 'react';
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

const Button = styled.div`
  margin: 5px;
  padding: 10px;
  border: 1px solid var(--border-color);
  display: inline-block;
  background: #fff;
  font-size: 12px;
  font-weight: bold;
  cursor: pointer;
  border-radius: 4px;
  box-shadow: var(--border-color) 1px 1px 0px 0px;
`;

// TODO: 从接口获取可选的样式文件
const defaultStyles = ['../../styles/default.less'];

/**
 * 一个加载样式的函数，做两件事：
 * 1. 加载样式
 * 2. 将一个 class 名称加到 html 节点上
 *
 * 假设有一个新的样式文件 special.less，则文件内容中的样式需要用 `.special {}` 包裹
 */
function loadStyle(styleFilePath: string) {
  // import(styleFilePath);
  const fileName = extractFileName(styleFilePath);
  // todo: 换个正则
  const className = fileName?.split('.')[0] || '';
  const html = document.querySelector('html');
  if (html) {
    html.classList.add(className);
  }
}

const Setting = (props: SettingProps) => {
  const { isOpen, onClose } = props;
  const anchor = 'right';
  const [currentStyleFile, setCurrentStyleFile] = useState(defaultStyles);

  useEffect(() => {
    const html = document.querySelector('html');
    if (html) {
      html.classList.remove(...html.classList);
    }

    currentStyleFile.forEach((styleFile) => {
      loadStyle(styleFile);
    });
  }, [currentStyleFile]);

  return (
    <Drawer anchor={anchor} open={isOpen} onClose={onClose}>
      <StyledSetting>
        <Button
          onClick={() => {
            setCurrentStyleFile(defaultStyles);
          }}
        >
          默认样式
        </Button>
        <Button
          onClick={() => {
            setCurrentStyleFile(['../../styles/second.less']);
          }}
        >
          测试样式：设置引用样式
        </Button>
        <Button
          onClick={() => {
            setCurrentStyleFile(['../../styles/style3.less']);
          }}
        >
          测试样式：边框设为红色
        </Button>
      </StyledSetting>
    </Drawer>
  );
};

export default Setting;
