import { NextResponse } from 'next/server';
import { fetchWithAuth } from '@/utils/herokuapi';

export async function POST(request) {
  try {
    const { datasetUrl } = await request.json();

    const response = await fetchWithAuth(process.env.FLASK_API_SERVER + '/api/summarize', {
      method: 'POST',

      body: JSON.stringify({ datasetUrl }),
    });

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to summarize dataset' }, { status: response.status });
    }

    const summaryData = await response.json();

    // Return summary data
    return NextResponse.json(summaryData);
  } catch (error) {
    console.error('Error summarizing dataset:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
