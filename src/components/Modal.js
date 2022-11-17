import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";

import Modal from "@mui/material/Modal";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 200,
  bgcolor: "background.paper",
  boxShadow: 24,
  border: 0,
  borderRadius: 5,
  p: 4,
  outline: 0,
};

export default function BasicModal({ open, handleClose, onOutClick }) {
  const inputRef = React.useRef();
  return (
    <div>
      <Modal
        open={open}
        onClose={onOutClick}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add new chat room{" "}
          </Typography>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleClose(inputRef.current.value);
            }}
          >
            <TextField
              inputRef={inputRef}
              id="outlined-basic"
              label="Enter new room name"
              variant="outlined"
              margin="normal"
            />

            <button type="submit">Add room</button>
          </form>
        </Box>
      </Modal>
    </div>
  );
}
