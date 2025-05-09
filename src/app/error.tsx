"use client";

import React from "react";

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8f8f8' }}>
      <h1 style={{ color: '#d32f2f', fontSize: '2.5rem', marginBottom: '1rem' }}>Something went wrong!</h1>
      <p style={{ color: '#333', marginBottom: '2rem' }}>{error.message || "An unexpected error occurred. Please try again."}</p>
      <button
        onClick={() => reset()}
        style={{ padding: '0.75rem 2rem', background: '#1976d2', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '1rem', cursor: 'pointer' }}
      >
        Try Again
      </button>
    </div>
  );
} 