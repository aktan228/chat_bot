import { useState } from "react";
import TopicSelector from "../components/TopicSelector";
import ChatWindow from "./ChatWindow";
import Sidebar from "./sidebar";

const ChatPage = ({ userEmail }) => {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedChatId, setSelectedChatId] = useState(null);

  const handleNewChat = () => {
    setSelectedChatId(null);
    setSelectedTopic(null);
    localStorage.removeItem("chat_id");
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar
        onSelectChat={(chatId) => {
          setSelectedChatId(chatId);
          setSelectedTopic(null); // отключаем тему при выборе истории
          localStorage.setItem("chat_id", chatId);
        }}
        onNewChat={handleNewChat}
        selectedChatId={selectedChatId}
      />

      <div className="flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-300 dark:border-gray-700">
          <h1 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
            {selectedChatId ? "Chat history" : "Start new conversation by topic"}
          </h1>
          {!selectedChatId && (
            <TopicSelector
              selectedTopic={selectedTopic}
              onSelect={setSelectedTopic}
            />
          )}
        </div>

        <div className="flex-1 overflow-hidden">
          <ChatWindow
            userEmail={userEmail}
            chatId={selectedChatId}
            selectedTopic={!selectedChatId ? selectedTopic : null}
            setChatId={setSelectedChatId}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
