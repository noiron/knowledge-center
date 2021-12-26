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
  let paddingLeft = level * 10;
  if (type === 'file') paddingLeft += 10;
  return paddingLeft;
};

const StyledTreeNode = styled.div<{ level: number; type: NodeType }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 5px 8px;
  padding-left: ${(props) => getPaddingLeft(props.level, props.type)}px;
  &:hover {
    background: lightgray;
  }
`;

const NodeIcon = styled.div<{ marginRight?: number }>`
  font-size: 12px;
  margin-right: ${(props) => (props.marginRight ? props.marginRight : 5)}px;
`;

const getNodeLabel = (node: INode) => last(node.path.split('/'));

const TreeNode = (props: any) => {
  const { node, getChildNodes, level, onToggle, onNodeSelect } = props;

  return (
    <>
      <StyledTreeNode level={level} type={node.type}>
        <NodeIcon onClick={() => onToggle(node)}>
          {node.type === 'folder' &&
            (node.isOpen ? <FaChevronDown /> : <FaChevronRight />)}
        </NodeIcon>

        <NodeIcon marginRight={10}>
          {node.type === 'file' && <FaFile />}
          {node.type === 'folder' && node.isOpen === true && <FaFolderOpen />}
          {node.type === 'folder' && !node.isOpen && <FaFolder />}
        </NodeIcon>

        <span role="button" onClick={() => onNodeSelect(node)}>
          {getNodeLabel(node)}
        </span>
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
