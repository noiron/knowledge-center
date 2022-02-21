import { MODES } from '../constants';

export type ModeType = keyof typeof MODES;

export interface ITags {
  [key: string]: number;
}

export type NodeType = 'folder' | 'file';

/** 文件树中的节点类型 */
export interface INode {
  path: string;
  type: NodeType;
  isRoot?: boolean;
  children?: string[];
  content?: string;
  isOpen?: boolean;
}

/** 文件树类型 */
export interface ITree {
  [key: string]: INode;
}

/** 在文件上右键点击的事件处理函数 */
export type OnContextMenu = ({
  filePath,
  x,
  y,
}: {
  filePath: string;
  x: number;
  y: number;
}) => void;
