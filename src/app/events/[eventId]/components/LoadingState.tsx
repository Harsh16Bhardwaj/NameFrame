import React from 'react';

export default function LoadingState() {
  return (
    <div className="flex h-screen items-center justify-center bg-[#212531]">
      <div className="flex flex-col items-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-transparent border-[#b7a2c9]"></div>
        <p className="mt-4 text-[#c5c3c4]">Loading event data...</p>
      </div>
    </div>
  );
}