import { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

// const InputWrapper = styled.div`
//   position: absolute;
//   top: 40%;
//   left: 50%;
//   transform: translate(-50%, -50%);
//   width: 600px;
//   box-shadow: 24px;
//   border-radius: 4px;
//   background: #fff;
//   padding: 20px 30px 40px;
// `;

interface DialogProps {
  isModalOpen: boolean;
  closeModal: () => void;
  setFolderPath: (path: string) => void;
}

const FolderPathDialog = (props: DialogProps) => {
  const { isModalOpen, closeModal, setFolderPath } = props;

  const [folderPathInput, setFolderPathInput] = useState(''); // TextField 中的输入值
  const onFolderPathChange = (path: string) => {
    setFolderPathInput(path);
  };

  return (
    <Dialog open={isModalOpen} onClose={closeModal}>
      {/* todo: 这个样式是因为 markdown 的样式污染了这里 */}
      <DialogTitle style={{ borderBottom: 'none' }}>输入文件夹路径</DialogTitle>
      <DialogContent>
        <DialogContentText>
          请输入你的 Markdown 文件所在文件夹的路径
          （如：/Users/me/Desktop/markdown-notes）
        </DialogContentText>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="请输入文件夹路径"
          fullWidth
          variant="standard"
          onChange={(e) => {
            onFolderPathChange(e.target.value);
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={closeModal}>取消</Button>
        <Button
          onClick={() => {
            if (folderPathInput) {
              setFolderPath(folderPathInput);
              closeModal();
            }
          }}
        >
          确认
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FolderPathDialog;
