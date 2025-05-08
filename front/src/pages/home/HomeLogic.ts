import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { Message, ConversationFile } from "../../types";
import { conversationApi } from "../../services/api";

const drawerWidth = 300;

const useHomeLogic = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openSideBar, setOpenSideBar] = useState<boolean>(true);
  const [conversationList, setConversationList] = useState<ConversationFile[]>(
    []
  );
  const [currentFilename, setCurrentFilename] = useState<string | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchConversationList = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/conversation-history/`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: ConversationFile[] = await response.json();
      setConversationList(data ?? []);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération de la liste des conversations:",
        error
      );
    }
  };

  useEffect(() => {
    fetchConversationList();
  }, []);

  const loadConversation = async (filename: string) => {
    setCurrentFilename(filename);
    setMessages([]);
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/conversation-history/${filename}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: Message[] = await response.json();
      setMessages(data);
    } catch (error) {
      console.error(
        `Erreur lors du chargement de la conversation ${filename}:`,
        error
      );
    }
    // const data = conversationApi.loadConversation(filename);
    // setMessages(data);
  };

  const handleSendMessage = async (
    text: string,
    newDiscussion: boolean = false
  ) => {
    const userMessage: Message = {
      id: uuidv4(),
      text,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prevMessages: Message[]) => [...prevMessages, userMessage]);
    setIsLoading(true);
    setIsFetching(true);

    try {
      let filenameToSend: string | null = currentFilename;
      if (newDiscussion && !filenameToSend) {
        const newConversationResponse = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/conversation-history/new`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: text }),
          }
        );
        if (!newConversationResponse.ok)
          throw new Error(
            `HTTP error! status: ${newConversationResponse.status}`
          );
        const newConversationData = await newConversationResponse.json();
        filenameToSend = newConversationData.filename;
        setCurrentFilename(filenameToSend);
        await fetchConversationList();
      }

      if (filenameToSend) {
        await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/conversation-history/${filenameToSend}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: text }),
          }
        );
        const historyResponse = await fetch(
          `${
            import.meta.env.VITE_API_BASE_URL
          }/conversation-history/${filenameToSend}`
        );
        if (!historyResponse.ok)
          throw new Error(`HTTP error! status: ${historyResponse.status}`);
        const historyData: Message[] = await historyResponse.json();
        setMessages(historyData);
      }
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error);
      const errorMessage: Message = {
        id: uuidv4(),
        text: "エラーが発生しました。もう一度お試しください。",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages((prevMessages: Message[]) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsFetching(false);
    }
  };

  const startNewConversation = () => {
    setMessages([]);
    setCurrentFilename(null);
  };

  const handleDrawerToggle = () => {
    setOpenSideBar(!openSideBar);
  };

  const handleDeleteConversation = async (filenameToDelete: string) => {
    try {
      const response = await fetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/conversation-history/${filenameToDelete}`,
        {
          method: "DELETE",
        }
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setConversationList((prevList: ConversationFile[]) =>
        prevList.filter(
          (file: ConversationFile) => file.filename !== filenameToDelete
        )
      );
      setMessages([]);
      setCurrentFilename(null);
      await fetchConversationList();
    } catch (error) {
      console.error(
        `Erreur lors de la suppression de la conversation ${filenameToDelete}:`,
        error
      );
    }
  };

  return {
    messages,
    isLoading,
    openSideBar,
    conversationList,
    currentFilename,
    messagesEndRef,
    fetchConversationList,
    loadConversation,
    handleSendMessage,
    startNewConversation,
    handleDrawerToggle,
    handleDeleteConversation,
    drawerWidth,
    isFetching,
  };
};

export default useHomeLogic;
