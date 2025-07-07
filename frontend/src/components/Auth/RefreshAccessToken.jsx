import React, { useState } from 'react';
import { refreshAccessToken } from '../../services/authServices.js';
import { Button } from '../index.js'; // ya tumhara custom button path

const RefreshAccessToken = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleRefresh = async () => {
    setMessage('');
    setError('');

    try {
      const response = await refreshAccessToken();
      setMessage("✅ Token refreshed successfully!");
      console.log("New tokens:", response); // optional
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err.message ||
        "❌ Could not refresh token."
      );
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 mt-8">
      <Button
        onClick={handleRefresh}
        className="bg-emerald-600 hover:bg-emerald-700 text-white"
      >
        Refresh Access Token
      </Button>

      {message && <p className="text-green-500 text-sm">{message}</p>}
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default RefreshAccessToken;
