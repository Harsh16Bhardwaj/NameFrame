"use client";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Search, CheckCircle2, XCircle, Calendar, User, Mail, Award, ExternalLink, ShieldCheck } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface VerificationResult {
  verified: boolean;
  certificate?: {
    recipientName: string;
    recipientEmail: string;
    eventTitle: string;
    issueDate: string;
    createdAt: string;
    issuer: {
      name: string;
      email: string;
    };
    verificationCode: string;
    certificateUrl?: string;
  };
  error?: string;
}

function VerifyPageContent() {
  const [verificationCode, setVerificationCode] = useState("");
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const verifyCode = useCallback(async (code: string) => {
    if (!code.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch(`/api/verify/${code.trim()}`);
      const data = await response.json();
      setResult(data);
    } catch {
      setResult({
        verified: false,
        error: "Failed to verify certificate. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }, []);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    await verifyCode(verificationCode);
  };

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code || verificationCode) return;
    setVerificationCode(code);
  }, [searchParams, verificationCode]);

  useEffect(() => {
    const code = searchParams.get("code");
    if (!code || loading) return;
    if (verificationCode.trim() && !result) verifyCode(verificationCode);
  }, [verificationCode, loading, result, searchParams, verifyCode]);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200">
      <div className="container mx-auto max-w-5xl px-4 py-16">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-teal-300">
            <ShieldCheck className="h-3.5 w-3.5" />
            NameFrame Verify
          </div>
          <h1 className="mb-3 text-4xl font-bold text-white">Certificate Verification</h1>
          <p className="mx-auto max-w-2xl text-zinc-400">
            Enter certificate verification code. We validate against issuer data and event records.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-900 p-6"
        >
          <form onSubmit={handleVerify} className="space-y-4">
            <label className="block text-sm font-medium text-zinc-300">Verification Code</label>
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter code (e.g. VF-ABC123)"
                className="w-full rounded-lg border border-zinc-700 bg-zinc-950 py-3 pl-10 pr-4 text-white placeholder:text-zinc-500 focus:border-teal-400 focus:outline-none focus:ring-2 focus:ring-teal-400/20"
                disabled={loading}
              />
            </div>
            <button
              type="submit"
              disabled={loading || !verificationCode.trim()}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-teal-400 px-4 py-3 font-semibold text-black transition hover:bg-teal-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" />
                  Verifying...
                </>
              ) : (
                <>
                  <Search size={16} />
                  Verify Certificate
                </>
              )}
            </button>
          </form>
        </motion.div>

        {result && (
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
            {result.verified && result.certificate ? (
              <div className="rounded-2xl border border-teal-500/30 bg-zinc-900 p-6">
                <div className="mb-6 flex items-center gap-3">
                  <CheckCircle2 size={30} className="text-teal-300" />
                  <div>
                    <h2 className="text-2xl font-bold text-teal-300">Certificate Verified</h2>
                    <p className="text-sm text-zinc-400">This certificate is valid and recorded.</p>
                  </div>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <div className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">Certificate</h3>
                    <div className="flex items-center gap-3"><User size={16} className="text-teal-300" /><span>{result.certificate.recipientName}</span></div>
                    <div className="flex items-center gap-3"><Award size={16} className="text-teal-300" /><span>{result.certificate.eventTitle}</span></div>
                    <div className="flex items-center gap-3"><Calendar size={16} className="text-teal-300" /><span>{new Date(result.certificate.issueDate).toLocaleDateString()}</span></div>
                  </div>

                  <div className="space-y-3 rounded-xl border border-zinc-800 bg-zinc-950 p-4">
                    <h3 className="text-sm font-semibold uppercase tracking-wide text-zinc-400">Issuer</h3>
                    <div className="flex items-center gap-3"><User size={16} className="text-teal-300" /><span>{result.certificate.issuer.name}</span></div>
                    <div className="flex items-center gap-3"><Mail size={16} className="text-teal-300" /><span>{result.certificate.issuer.email}</span></div>
                    <div className="font-mono text-sm text-zinc-300">Code: {result.certificate.verificationCode}</div>
                  </div>
                </div>

                {result.certificate.certificateUrl && (
                  <div className="mt-6">
                    <button
                      onClick={() => window.open(result.certificate?.certificateUrl, "_blank")}
                      className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-800 px-4 py-2 text-sm text-zinc-100 hover:border-teal-500/40 hover:text-teal-300"
                    >
                      <ExternalLink size={16} />
                      View Certificate
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-2xl border border-red-500/30 bg-zinc-900 p-6">
                <div className="mb-4 flex items-center gap-3">
                  <XCircle size={30} className="text-red-400" />
                  <div>
                    <h2 className="text-2xl font-bold text-red-400">Certificate Not Verified</h2>
                    <p className="text-sm text-zinc-400">{result.error || "Invalid or missing verification code."}</p>
                  </div>
                </div>
                <ul className="list-disc space-y-1 pl-5 text-sm text-zinc-300">
                  <li>Verification code may be incorrect.</li>
                  <li>Certificate may not be issued yet.</li>
                  <li>Contact issuer for clarification.</li>
                </ul>
              </div>
            )}
          </motion.div>
        )}

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-8 text-center">
          <button onClick={() => router.push("/")} className="text-sm text-zinc-400 underline transition hover:text-zinc-200">
            Back to NameFrame
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-950 text-zinc-200" />}>
      <VerifyPageContent />
    </Suspense>
  );
}
