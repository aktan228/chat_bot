import { useState, useEffect } from "react";
import Header from "./Header";
import TopicSelector from "../components/TopicSelector";
import ChatWindow from "./ChatWindow";
import Sidebar from "./sidebar";

const ChatPage = ({ userEmail }) => {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedChatId, setSelectedChatId] = useState(null);

  const [theme, setTheme] = useState("dark");
  const [language, setLanguage] = useState("en");

  const handleNewChat = () => {
    setSelectedChatId(null);
    setSelectedTopic(null);
    localStorage.removeItem("chat_id");
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const fetchSettings = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/user/settings", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();

        if (data.theme) {
          setTheme(data.theme);
          document.documentElement.classList.toggle("dark", data.theme === "dark");
        }

        if (data.language) {
          setLanguage(data.language);
        }
      } catch (err) {
        console.error("Ошибка загрузки настроек:", err);
      }
    };

    fetchSettings();
  }, []);

  return (
    <div className={`flex flex-col h-screen ${theme === "dark" ? "dark" : ""}`}>
      <Header
        userEmail={userEmail}
        onLogout={handleLogout}
        theme={theme}
        language={language}
        setTheme={setTheme}
        setLanguage={setLanguage}
      />

      <div className="flex flex-1 bg-white dark:bg-black text-black dark:text-white">
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
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
