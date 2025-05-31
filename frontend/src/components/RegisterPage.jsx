import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    setError('');

    if (!email.includes('@') || password.length < 3) {
      setError('Введите корректный email и пароль (минимум 3 символа)');
      return;
    }

    try {
      const res = await fetch('http://localhost:8000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (Array.isArray(data.detail)) {
          setError(data.detail[0]?.msg || 'Ошибка регистрации');
        } else {
          setError(data.detail || 'Ошибка регистрации');
        }
        return;
      }

      alert('Регистрация успешна! Войдите под своим email.');
      navigate('/login');
    } catch (err) {
      setError('Сетевая ошибка. Попробуйте позже.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="p-6 bg-white rounded shadow-md w-80">
        <h2 className="text-xl font-semibold mb-4">Регистрация</h2>
        {error && <div className="text-red-600 mb-2 text-sm">{error}</div>}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Пароль"
          className="w-full p-2 border rounded mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleRegister}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Зарегистрироваться
        </button>
        <p className="mt-2 text-sm text-center">
          Уже есть аккаунт?{' '}
          <span
            className="text-blue-600 cursor-pointer"
            onClick={() => navigate('/api/login')}
          >
            Войти
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
