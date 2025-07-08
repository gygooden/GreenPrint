import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

interface Habit {
  id: number;
  action: string;
  description: string;
  duration_minutes: number;
  carbon_saved: number;
  date: string;
}

const Dashboard = () => {
  const [habit, setHabit] = useState({
    action: '',
    description: '',
    duration_minutes: '',
  });
  const [logs, setLogs] = useState<Habit[]>([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const fetchLogs = async () => {
    try {
      const res = await API.get('/habits');
      setLogs(res.data);
    } catch {
      navigate('/login');
    }
  };

  const logHabit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        ...habit,
        duration_minutes: parseInt(habit.duration_minutes || '0', 10),
      };
      const res = await API.post('/habits', payload);
      setMessage(`🌱 ${res.data.carbon_saved.toFixed(2)} kg CO₂ saved!`);
      setHabit({ action: '', description: '', duration_minutes: '' });
      fetchLogs();
    } catch (err) {
      setMessage('❌ Failed to log habit.');
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <>
      <Navbar />
      <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
        <h2>Log a Habit</h2>
        <form onSubmit={logHabit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            type="text"
            value={habit.action}
            placeholder="Action (e.g., biking)"
            onChange={e => setHabit({ ...habit, action: e.target.value })}
            required
          />
          <input
            type="text"
            value={habit.description}
            placeholder="Description (optional)"
            onChange={e => setHabit({ ...habit, description: e.target.value })}
          />
          <input
            type="number"
            inputMode="numeric"
            min="0"
            step="1"
            value={habit.duration_minutes}
            placeholder="Duration in minutes"
            onChange={e => setHabit({ ...habit, duration_minutes: e.target.value })}
          />
          <button type="submit">Log Habit</button>
        </form>

        {message && <p style={{ color: message.includes('❌') ? 'red' : 'green', marginTop: '1rem' }}>{message}</p>}

        <h3 style={{ marginTop: '2rem' }}>Recent Logs</h3>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {logs.map(log => (
            <li key={log.id} style={{ marginBottom: '10px' }}>
              <strong>{log.date}</strong>: {log.action} ({log.duration_minutes} min) —{' '}
              <span style={{ color: 'green' }}>{log.carbon_saved.toFixed(2)} kg CO₂</span>
              {log.description && <div style={{ fontStyle: 'italic' }}>“{log.description}”</div>}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Dashboard;