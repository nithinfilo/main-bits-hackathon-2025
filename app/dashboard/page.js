"use client"
import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ButtonAccount from '@/components/ButtonAccount';
import Image from 'next/image';
import Link from 'next/link';
import { IconHome, IconBrandTwitter, IconCoin, IconUpload, IconChevronDown, IconDatabase } from '@tabler/icons-react';
import { useDropzone } from 'react-dropzone';
import SQLConnectionModal from '@/components/SQLConnectionModal';
import SQLTableSelectionModal from '@/components/SQLTableSelectionModal';
import MongoDBConnectionModal from '@/components/MongoDBConnectionModal';
import { EvervaultCard } from '@/components/ui/evervault-card';
import { WobbleCard } from '@/components/ui/wobble-card';
import { BackgroundBeams } from '@/components/ui/background-beams';

const FLASK_API_SERVER = process.env.NEXT_PUBLIC_FLASK_API_SERVER || 'http://localhost:5001';

const Dashboard = ({ config, logo }) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [credits, setCredits] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [showSQLModal, setShowSQLModal] = useState(false);
  const [showSQLTableModal, setShowSQLTableModal] = useState(false);
  const [showMongoDBModal, setShowMongoDBModal] = useState(false);
  const [sqlTables, setSqlTables] = useState([]);
  const [sqlConnectionData, setSqlConnectionData] = useState(null);
  const [datasets] = useState([
    { label: "Google Sheets", url: null },
    { label: "MySQL Database", url: null },
    { label: "MongoDB Database", url: null },
  ]);

  useEffect(() => {
    const fetchCredits = async () => {
      const response = await fetch('/api/credits');
      const data = await response.json();
      setCredits(data.credits);
    };
    fetchCredits();
  }, []);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchSessions();
    }
  }, [status]);

  const fetchSessions = async () => {
    try {
      const response = await fetch('/api/sessions');
      if (response.ok) {
        const data = await response.json();
        setSessions(data);
      } else {
        console.error('Failed to fetch sessions');
      }
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };



  const handleFileUpload = async (file) => {
    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (uploadResponse.ok) {
        const { url } = await uploadResponse.json();
        const sessionResponse = await fetch('/api/sessions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ datasetUrl: url }),
        });

        if (sessionResponse.ok) {
          const sessionData = await sessionResponse.json();
          router.push(`/session/${sessionData._id}`);
        } else {
          throw new Error('Failed to create session');
        }
      } else {
        throw new Error('File upload failed');
      }
    } catch (error) {
      console.error('Error uploading file or creating session:', error);
      alert('Failed to upload file or create session. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };



  const handleSQLConnection = async (connectionData) => {
    setShowSQLModal(false);
    setIsUploading(true);

    try {
      const response = await fetch('/api/sql-connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(connectionData),
      });

      if (response.ok) {
        const { tables } = await response.json();
        setSqlTables(tables);
        setSqlConnectionData(connectionData);
        setShowSQLTableModal(true);
      } else {
        throw new Error('Failed to connect to the database');
      }
    } catch (error) {
      console.error('Error connecting to SQL database:', error);
      alert('Failed to connect to the database. Please check your credentials and try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSQLTableSelection = async (tableName) => {
    setShowSQLTableModal(false);
    setIsUploading(true);

    try {
      const response = await fetch('/api/sql-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...sqlConnectionData, tableName }),
      });

      if (response.ok) {
        const { url } = await response.json();
        const sessionResponse = await fetch('/api/sessions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ datasetUrl: url }),
        });

        if (sessionResponse.ok) {
          const sessionData = await sessionResponse.json();
          router.push(`/session/${sessionData._id}`);
        } else {
          throw new Error('Failed to create session');
        }
      } else {
        throw new Error('Failed to query SQL table');
      }
    } catch (error) {
      console.error('Error processing SQL table:', error);
      alert('Failed to process SQL table. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleMongoDBConnection = async (connectionData) => {
    setShowMongoDBModal(false);
    setIsUploading(true);

    try {
      const response = await fetch('/api/mongodb-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(connectionData),
      });

      if (response.ok) {
        const { url } = await response.json();
        const sessionResponse = await fetch('/api/sessions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ datasetUrl: url }),
        });

        if (sessionResponse.ok) {
          const sessionData = await sessionResponse.json();
          router.push(`/session/${sessionData._id}`);
        } else {
          throw new Error('Failed to create session');
        }
      } else {
        throw new Error('Failed to query MongoDB collection');
      }
    } catch (error) {
      console.error('Error processing MongoDB collection:', error);
      alert('Failed to process MongoDB collection. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      handleFileUpload(acceptedFiles[0]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'application/json': ['.json']
    },
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const handleCardClick = (datasetType) => {
    switch (datasetType) {
      case 'MySQL Database':
        setShowSQLModal(true);
        break;
      case 'MongoDB Database':
        setShowMongoDBModal(true);
        break;
      default:
        break;
    }
  };

  const getFileNameFromUrl = (url) => {
    const decodedUrl = decodeURIComponent(url);
    const urlWithoutParams = decodedUrl.split('?')[0];
    const parts = urlWithoutParams.split('/');
    const fullFileName = parts.pop();
    const cleanedFileName = fullFileName.split('-').pop().replace(/%20/g, ' ').replace(/%28/g, '(').replace(/%29/g, ')');
    return cleanedFileName.endsWith('.csv') || cleanedFileName.endsWith('.json') ? cleanedFileName : 'Unnamed Session';
  };

  return (
    
    <div className="min-h-screen w-full bg-base-100 text-gray-100 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-base-200 border-b border-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">

                <span className="ml-2 text-xl font-semibold text-gray-100">Hackathon 2025</span>
            </div>
            <div className="flex items-center">

              <div className="flex items-center bg-gray-700 px-3 py-1 rounded-full ml-4">
                <IconCoin size={16} className="text-yellow-400" />
                <span className="ml-1 text-sm font-medium text-gray-100">{credits}</span>
              </div>
              {session && (
                <div className="ml-4 flex items-center">
                  <ButtonAccount />
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>



      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8 pt-20">
        <div className="px-4 py-6 sm:px-0">
          
          {/* Dataset Selection and Upload */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 max-w-7xl mx-auto w-full mb-4">

          <WobbleCard
  containerClassName="col-span-1 h-20 bg-orange-950"
  onClick={() => handleCardClick('MySQL Database')}
>
  <div className="flex items-center h-full px-6">

    <div className="flex flex-col justify-center">
      <h3 className="text-lg font-semibold text-white leading-tight">MySQL Database</h3>
      <p className="text-sm text-white/80 leading-tight">Connect your database</p>
    </div>
  </div>
</WobbleCard>
<WobbleCard
  containerClassName="col-span-1 h-20 bg-green-600"
  onClick={() => handleCardClick('MongoDB Database')}
>
  <div className="flex items-center h-full px-6">
    <div className="flex flex-col justify-center">
      <h3 className="text-lg font-semibold text-white leading-tight">MongoDB Database</h3>
      <p className="text-sm text-white/80 leading-tight">Connect your database</p>
    </div>
  </div>
</WobbleCard>
          
          {/* File Upload Area */}
          <WobbleCard containerClassName="col-span-1 lg:col-span-3 h-28 bg-base-200 relative">
  <div className="absolute inset-0 rounded-xl border-2 border-dashed border-gray-600 pointer-events-none"></div>
  <div
    {...getRootProps()}
    className="flex items-center justify-center h-full cursor-pointer px-6 relative z-10"
  >
    <input {...getInputProps()} />
    <IconUpload size={32} className="mr-6 text-gray-400" />
    <div>
      <p className="text-lg font-semibold mb-1 text-white leading-tight">
        {isDragActive ? 'Drop the file here' : 'Drag and drop your file here'}
      </p>
      <p className="text-sm text-gray-300 leading-tight">or click to select a file</p>
      <p className="text-xs text-gray-400 mt-1 leading-tight">Supported formats: CSV, JSON (Max 10MB)</p>
    </div>
  </div>
</WobbleCard>
        </div>
          
          {isUploading && (
            <div className="mt-4">
              <progress className="progress progress-primary w-full"></progress>
              <p className="text-center text-sm text-gray-400 mt-2">Uploading...</p>
            </div>
          )}

          {/* Recent Sessions */}
          <div className="bg-base-200 shadow-lg rounded-lg p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-100">Recent Sessions</h2>
            <div className="space-y-4">
              {sessions.length === 0 ? (
                <p className="text-gray-400">No recent sessions found.</p>
              ) : (
                <ul className="space-y-4">
                  {sessions.map((session) => (
                    <li key={session._id} className="border border-gray-700 p-4 rounded-lg hover:bg-gray-700 transition duration-150 ease-in-out">
                      <Link href={`/session/${session._id}`}>
                        <div className="cursor-pointer">
                          <h3 className="text-lg font-semibold text-gray-100">{getFileNameFromUrl(session.datasetUrl)}</h3>
                          <p className="text-gray-400">Created: {new Date(session.createdAt).toLocaleString()}</p>
                          <p className="text-gray-400">Goals: {session.goals ? session.goals.length : 0}</p>
                          <p className="text-gray-400">Visualizations: {session.visualizations ? session.visualizations.length : 0}</p>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </main>

      {showSQLModal && (
        <SQLConnectionModal
          onClose={() => setShowSQLModal(false)}
          onConnect={handleSQLConnection}
        />
      )}

      {showSQLTableModal && (
        <SQLTableSelectionModal
          onClose={() => setShowSQLTableModal(false)}
          onSelect={handleSQLTableSelection}
          tables={sqlTables}
        />
      )}

      {showMongoDBModal && (
        <MongoDBConnectionModal
          onClose={() => setShowMongoDBModal(false)}
          onConnect={handleMongoDBConnection}
        />
      )}
      
    </div>
    
  );
};

export default Dashboard;