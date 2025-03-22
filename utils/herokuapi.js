// utils/api.js
const PROXY_BASE_URL = '/api/proxy'; // This is our local proxy endpoint

export async function fetchWithAuth(endpoint, options = {}) {
  const url = `${PROXY_BASE_URL}?endpoint=${encodeURIComponent(endpoint)}`;
  console.log('Requesting URL:', url); // Debug log

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  console.log('Request headers:', headers); // Debug log

  try {
    const proxyResponse = await fetch(url, {
      ...options,
      headers,
    });

    // Create a new response object that mimics the structure of a native fetch response
    const response = {
      ok: proxyResponse.ok,
      status: proxyResponse.status,
      statusText: proxyResponse.statusText,
      headers: proxyResponse.headers,
      json: async () => {
        const contentType = proxyResponse.headers.get("content-type");
        if (contentType && contentType.indexOf("application/json") !== -1) {
          return await proxyResponse.json();
        } else {
          const text = await proxyResponse.text();
          try {
            return JSON.parse(text);
          } catch {
            throw new Error('Response is not JSON');
          }
        }
      },
      text: () => proxyResponse.text(),
    };

    return response;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}