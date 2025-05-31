import { useEffect, useState } from "react";

const Sidebar = ({ onSelectChat, onNewChat, selectedChatId }) => {
  const [chats, setChats] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    const fetchChats = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/chat/list", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          console.warn("Ошибка при загрузке чатов.");
          return;
        }

        const data = await res.json();
        setChats(data);
      } catch (err) {
        console.error("Ошибка при загрузке чатов:", err);
      }
    };

    fetchChats();
  }, [token]);

  return (
    <div className="w-64 bg-gray-100 dark:bg-gray-800 h-full p-4 overflow-y-auto">
      <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-white">
        История чатов
      </h2>

      <button
        onClick={() => {
          if (onNewChat) onNewChat();
        }}
        className="mb-4 w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Новый чат
      </button>

      {chats.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">Нет чатов</p>
      ) : (
        chats.map((chat) => {
          const isActive = selectedChatId === chat.chat_id;
          return (
            <button
              key={chat.chat_id}
              onClick={() => onSelectChat(chat.chat_id)}
              className={`block w-full text-left p-2 rounded text-sm font-medium ${
                isActive
                  ? "bg-blue-600 text-white font-bold dark:bg-blue-500"
                  : "hover:bg-blue-100 dark:hover:bg-gray-700 text-gray-800 dark:text-white"
              }`}
            >
              Чат {chat.chat_id.slice(0, 8)}...
            </button>
          );
        })
      )}
    </div>
  );
};

export default Sidebar;
