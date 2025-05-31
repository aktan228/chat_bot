import React from 'react';

const MessageBubble = ({ role, content }) => {
  const isUser = role === 'user';

  return (
    <div className={`w-full flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
      <div
        className={`max-w-xs md:max-w-md px-4 py-2 rounded-lg shadow-md text-sm ${
          isUser
            ? 'bg-blue-600 text-white rounded-br-none'
            : 'bg-gray-200 text-gray-900 rounded-bl-none'
        }`}
      >
        {content}
      </div>
    </div>
  );
};

export default MessageBubble;
