// app/session/[id]/page.js
'use client'

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Summary from '@/components/Summary';
import GoalSelector from '@/components/GoalSelector';
import Visualization from '@/components/Visualization';
import { fetchWithAuth } from '@/utils/herokuapi';

const FLASK_API_SERVER = process.env.NEXT_PUBLIC_FLASK_API_SERVER || 'http://localhost:5001';

export default function SessionView({ params }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sessionData, setSessionData] = useState(null);
  const [summary, setSummary] = useState(null);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [visualization, setVisualization] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchSessionData();
    }
  }, [status, params.id]);

  const fetchSessionData = async () => {
    try {
      const response = await fetch(`/api/sessions/${params.id}`);
      if (response.ok) {
        const data = await response.json();
        setSessionData(data);
        if (!data.datasetSummary) {
          await summarizeDataset(data.datasetUrl);
        } else {
          setSummary(data.datasetSummary);
        }
      } else {
        throw new Error('Failed to fetch session data');
      }
    } catch (error) {
      console.error('Error fetching session data:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const summarizeDataset = async (datasetUrl) => {
    try {
      const response = await fetchWithAuth(`${FLASK_API_SERVER}/api/summarize`, {
        method: 'POST',

        body: JSON.stringify({ datasetUrl }),
      });

      if (response.ok) {
        const summaryData = await response.json();
        setSummary(summaryData);
        
        // Update the session with the summary
        await fetch(`/api/sessions/${params.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ datasetSummary: summaryData }),
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to summarize dataset');
      }
    } catch (error) {
      console.error('Error summarizing dataset:', error);
      setError(error.message);
    }
  };

  const handleGoalSelect = (goal) => {
    setSelectedGoal(goal);
  };

  const handleVisualizationGenerated = (visualizationData) => {
    setVisualization(visualizationData);
  };

  if (status === 'loading' || isLoading) {
    return <div>Loading...</div>;
  }

  if (status === 'unauthenticated') {
    router.push('/api/auth/signin');
    return null;
  }

  if (error) {
    return (
      <main className="p-4 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Error</h1>
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => router.push('/dashboard')}
          className="mt-6 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Back to Dashboard
        </button>
      </main>
    );
  }

  return (
    <main className="p-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Session: {sessionData?.datasetUrl.split('/').pop()}</h1>

      {summary && <Summary summary={summary} />}

      {summary && (
        <GoalSelector
          summary={summary}
          onSelectGoal={handleGoalSelect}
          sessionId={params.id}
          initialGoals={sessionData?.goals || []}
        />
      )}

      {summary && selectedGoal && (
        <Visualization
          summary={summary}
          goal={selectedGoal}
          onVisualizationGenerated={handleVisualizationGenerated}
          sessionId={params.id}
          initialVisualization={sessionData?.visualizations.find(v => v.goal === selectedGoal)}
        />
      )}

      <button
        onClick={() => router.push('/dashboard')}
        className="mt-6 p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Back to Dashboard
      </button>
    </main>
  );
}