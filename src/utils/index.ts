export function extractFileName(filePath: string) {
  return filePath.split('/').pop();
}