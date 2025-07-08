import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const formatKg = (value: number) => new Intl.NumberFormat().format(value);

interface Summary {
  total_logs: number;
  total_carbon: number;
  streak_days: number;
}

const Summary = () => {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [suggestion, setSuggestion] = useState('');
  const navigate = useNavigate();

    useEffect(() => {
        const fetchSummary = async () => {
            try {
            const [summaryRes, suggestionRes] = await Promise.all([
                API.get('/habits/summary'),
                API.get('/habits/suggestion'),
            ]);
            setSummary(summaryRes.data);
            setSuggestion(suggestionRes.data.suggestion);
            } catch (err) {
            console.error('Summary fetch error:', err); // Log actual issue
            navigate('/login'); // Redirect if token is invalid or missing
            }
        };

        fetchSummary();
        }, [navigate]);

  return (
    <>
      <Navbar />
      <div style={{ padding: '2rem', maxWidth: '600px', margin: 'auto' }}>
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
      </div>
    </>
  );
};

export default Summary;