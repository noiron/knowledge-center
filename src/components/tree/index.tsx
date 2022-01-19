import React, { useEffect, useState } from 'react';
import values from 'lodash/values';
import TreeNode from './tree-node';

export type NodeType = 'folder' | 'file';

export interface INode {
  path: string;
  type: NodeType;
  isRoot?: boolean;
  children?: string[];
  content?: string;
  isOpen?: boolean;
}

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
  list: { [key: string]: INode };
  /** 当前选中的文件 */
  activeFile: string;
}

const Tree = (props: IProps) => {
  const [nodes, setNodes] = useState<{ [key: string]: INode }>({});

  useEffect(() => {
    setNodes(props.list);
  }, [props.list]);

  const getRootNodes = () => {
    return values(nodes).filter((node) => node.isRoot === true);
  };

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

  const rootNodes = getRootNodes();
  if (rootNodes[0]) {
    rootNodes[0].isOpen = true;
  }

  return (
    <div>
      {rootNodes.map((node) => {
        return (
          <TreeNode
            node={node}
            getChildNodes={getChildNodes}
            onToggle={onToggle}
            onNodeSelect={onNodeSelect}
            key={node.path}
            activeFile={props.activeFile}
          />
        );
      })}
    </div>
  );
};

export default Tree;
