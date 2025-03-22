// app/api/proxy/route.js
import { NextResponse } from 'next/server';
export const maxDuration = 300;

export async function GET(request) {
  return handleRequest(request);
}

export async function POST(request) {
  return handleRequest(request);
}

// Add other HTTP methods as needed (PUT, DELETE, etc.)

async function handleRequest(request) {
  const { searchParams } = new URL(request.url);
  const endpoint = searchParams.get('endpoint');
  const API_KEY = process.env.API_KEY;

  if (!API_KEY) {
    return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
  }

  if (!endpoint) {
    return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 });
  }

  const headers = new Headers(request.headers);
  headers.set('Authorization', `Bearer ${API_KEY}`);
  headers.set('Content-Type', 'application/json');

  try {
    const response = await fetch(endpoint, {
      method: request.method,
      headers: headers,
      body: ['GET', 'HEAD'].includes(request.method) ? null : await request.text(),
    });

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json({ error: 'An error occurred while proxying the request' }, { status: 500 });
  }
}