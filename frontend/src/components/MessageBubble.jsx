import MathText from "./MathText";

const MessageBubble = ({ role, content }) => {
  const isUser = role === "user";

  return (
    <div className={`w-full flex ${isUser ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg shadow-md text-sm border ${
          isUser
            ? "bg-white text-black border-gray-300 rounded-br-none"
            : "bg-black text-white border-gray-700 rounded-bl-none"
        }`}
      >
        <MathText content={content} />
      </div>
    </div>
  );
};

export default MessageBubble;
