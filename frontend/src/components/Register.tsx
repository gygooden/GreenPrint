/* Register.tsx */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';
import Navbar from './Navbar';

const Register = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/register', form);
      localStorage.setItem('token', res.data.access_token);
      navigate('/');
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: '2rem', maxWidth: '400px', margin: 'auto' }}>
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
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
          <button type="submit">Register</button>
        </form>
      </div>
    </>
  );
};

export default Register;