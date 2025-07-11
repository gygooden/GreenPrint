/* Summary.tsx */

import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer
} from 'recharts';

interface Summary {
  total_logs: number;
  total_carbon: number;
  streak_days: number;
}

interface TrendPoint {
  date: string;
  carbon: number;
}

const formatKg = (value: number) => new Intl.NumberFormat().format(value);

const Summary = () => {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [suggestion, setSuggestion] = useState('');
  const [trendData, setTrendData] = useState<TrendPoint[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const [summaryRes, suggestionRes, trendRes] = await Promise.all([
          API.get('/habits/summary'),
          API.get('/habits/suggestion'),
          API.get('/habits/summary/trend'),
        ]);
        setSummary(summaryRes.data);
        setSuggestion(suggestionRes.data.suggestion);
        setTrendData(trendRes.data);
      } catch (err) {
        console.error('Summary fetch error:', err);
        navigate('/login');
      }
    };

    fetchSummary();
  }, [navigate]);

  return (
    <>
      <Navbar />
      <div style={{ padding: '2rem', maxWidth: '800px', margin: 'auto' }}>
        <h2>Your GreenPrint Summary</h2>

        {!summary ? (
          <p>Loading summary...</p>
        ) : (
          <>
            <p>Total Habits Logged: {summary.total_logs}</p>
            <p>Total CO₂ Saved: {formatKg(summary.total_carbon)} kg</p>
            <p>Current Streak: {summary.streak_days} days</p>
            {summary.total_carbon >= 10 && (
              <p>🎉 You've saved over 10 kg CO₂! Keep going!</p>
            )}
            {summary.streak_days >= 3 && (
              <p>🔥 3-day streak! Amazing consistency!</p>
            )}
          </>
        )}

        <h3>Suggestion</h3>
        <p>{suggestion || 'Fetching your personalized suggestion...'}</p>

        {trendData.length > 0 && (
          <>
            <h3 style={{ marginTop: '2rem' }}>CO₂ Saved Over Time</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                <Line type="monotone" dataKey="carbon" stroke="#2f855a" />
              </LineChart>
            </ResponsiveContainer>
          </>
        )}
      </div>
    </>
  );
};

export default Summary;
