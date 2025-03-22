'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Home, Twitter } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { TracingBeam } from "@/components/ui/tracing-beam"
import DataPreview from '@/components/DataPreview'
import Summary from '@/components/Summary'
import GoalSelector from '@/components/GoalSelector'
import Visualization from '@/components/Visualization'
import ButtonAccount from '@/components/ButtonAccount'
import { fetchWithAuth } from '@/utils/herokuapi'

const FLASK_API_SERVER = process.env.NEXT_PUBLIC_FLASK_API_SERVER || 'http://localhost:5001'

export default function SessionView({ params }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [sessionData, setSessionData] = useState(null)
  const [summary, setSummary] = useState(null)
  const [selectedGoal, setSelectedGoal] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (status === 'authenticated') {
      fetchSessionData()
    } else if (status === 'unauthenticated') {
      router.push('/api/auth/signin')
    }
  }, [status, params.id])

  const fetchSessionData = async () => {
    try {
      const response = await fetch(`/api/sessions/${params.id}`)
      if (!response.ok) throw new Error('Failed to fetch session data')
      const data = await response.json()
      if (data.userId !== session.user.id) throw new Error('Unauthorized access')
      setSessionData(data)
      if (!data.datasetSummary) {
        await summarizeDataset(data.datasetUrl)
      } else {
        setSummary(data.datasetSummary)
      }
    } catch (error) {
      console.error('Error fetching session data:', error)
      setError(error.message)
      if (error.message === 'Unauthorized access') {
        router.push('/api/auth/signin')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const summarizeDataset = async (datasetUrl) => {
    try {
      const response = await fetchWithAuth(`${FLASK_API_SERVER}/api/summarize`, {
        method: 'POST',
        body: JSON.stringify({ datasetUrl }),
      })
      if (!response.ok) throw new Error('Failed to summarize dataset. Make sure that it is well formatted and only contains UTF-8 characters. ')
      const summaryData = await response.json()
      setSummary(summaryData)
      await fetch(`/api/sessions/${params.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ datasetSummary: summaryData }),
      })
    } catch (error) {
      console.error('Error summarizing dataset:', error)
      setError(error.message)
    }
  }

  const handleGoalSelect = (goal) => {
    setSelectedGoal(goal)
  }

  if (status === 'loading' || isLoading) {
    return <LoadingView />
  }

  if (error) {
    return <ErrorView error={error} />
  }

  const sessionName = getFileNameFromUrl(sessionData?.datasetUrl)

  return (
    <div className="min-h-screen bg-base-100">
      <TracingBeam className="min-h-screen">
        <main className="container mx-auto p-4 space-y-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard" className="flex items-center">

                <span className="ml-2 text-xl font-semibold">Hackathon 2025</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
             
              <button className="btn btn-ghost btn-sm" onClick={() => router.push('/dashboard')}>
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </button>
            </div>
          </div>
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">{sessionName}</h1>
          </div>
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Data Preview</h3>
              {sessionData && <DataPreview datasetUrl={sessionData.datasetUrl} />}
            </div>
          </div>
          <div className="card bg-base-200 shadow-xl">
  <div className="card-body">
    <h3 className="card-title">Summary</h3>
    <Summary summary={summary} error={error} />
  </div>
</div>
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Goal Selection</h3>
              {summary && (
                <GoalSelector
                  summary={summary}
                  onSelectGoal={handleGoalSelect}
                  sessionId={params.id}
                  initialGoals={sessionData?.goals || []}
                />
              )}
            </div>
          </div>
          <div className="card bg-base-200 shadow-xl">
            <div className="card-body">
              <h3 className="card-title">Visualization</h3>
              {summary && selectedGoal && (
                <Visualization
                  summary={summary}
                  goal={selectedGoal}
                  sessionId={params.id}
                  initialVisualization={sessionData?.visualizations.find(v => v.goal === selectedGoal)}
                />
              )}
            </div>
          </div>
        </main>
      </TracingBeam>
    </div>
  )
}

function LoadingView() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
  <div className="loading loading-spinner loading-lg"></div>
  <p className="mt-4 text-lg">Loading session data...</p>
  <p className="mt-2 text-sm text-gray-500">This might take a few seconds, please wait.</p>
</div>
  )
}

function ErrorView({ error }) {
  const router = useRouter()
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="card w-96 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title text-error">Error</h2>
          <p className="text-sm text-base-content opacity-70 mb-4">{error}</p>
          <div className="card-actions justify-end">
            <button className="btn btn-primary" onClick={() => router.push('/dashboard')}>
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}


function getFileNameFromUrl(url) {
  if (!url) return 'Unnamed Session';
  const decodedUrl = decodeURIComponent(url);
  const urlWithoutParams = decodedUrl.split('?')[0];
  const parts = urlWithoutParams.split('/');
  const fullFileName = parts.pop();
  const cleanedFileName = fullFileName.split('-').pop().replace(/%20/g, ' ').replace(/%28/g, '(').replace(/%29/g, ')');
  return cleanedFileName.endsWith('.csv') || cleanedFileName.endsWith('.json') ? cleanedFileName : 'Unnamed Session';
}