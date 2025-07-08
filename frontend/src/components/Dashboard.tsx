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
  const [editingId, setEditingId] = useState<number | null>(null);
  const navigate = useNavigate();

  const fetchLogs = async () => {
    try {
      const res = await API.get('/habits');
      setLogs(res.data);
    } catch {
      navigate('/login');
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      action: habit.action,
      description: habit.description,
      duration_minutes: parseInt(habit.duration_minutes || '0', 10),
    };

    try {
      let res;
      if (editingId !== null) {
        res = await API.put(`/habits/${editingId}`, payload);
        setMessage(`✏️ Updated log — ${res.data.carbon_saved.toFixed(2)} kg CO₂`);
      } else {
        res = await API.post('/habits', payload);
        const carbon = res.data.carbon_saved;
        const co2 = carbon.toFixed(2);
        const charges = Math.floor(Math.abs(carbon) / 0.005);
        const miles = (Math.abs(carbon) / 0.251).toFixed(1);

        if (carbon < 0) {
        setMessage(`⚠️ You emitted ${Math.abs(co2)} kg CO₂ — equal to driving ${miles} miles or charging your phone ${charges} times.`);
        } else {
        setMessage(`🌱 Saved ${co2} kg CO₂ — like avoiding ${miles} miles of driving or charging your phone ${charges} times!`);
        }
      }

      setHabit({ action: '', description: '', duration_minutes: '' });
      setEditingId(null);
      fetchLogs();
    } catch {
      setMessage('❌ Failed to submit habit.');
    }
  };

  const handleEdit = (log: Habit) => {
    setHabit({
      action: log.action,
      description: log.description,
      duration_minutes: log.duration_minutes.toString(),
    });
    setEditingId(log.id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this habit log?')) return;
    try {
      await API.delete(`/habits/${id}`);
      setLogs(logs.filter(l => l.id !== id));
      setMessage('🗑️ Log deleted successfully');
    } catch {
      setMessage('❌ Failed to delete log.');
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ padding: '2rem', maxWidth: '650px', margin: 'auto' }}>
        <h2>{editingId !== null ? 'Edit Habit' : 'Log a Habit'}</h2>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <input
            type="text"
            value={habit.action}
            placeholder="Action (e.g., biking, shower, driving)"
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
            required
          />
          <button type="submit">{editingId !== null ? 'Update Habit' : 'Log Habit'}</button>
        </form>

        {message && <p style={{ marginTop: '1rem', color: message.includes('❌') ? 'red' : message.includes('⚠️') ? 'orange' : 'green' }}>{message}</p>}

        <h3 style={{ marginTop: '2rem' }}>Recent Logs</h3>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {logs.map(log => (
            <li key={log.id} style={{ marginBottom: '16px', borderBottom: '1px solid #ccc', paddingBottom: '8px' }}>
              <div>
                <strong>{log.date}</strong>: {log.action} ({log.duration_minutes} min) —{' '}
                <span style={{ color: log.carbon_saved < 0 ? 'orange' : 'green' }}>
                  {log.carbon_saved.toFixed(2)} kg CO₂
                </span>
              </div>
              {log.description && <div style={{ fontStyle: 'italic' }}>“{log.description}”</div>}
              <div style={{ marginTop: '6px' }}>
                <button type="button" onClick={() => handleEdit(log)} style={{ marginRight: '8px' }}>✏️ Edit</button>
                <button type="button" onClick={() => handleDelete(log.id)}>🗑️ Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default Dashboard;
