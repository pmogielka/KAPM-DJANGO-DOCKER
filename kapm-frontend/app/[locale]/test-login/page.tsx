'use client';

import { useState } from 'react';

export default function TestLoginPage() {
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testLogin = async () => {
    setResult(null);
    setError(null);

    try {
      const response = await fetch('http://localhost:8004/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'admin',
          password: 'admin123'
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Test logowania</h1>

      <button
        onClick={testLogin}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Test Login (admin/admin123)
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      {result && (
        <div className="mt-4 p-4 bg-green-100 text-green-700 rounded">
          <p>Login successful!</p>
          <pre className="mt-2 text-sm">{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}

      <div className="mt-8 p-4 bg-gray-100 rounded">
        <h2 className="font-bold mb-2">Informacje debugowania:</h2>
        <ul className="text-sm">
          <li>API URL: http://localhost:8004/api/auth/login/</li>
          <li>Username: admin</li>
          <li>Password: admin123</li>
          <li>NEXT_PUBLIC_API_URL: {process.env.NEXT_PUBLIC_API_URL}</li>
        </ul>
      </div>
    </div>
  );
}