import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import Navbar from './Navbar';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = new URLSearchParams();
    payload.append('username', form.username);
    payload.append('password', form.password);

    try {
      const res = await API.post('/auth/token', payload, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      });
      localStorage.setItem('token', res.data.access_token);
      navigate('/');
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: '2rem', maxWidth: '400px', margin: 'auto' }}>
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Username"
            onChange={e => setForm({ ...form, username: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
          />
          <button type="submit">Login</button>
        </form>
      </div>
    </>
  );
};

export default Login;