import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import React from "react";

interface IProps {
  title: string;
  content: React.ReactElement;

  open: boolean;
  setOpen: (open: boolean) => void;

  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationDialog = ({
  title,
  content,
  open,
  setOpen,
  onConfirm,
  onCancel,
}: IProps): React.ReactElement => {
  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          autoFocus
          onClick={() => {
            onCancel();
            setOpen(false);
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={() => {
            onConfirm();
            setOpen(false);
          }}
          color="error"
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};
