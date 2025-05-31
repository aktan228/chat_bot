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
import Header from "./components/Header";

function App() {
  const [userEmail, setUserEmail] = useState(null);

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
      {isAuthenticated && (
        <Header userEmail={userEmail} onLogout={handleLogout} />
      )}

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
