import { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = ({ setUserEmail }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");

    if (!email.includes("@") || password.length < 3) {
      setError("Введите корректный email и пароль (минимум 3 символа)");
      return;
    }

    try {
      const params = new URLSearchParams();
      params.append("username", email);
      params.append("password", password);

      const res = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.detail || "Ошибка авторизации");
      }

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("email", email);
      setUserEmail(email);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-white dark:bg-black text-black dark:text-white transition-colors">
      <div className="p-6 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded shadow-md w-80">
        <h2 className="text-xl font-semibold mb-4 text-center">login</h2>
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-black dark:text-white rounded mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          className="w-full p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-black dark:text-white rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleLogin}
          className="w-full bg-black dark:bg-white text-white dark:text-black py-2 rounded hover:opacity-80 transition"
        >
          login
        </button>
        <p className="mt-2 text-sm text-center">
          dont have account?{" "}
          <span
            className="underline cursor-pointer"
            onClick={() => navigate("/register")}
          >
            register
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
