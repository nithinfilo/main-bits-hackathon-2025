'use client'

import React, { useState, useEffect } from 'react';
import { Target } from 'lucide-react';
import { fetchWithAuth } from '@/utils/herokuapi';

const FLASK_API_SERVER = process.env.NEXT_PUBLIC_FLASK_API_SERVER || 'http://localhost:5001';

const GoalSelector = ({ summary, onSelectGoal, sessionId, initialGoals = [] }) => {
  const [goals, setGoals] = useState(initialGoals);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [customGoal, setCustomGoal] = useState('');
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [regenerateCount, setRegenerateCount] = useState(0);

  useEffect(() => {
    if (initialGoals.length === 0) {
      fetchGoals();
    } else {
      setGoals(initialGoals);
    }
  }, [summary, initialGoals]);

  const fetchGoals = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const sessionResponse = await fetchWithAuth(`${FLASK_API_SERVER}/api/sessions/${sessionId}/goals`, {
        method: 'GET',
      });
      if (sessionResponse.ok) {
        const sessionGoals = await sessionResponse.json();
        if (sessionGoals.length > 0) {
          setGoals(sessionGoals);
          setIsLoading(false);
          return;
        }
      }

      const generateResponse = await fetchWithAuth(`${FLASK_API_SERVER}/api/goals`, {
        method: 'POST',
        body: JSON.stringify({ summary, sessionId }),
      });

      if (!generateResponse.ok) {
        throw new Error('Failed to generate goals');
      }

      const generatedGoals = await generateResponse.json();
      setGoals(generatedGoals);
    } catch (err) {
      console.error('Error fetching/generating goals:', err);
      setError('Failed to fetch or generate goals. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectGoal = (goal) => {
    setSelectedGoal(goal);
    onSelectGoal(goal);
  };

  const handleCustomGoalSubmit = async (e) => {
    e.preventDefault();
    if (customGoal.trim()) {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetchWithAuth(`${FLASK_API_SERVER}/api/goals`, {
          method: 'POST',
          body: JSON.stringify({ summary, customGoal: customGoal.trim(), sessionId }),
        });

        if (!response.ok) {
          throw new Error('Failed to submit custom goal');
        }

        const data = await response.json();
        const newGoal = data[data.length - 1];
        setGoals((prevGoals) => [...prevGoals, newGoal]);
        handleSelectGoal(newGoal);
        setCustomGoal('');
      } catch (err) {
        setError('Failed to add custom goal. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleRegenerateGoals = async () => {
    if (regenerateCount < 5) {
      setRegenerateCount(prevCount => prevCount + 1);
      await fetchGoals();
    } else {
      setError('Maximum number of goal regenerations reached for this session.');
    }
  };

  if (error) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="alert alert-error">{error}</div>
          <button
            onClick={fetchGoals}
            className="btn btn-primary"
            disabled={isLoading}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-purple-700 p-2 rounded-lg">
            <Target className="w-6 h-6 text-purple-300" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Goal Selection</h3>
            <p className="text-sm text-gray-400">Choose analysis goals</p>
          </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : (
          <div className="space-y-3 max-h-80 overflow-y-auto pr-2 mb-4 custom-scrollbar">
            {goals.length === 0 ? (
              <button
                onClick={handleRegenerateGoals}
                className="btn btn-secondary w-full"
                disabled={isLoading || regenerateCount >= 5}
              >
                Regenerate Goals
              </button>
            ) : (
              goals.map((goal, index) => (
                <label
                  key={index}
                  className={`block rounded-lg p-3 cursor-pointer transition-colors ${
                    selectedGoal === goal
                      ? 'bg-primary text-primary-content'
                      : 'bg-base-200 hover:bg-base-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="goal"
                    value={index + 1}
                    checked={selectedGoal === goal}
                    onChange={() => handleSelectGoal(goal)}
                    className="hidden"
                  />
                  <div className="flex items-center space-x-3">
                    <div className={`w-4 h-4 rounded-full ${selectedGoal === goal ? "bg-primary-content" : "border border-current"}`} />
                    <span>{goal.question}</span>
                  </div>
                </label>
              ))
            )}
          </div>
        )}
        <form onSubmit={handleCustomGoalSubmit} className="mt-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">Custom Goal</span>
            </label>
            <textarea
              value={customGoal}
              onChange={(e) => setCustomGoal(e.target.value)}
              placeholder="Enter your custom goal"
              className="textarea textarea-bordered h-24 mb-2"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isLoading}
          >
            Submit Custom Goal
          </button>
        </form>
      </div>
    </div>
  );
};

export default GoalSelector;