import {
  FaFile,
  FaFolder,
  FaFolderOpen,
  FaChevronDown,
  FaChevronRight,
} from 'react-icons/fa';
import styled from 'styled-components';
import last from 'lodash/last';
import { INode, NodeType } from '.';

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
  &:hover {
    background: #fafafa;
  }
  &.active {
    border-left: 2px solid #000;
    background: #eee;
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
}

const TreeNode = (props: TreeNodeProps) => {
  const { node, getChildNodes, level, onToggle, onNodeSelect, activeFile } =
    props;

  return (
    <>
      <StyledTreeNode
        level={level}
        type={node.type}
        onClick={() => {
          if (node.type === 'file') {
            onNodeSelect(node);
          } else {
            onToggle(node);
          }
        }}
        className={activeFile === node.path ? 'active' : ''}
      >
        <NodeIcon>
          {node.type === 'folder' &&
            (node.isOpen ? <FaChevronDown /> : <FaChevronRight />)}
        </NodeIcon>

        <NodeIcon marginRight={10}>
          {node.type === 'file' && <FaFile />}
          {node.type === 'folder' &&
            (node.isOpen ? <FaFolderOpen /> : <FaFolder />)}
        </NodeIcon>

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
