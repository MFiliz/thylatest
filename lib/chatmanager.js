// Sohbet geçmişini al
const getChatHistory = () => {
  const history = sessionStorage.getItem("chatHistory");
  return history ? JSON.parse(history) : [];
};

// Sohbet geçmişine yeni bir mesaj ekle
const addMessageToChatHistory = (message) => {
  const history = getChatHistory();
  history.push(message);
  sessionStorage.setItem("chatHistory", JSON.stringify(history));
};
const clearChatHistory = () => {
  sessionStorage.removeItem("chatHistory");
};
export { addMessageToChatHistory, getChatHistory, clearChatHistory };
