import React from 'react';

const Header = ({ userEmail, onLogout }) => {
  return (
    <header className="flex justify-between items-center px-6 py-4 bg-blue-600 text-white shadow-md rounded">
      <h1 className="text-xl font-bold">AI Tutor Platform</h1>

      <div className="flex items-center gap-4">
        <span className="text-sm">👋 Hello, {userEmail}</span>
        <button
          onClick={onLogout}
          className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100 transition"
        >
          Log out
        </button>
      </div>
    </header>
  );
};

export default Header;
