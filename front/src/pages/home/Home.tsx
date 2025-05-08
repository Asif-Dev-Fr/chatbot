import React from "react";
import {
  Box,
  Container,
  Typography,
  AppBar,
  Toolbar,
  CssBaseline,
  ThemeProvider,
  createTheme,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Skeleton,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChatMessage from "../../components/ChatMessage";
import ChatInput from "../../components/ChatInput";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import useHomeLogic from "./HomeLogic"; // Importez la logique

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

const HomeView = () => {
  const {
    messages,
    isLoading,
    openSideBar,
    conversationList,
    currentFilename,
    messagesEndRef,
    loadConversation,
    handleSendMessage,
    startNewConversation,
    handleDrawerToggle,
    handleDeleteConversation,
    drawerWidth,
    isFetching,
  } = useHomeLogic();
  console.log("messages", messages);
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: "flex", height: "100vh" }}>
        <CssBaseline />
        <Box
          sx={{
            width: openSideBar ? drawerWidth : 0,
            flexShrink: 0,
            transition: "width 0.3s ease-in-out",
            overflowX: "hidden",
            borderRight: "1px solid #ccc",
          }}
        >
          <Toolbar
            sx={{
              backgroundColor: "black",
              color: "white",
              justifyContent: "space-between",
              paddingLeft: 2,
            }}
          >
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              履歴
            </Typography>
            <IconButton color="inherit" onClick={startNewConversation}>
              <AddCircleOutlineIcon />
            </IconButton>
            <IconButton color="inherit" onClick={handleDrawerToggle}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List>
            {conversationList.map((file) => (
              <ListItem
                button
                key={file.filename}
                onClick={() =>
                  currentFilename !== file.filename &&
                  loadConversation(file.filename)
                }
                sx={{
                  cursor:
                    currentFilename === file.filename ? "inherit" : "pointer",
                  backgroundColor:
                    currentFilename === file.filename ? "lightgrey" : "inherit",
                }}
              >
                <ListItemText
                  primary={file.filename
                    .replace(".json", "")
                    .replaceAll("_", " ")}
                  secondary={`作成 ${new Date(
                    file.created_at
                  ).toLocaleDateString()} ${new Date(
                    file.created_at
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}`}
                />
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <IconButton
                    edge="end"
                    onClick={() => handleDeleteConversation(file.filename)}
                    size="small"
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </ListItem>
            ))}
          </List>
        </Box>
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
          <AppBar position="static">
            <Toolbar sx={{ backgroundColor: "gray" }}>
              {!openSideBar && (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={handleDrawerToggle}
                  edge="start"
                  sx={{ mr: 2 }}
                >
                  <MenuIcon />
                </IconButton>
              )}
              <ChatIcon sx={{ mr: 2 }} />
              <Typography variant="h6" component="div">
                AIチャットボット
              </Typography>
            </Toolbar>
          </AppBar>
          <Box
            sx={{
              flexGrow: 1,
              overflow: "auto",
              p: 2,
              backgroundColor: "grey.50",
            }}
          >
            <Container maxWidth="md">
              {messages.length === 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography color="text.secondary">
                    メッセージを送信して会話を開始してください。
                  </Typography>
                </Box>
              ) : isFetching && messages.length <= 2 ? (
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-end",
                      mb: 2,
                    }}
                  >
                    <Skeleton variant="rounded" width={210} height={60} />
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "flex-start",
                      mb: 2,
                    }}
                  >
                    <Skeleton variant="rounded" width={210} height={60} />
                  </Box>
                </Box>
              ) : (
                messages.map(
                  (message, index) =>
                    index !== 0 && (
                      <ChatMessage key={message.id} message={message} />
                    )
                )
              )}
              <div ref={messagesEndRef} />
            </Container>
          </Box>
          <Box sx={{ p: 1, backgroundColor: "background.paper" }}>
            <Container>
              <ChatInput
                onSendMessage={(text) =>
                  handleSendMessage(text, messages.length === 0)
                }
                isLoading={isLoading}
              />
            </Container>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  );
};

export default HomeView;
