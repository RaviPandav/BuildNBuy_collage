import React from 'react';

const LoadError = ({ message, onRetry }) => (
  <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-5 text-center">
    <p className="font-semibold text-red-700">Could not load data</p>
    <p className="mt-1 text-sm text-red-700">
      {message || 'Check that the backend is running and connected to MongoDB.'}
    </p>
    {onRetry && (
      <button type="button" onClick={onRetry} className="mt-3 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white hover:bg-red-800">
        Try again
      </button>
    )}
  </div>
);

export default LoadError;
