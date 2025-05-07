import React from 'react';
import { useRouter } from 'next/navigation';

interface ErrorStateProps {
  error: string;
}

export default function ErrorState({ error }: ErrorStateProps) {
  const router = useRouter();
  
  return (
    <div className="flex h-screen items-center justify-center bg-[#212531]">
      <div className="max-w-md rounded-xl bg-[#322f42] p-8 text-center shadow-lg">
        <h2 className="mb-4 text-2xl font-bold text-red-400">Error Loading Event</h2>
        <p className="mb-6 text-[#c5c3c4]">{error || "Event not found"}</p>
        <button
          onClick={() => router.push("/dashboard")}
          className="rounded-lg bg-[#4b3a70] px-6 py-3 text-white transition-all hover:bg-[#5d4b82]"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}