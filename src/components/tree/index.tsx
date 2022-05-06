import React, { useEffect, useState } from 'react';
import TreeNode from './tree-node';
import { INode, ITree, OnContextMenu } from '@/types';
import { getRootNodes } from '@/utils';
import styled from 'styled-components';
import { FOLDER_NAME_HEIGHT } from '@/constants';

const StyledTree = styled.div`
  overflow: auto;
  max-height: calc(100vh - ${FOLDER_NAME_HEIGHT}px);
`;

// const data: {
//   [key: string]: INode;
// } = {
//   '/': {
//     path: '/',
//     type: 'folder',
//     isRoot: true,
//     isOpen: true,
//     children: ['/koa.md', '/markdown-it.md', '/todo.md', '/开发.md', '/1'],
//   },
//   '/1': {
//     path: '/1',
//     type: 'folder',
//     children: ['/1/测试.md'],
//   },
//   '/1/测试.md': {
//     path: '/1/测试.md',
//     type: 'file',
//   },
//   '/koa.md': {
//     path: '/koa.md',
//     type: 'file',
//   },
//   '/markdown-it.md': {
//     path: '/markdown-it.md',
//     type: 'file',
//   },
//   '/todo.md': {
//     path: '/todo.md',
//     type: 'file',
//   },
//   '/开发.md': {
//     path: '/开发.md',
//     type: 'file',
//   },
// };

interface IProps {
  onSelect: (path: string) => void;
  list: ITree;
  /** 当前选中的文件 */
  activeFile: string;
  /** 展示右键操作 */
  onContextMenu: OnContextMenu;
}

const Tree = (props: IProps) => {
  const [nodes, setNodes] = useState<ITree>({});

  useEffect(() => {
    setNodes(props.list);
  }, [props.list]);

  const getChildNodes = (node: INode) => {
    if (!node.children) return [];
    return node.children.map((path) => nodes[path]);
  };

  const onToggle = (node: INode) => {
    nodes[node.path].isOpen = !node.isOpen;
    setNodes({ ...nodes });
  };

  const onNodeSelect = (node: INode) => {
    const { onSelect } = props;
    onSelect(node.path);
  };

  const rootNodes = getRootNodes(nodes);
  if (rootNodes[0]) {
    rootNodes[0].isOpen = true;
  }

  return (
    <StyledTree>
      {rootNodes.map((node) => {
        return (
          <TreeNode
            node={node}
            getChildNodes={getChildNodes}
            onToggle={onToggle}
            onNodeSelect={onNodeSelect}
            key={node.path}
            activeFile={props.activeFile}
            onContextMenu={props.onContextMenu}
          />
        );
      })}
    </StyledTree>
  );
};

export default Tree;
