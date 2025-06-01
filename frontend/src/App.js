import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import ChatPage from "./components/ChatPage";
import RegisterPage from "./components/RegisterPage";
import LoginPage from "./components/LoginPage";
// import Header from "./components/Header";
// import useTheme from "../hooks/useTheme";
// import useTheme from "./hook/useTheme";
function App() {
  const [userEmail, setUserEmail] = useState(null);
  // const [theme, toggleTheme] = useTheme(userEmail);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    if (token && email) {
      setUserEmail(email);
    }
  }, []);

  const isAuthenticated = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("chat_id");
    setUserEmail(null);
    window.location.href = "/login";
  };

  return (
    <Router>

      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <ChatPage userEmail={userEmail} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/login"
          element={
            <LoginPage
              setUserEmail={(email) => {
                setUserEmail(email);
                localStorage.setItem("email", email);
              }}
            />
          }
        />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
