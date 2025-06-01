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
          console.warn("Failed to load chat list.");
          return;
        }

        const data = await res.json();
        setChats(data);
      } catch (err) {
        console.error("Error fetching chats:", err);
      }
    };

    fetchChats();
  }, [token]);

  return (
    <div className="w-64 bg-white dark:bg-black h-full p-4 overflow-y-auto border-r border-gray-300 dark:border-gray-700">
      <h2 className="text-lg font-bold mb-4 text-black dark:text-white">
        Chat History
      </h2>

      <button
        onClick={() => {
          if (onNewChat) onNewChat();
        }}
        className="mb-4 w-full p-2 bg-white text-black rounded hover:bg-gray-800 transition"
      >
        New Chat
      </button>

      {chats.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">No chats yet</p>
      ) : (
        chats.map((chat) => {
          const isActive = selectedChatId === chat.chat_id;
          return (
            <button
              key={chat.chat_id}
              onClick={() => onSelectChat(chat.chat_id)}
              className={`block w-full text-left p-2 rounded text-sm font-medium transition ${
                isActive
                  ? "bg-black text-white font-bold"
                  : "text-black dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              Chat {chat.chat_id.slice(0, 8)}...
            </button>
          );
        })
      )}
    </div>
  );
};

export default Sidebar;
