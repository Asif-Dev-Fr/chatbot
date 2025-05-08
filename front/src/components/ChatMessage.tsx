import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import { Message } from "../types";

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === "user";
  const messageDate = new Date(message.timestamp);
  console.log("message", message);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        mb: 2,
      }}
    >
      <Paper
        elevation={2}
        sx={{
          maxWidth: "70%",
          px: 2,
          py: 1,
          backgroundColor: isUser ? "primary.main" : "grey.100",
          color: isUser ? "white" : "text.primary",
          borderRadius: 2,
        }}
      >
        <Typography variant="body1">{message.text}</Typography>
        <Typography
          variant="caption"
          sx={{
            display: "block",
            textAlign: "right",
            mt: 0.5,
            opacity: 0.7,
          }}
        >
          {messageDate.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Typography>
      </Paper>
    </Box>
  );
};

export default ChatMessage;
