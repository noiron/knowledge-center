export function extractFileName(filePath: string) {
  return filePath.split('/').pop();
}

export function formatTime(time: string) {
  const date = new Date(time);
  return date.toLocaleString();
}
