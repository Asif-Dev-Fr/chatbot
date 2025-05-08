import axios from "axios";

export const chatApi = {
  sendMessage: async (message: string): Promise<string> => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/chat/`,
        { message }
      );
      return response.data.response;
    } catch (error) {
      console.error("APIエラー:", error);
      throw new Error("メッセージの送信中にエラーが発生しました");
    }
  },
};

export const conversationApi = {
  loadConversation: async (filename: string) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/conversation-history/${filename}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(
        `Erreur lors du chargement de la conversation ${filename}:`,
        error
      );
    }
  },
};
