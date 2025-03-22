'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function SessionList() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    async function fetchSessions() {
      const response = await fetch('/api/sessions');
      const data = await response.json();
      setSessions(data);
    }
    fetchSessions();
  }, []);

  return (
    <ul className="space-y-4">
      {sessions.map((session) => (
        <li key={session._id} className="border p-4 rounded">
          <Link href={`/session/${session._id}`} className="text-blue-500 hover:underline">
            {session.dataset_name || 'Unnamed Session'}
          </Link>
          <p className="text-sm text-gray-500">Created: {new Date(session.created_at).toLocaleString()}</p>
        </li>
      ))}
    </ul>
  );
}