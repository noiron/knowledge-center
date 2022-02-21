import {
  FaFile,
  FaFolder,
  FaFolderOpen,
  FaChevronDown,
  FaChevronRight,
} from 'react-icons/fa';
import styled from 'styled-components';
import last from 'lodash/last';
import { INode, NodeType, OnContextMenu } from '@/types';

const getPaddingLeft = (level: number, type: NodeType) => {
  let paddingLeft = level * 10 + 8;
  if (type === 'file') paddingLeft += 10;
  return paddingLeft;
};

const StyledTreeNode = styled.div<{ level: number; type: NodeType }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 5px 8px;
  padding-left: ${(props) => getPaddingLeft(props.level, props.type)}px;
  cursor: pointer;
  font-size: 14px;
  &:hover {
    background: #fafafa;
  }
  &.active {
    border-left: 2px solid #000;
    background: var(--active-color);
  }

  span[role='button'] {
    white-space: nowrap;
    line-height: 1.5;
  }
`;

const NodeIcon = styled.div<{ marginRight?: number }>`
  font-size: 12px;
  margin-right: ${(props) => (props.marginRight ? props.marginRight : 5)}px;
`;

const getNodeLabel = (node: INode) => last(node.path.split('/'));

interface TreeNodeProps {
  node: INode;
  level: number;
  activeFile: string;
  getChildNodes: (node: INode) => INode[];
  onToggle: (node: INode) => void;
  onNodeSelect: (node: INode) => void;
  /** 展示右键操作 */
  onContextMenu: OnContextMenu;
}

const TreeNode = (props: TreeNodeProps) => {
  const { node, getChildNodes, level, onToggle, onNodeSelect, activeFile } =
    props;

  // 不展示空文件夹
  if (node.type === 'folder' && node.children?.length === 0) return null;

  const handleClick = (node: INode) => {
    if (node.type === 'file') {
      onNodeSelect(node);
    } else {
      onToggle(node);
    }
  };

  const renderIcon = () => {
    return (
      <>
        <NodeIcon>
          {node.type === 'folder' &&
            (node.isOpen ? <FaChevronDown /> : <FaChevronRight />)}
        </NodeIcon>

        <NodeIcon marginRight={10}>
          {node.type === 'file' && <FaFile />}
          {node.type === 'folder' &&
            (node.isOpen ? <FaFolderOpen /> : <FaFolder />)}
        </NodeIcon>
      </>
    );
  };

  return (
    <>
      <StyledTreeNode
        level={level}
        type={node.type}
        onClick={() => {
          handleClick(node);
        }}
        className={activeFile === node.path ? 'active' : ''}
        onContextMenu={(e) => {
          e.preventDefault();
          // TODO: 对于文件夹节点和文件节点应该显示不同的操作
          props.onContextMenu({
            filePath: node.isRoot ? '' : node.path,
            x: e.clientX,
            y: e.clientY,
          });
        }}
      >
        {renderIcon()}
        <span role="button">{getNodeLabel(node)}</span>
      </StyledTreeNode>

      {node.isOpen &&
        getChildNodes(node).map((childNode: INode) => (
          <TreeNode
            {...props}
            node={childNode}
            level={level + 1}
            key={childNode.path}
          />
        ))}
    </>
  );
};

TreeNode.defaultProps = {
  level: 0,
};

export default TreeNode;
