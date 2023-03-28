import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";

function Popup({ title, severity, message, nameButton }) {
  const [open, setOpen] = useState(true);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <Alert severity={severity}>{message}</Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>{nameButton}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Popup;
