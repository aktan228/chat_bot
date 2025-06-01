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
      setError('Please enter a valid email and a password (at least 3 characters).');
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
          setError(data.detail[0]?.msg || 'Registration error');
        } else {
          setError(data.detail || 'Registration error');
        }
        return;
      }

      alert('Registration successful! Please log in.');
      navigate('/login');
    } catch (err) {
      setError('Network error. Please try again later.');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-black text-white">
      <div className="p-6 bg-white dark:bg-black border border-gray-300 dark:border-gray-700 rounded shadow-md w-80">
        <h2 className="text-xl font-semibold mb-4 text-center">Register</h2>
        {error && <div className="text-red-600 mb-2 text-sm">{error}</div>}
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-black dark:text-white rounded mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-black text-black dark:text-white rounded mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleRegister}
          className="w-full bg-black dark:bg-white text-white dark:text-black py-2 rounded hover:opacity-80 transition"
        >
          Sign Up
        </button>
        <p className="mt-2 text-sm text-center">
          Already have an account?{' '}
          <span
            className="underline cursor-pointer"
            onClick={() => navigate('/login')}
          >
            Log In
          </span>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
