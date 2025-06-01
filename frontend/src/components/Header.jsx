import React from "react";
import ThemeToggleIcon from "./ThemeToggleIcon";

const Header = ({
  userEmail,
  onLogout,
  theme,
  language,
  setTheme,
  setLanguage,
}) => {
  const token = localStorage.getItem("token");

  const toggleTheme = async () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");

    await fetch("http://localhost:8000/api/user/settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ theme: newTheme }),
    });
  };

  const toggleLanguage = async () => {
    const newLang = language === "en" ? "ru" : "en";
    setLanguage(newLang);

    await fetch("http://localhost:8000/api/user/settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ language: newLang }),
    });
  };

  return (
    <header className="flex justify-between items-center px-6 py-4 bg-black text-white shadow-md">
      <h1 className="text-xl font-bold">AI Tutor Platform</h1>

      <div className="flex items-center gap-4">
        <span className="text-sm">👋 Hello, {userEmail}</span>
        <button
          onClick={toggleTheme}
          className="text-sm bg-white text-black px-0 py-0 rounded hover:bg-gray-200 transition"
        >
          <ThemeToggleIcon theme={theme} toggleTheme={toggleTheme} />
        </button>
        <button
          onClick={toggleLanguage}
          className="text-sm bg-white text-black px-3 py-2 rounded hover:bg-gray-200 transition"
        >
          {typeof language === "string" ? language.toUpperCase() : "EN"}
        </button>
        <button
          onClick={onLogout}
          className="bg-white text-black px-3 py-3 rounded hover:bg-gray-100 transition"
        >
          Log out
        </button>
      </div>
    </header>
  );
};

export default Header;
