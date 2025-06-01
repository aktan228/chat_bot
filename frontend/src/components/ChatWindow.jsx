// import { useState, useEffect } from "react";
import { useState} from "react";

import Header from "../components/Header"; 
import ChatWindow from "./ChatWindow";
import Sidebar from "./sidebar";
import TopicSelector from "../components/TopicSelector";

const ChatPage = ({ userEmail }) => {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [theme, setTheme] = useState("dark");
  // const [language, setLanguage] = useState("en");
  const handleNewChat = () => {
    setSelectedChatId(null);
    setSelectedTopic(null);
    localStorage.removeItem("chat_id");
  };

  return (
    <div className="flex h-screen bg-white dark:bg-black text-black dark:text-white">
      <Sidebar
        onSelectChat={(chatId) => {
          setSelectedChatId(chatId);
          setSelectedTopic(null);
          localStorage.setItem("chat_id", chatId);
        }}
        onNewChat={handleNewChat}
        selectedChatId={selectedChatId}
      />

      <div className="flex-1 flex flex-col">
        {/* Header, если есть */}
        <Header
          userEmail={userEmail}
          theme={theme}
          setTheme={setTheme}
          // language={language}
          // setLanguage={setLanguage}
          onLogout={() => {
            localStorage.clear();
            window.location.reload();
          }}
        />

        <div className="p-4 border-b border-gray-300 dark:border-gray-700">
          <h1 className="mb-2 text-xl font-semibold">
            {selectedChatId ? "Chat History" : "Start a New Conversation"}
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
            // language={language} // <--- передаём сюда
          />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
