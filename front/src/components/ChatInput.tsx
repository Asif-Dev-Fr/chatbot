import React, { useState } from "react";
import { Box, TextField, Button, Paper } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import DeleteIcon from "@mui/icons-material/Delete";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage("");
    }
  };

  return (
    <Box>
      <Paper
        component="form"
        onSubmit={handleSubmit}
        elevation={2}
        sx={{
          display: "flex",
          alignItems: "center",
          p: 1,
          borderTop: 1,
          borderColor: "divider",
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder="メッセージを入力..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={isLoading}
          id="outlined-multiline-flexible"
          multiline
          maxRows={8}
          size="medium"
        />
        <Box
          sx={{
            width: "150px",
            display: "flex",
            flexDirection: "column",
            marginLeft: "4px",
          }}
        >
          <Button
            type="submit"
            variant="contained"
            color="primary"
            endIcon={<SendIcon />}
            disabled={isLoading || !message.trim()}
            sx={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>{isLoading ? "送信中..." : "送信"}</span>
          </Button>
          <Button
            variant="contained"
            color="primary"
            endIcon={<DeleteIcon />}
            disabled={isLoading || !message.trim()}
            onClick={() => setMessage("")}
            sx={{
              marginTop: "4px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>リセット</span>
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ChatInput;
