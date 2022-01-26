export interface FileInfo {
  /** 文件在文件系统中的绝对路径 */
  absolutePath?: string;
  /** 文件相对于根目录的相对路径 */
  path: string;
  lastModifiedTime: string;
}
