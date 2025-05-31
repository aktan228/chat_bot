import { useState, useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";

const ChatWindow = ({ selectedTopic, userEmail, chatId, setChatId }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const token = localStorage.getItem("token");

  // Очистка сообщений при смене чата и загрузка истории
  useEffect(() => {
    if (!chatId || !token) return;
    setMessages([]);

    const fetchHistory = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/chat/${chatId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          const formatted = data.map((msg) => ({
            text: msg.content,
            sender: msg.role,
          }));
          setMessages(formatted);
          bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        } else {
          console.error("Ошибка при загрузке истории чата:", data);
        }
      } catch (err) {
        console.error("Ошибка запроса истории:", err);
      }
    };

    fetchHistory();
  }, [chatId, token]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || !token) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          prompt: input,
          chat_id: chatId || null,
          topic: selectedTopic || null,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        const aiMessage = { text: data.response, sender: "ai" };
        setMessages((prev) => [...prev, aiMessage]);

        if (!chatId && data.chat_id) {
          localStorage.setItem("chat_id", data.chat_id);
          setChatId?.(data.chat_id); // безопасный вызов
        }
      } else {
        throw new Error(data.detail || "Ошибка запроса");
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { text: "Ошибка при получении ответа от сервера", sender: "ai" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 flex flex-col h-full">
      <div className="flex-1 overflow-y-auto bg-white dark:bg-gray-800 border rounded p-4 space-y-2 shadow-sm">
        {messages.map((msg, index) => (
          <MessageBubble key={index} role={msg.sender} content={msg.text} />
        ))}
        {loading && <div className="text-gray-500 italic">печатает...</div>}
        <div ref={bottomRef} />
      </div>

      <div className="mt-4 flex">
        <input
          className="flex-1 border p-2 rounded-l"
          placeholder="Введите сообщение..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700"
          onClick={sendMessage}
        >
          Отправить
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
