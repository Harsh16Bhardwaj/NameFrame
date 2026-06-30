"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function AnalyticsDevGatePage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("/api/admin/dev-auth", { password });
      if (res.data?.success) {
        router.push("/admin");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError((err.response?.data as { error?: string } | undefined)?.error || "Access denied");
      } else {
        setError("Access denied");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07080d] text-zinc-100 px-6 py-24">
      <div className="mx-auto max-w-lg rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-teal-300">Dev Access</p>
        <h1 className="mt-2 text-2xl font-bold">Admin Route</h1>
        <p className="mt-2 text-sm text-zinc-400">Enter `DEV_PASS` to continue to `/admin`.</p>
        <form onSubmit={submit} className="mt-5 space-y-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2"
            required
          />
          {error ? <p className="text-sm text-rose-400">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-teal-500 px-3 py-2 font-semibold text-zinc-950 disabled:opacity-60"
          >
            {loading ? "Checking..." : "Enter Admin"}
          </button>
        </form>
      </div>
    </div>
  );
}
