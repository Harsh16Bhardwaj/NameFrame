"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, CheckCircle, XCircle, Calendar, User, Mail, Award, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';

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

export default function VerifyPage() {
  const [verificationCode, setVerificationCode] = useState('');
  const [result, setResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await fetch(`/api/verify/${verificationCode.trim()}`);
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Verification error:', error);
      setResult({
        verified: false,
        error: 'Failed to verify certificate. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#080711] to-[#0e1015] text-[#c5c3c4]">
      <div className="container mx-auto max-w-4xl px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold text-white mb-4">
            Certificate Verification
          </h1>
          <p className="text-xl text-[#b7a2c9] mb-2">
            Verify the authenticity of certificates issued by NameFrame
          </p>
          <p className="text-[#c5c3c4]/70">
            Enter the verification code found on your certificate to confirm its authenticity
          </p>
        </motion.div>

        {/* Verification Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#322f42]/30 backdrop-blur-md rounded-2xl p-8 mb-8 border border-[#4b3a70]/30"
        >
          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-[#c5c3c4] mb-3">
                Verification Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  placeholder="Enter verification code (e.g., VF-ABC123)"
                  className="w-full px-4 py-3 pl-12 bg-[#272936] border border-[#4b3a70]/50 rounded-lg text-white placeholder-[#c5c3c4]/50 focus:border-[#b7a2c9] focus:outline-none focus:ring-2 focus:ring-[#b7a2c9]/20"
                  disabled={loading}
                />
                <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#c5c3c4]/50" />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading || !verificationCode.trim()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-6 bg-[#b7a2c9] text-white rounded-lg font-medium transition-all duration-200 hover:bg-[#a690b8] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Verifying...
                </>
              ) : (
                <>
                  <Search size={20} />
                  Verify Certificate
                </>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Verification Result */}
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl p-8 border ${
              result.verified
                ? 'bg-green-900/20 border-green-500/30'
                : 'bg-red-900/20 border-red-500/30'
            }`}
          >
            {result.verified && result.certificate ? (
              <div>
                {/* Success Header */}
                <div className="flex items-center gap-3 mb-6">
                  <CheckCircle size={32} className="text-green-400" />
                  <div>
                    <h2 className="text-2xl font-bold text-green-400">Certificate Verified ✓</h2>
                    <p className="text-green-300">This certificate is authentic and valid</p>
                  </div>
                </div>

                {/* Certificate Details */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Certificate Details</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <User size={18} className="text-[#b7a2c9]" />
                          <div>
                            <p className="text-sm text-[#c5c3c4]/70">Recipient</p>
                            <p className="text-white font-medium">{result.certificate.recipientName}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <Award size={18} className="text-[#b7a2c9]" />
                          <div>
                            <p className="text-sm text-[#c5c3c4]/70">Event</p>
                            <p className="text-white font-medium">{result.certificate.eventTitle}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Calendar size={18} className="text-[#b7a2c9]" />
                          <div>
                            <p className="text-sm text-[#c5c3c4]/70">Issue Date</p>
                            <p className="text-white font-medium">
                              {new Date(result.certificate.issueDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">Issuer Information</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <User size={18} className="text-[#b7a2c9]" />
                          <div>
                            <p className="text-sm text-[#c5c3c4]/70">Issued by</p>
                            <p className="text-white font-medium">{result.certificate.issuer.name}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Mail size={18} className="text-[#b7a2c9]" />
                          <div>
                            <p className="text-sm text-[#c5c3c4]/70">Contact</p>
                            <p className="text-white font-medium">{result.certificate.issuer.email}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Search size={18} className="text-[#b7a2c9]" />
                          <div>
                            <p className="text-sm text-[#c5c3c4]/70">Verification Code</p>
                            <p className="text-white font-mono font-medium">{result.certificate.verificationCode}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Certificate Actions */}
                {result.certificate.certificateUrl && (
                  <div className="mt-6 pt-6 border-t border-green-500/20">
                    <button
                      onClick={() => window.open(result.certificate?.certificateUrl, '_blank')}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-[#b7a2c9] text-white rounded-lg hover:bg-[#a690b8] transition-colors"
                    >
                      <ExternalLink size={18} />
                      View Certificate
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div>
                {/* Error Header */}
                <div className="flex items-center gap-3 mb-4">
                  <XCircle size={32} className="text-red-400" />
                  <div>
                    <h2 className="text-2xl font-bold text-red-400">Certificate Not Verified</h2>
                    <p className="text-red-300">
                      {result.error || 'The verification code is invalid or the certificate was not found'}
                    </p>
                  </div>
                </div>

                <div className="bg-red-900/20 border border-red-500/20 rounded-lg p-4">
                  <h3 className="font-semibold text-red-300 mb-2">Possible reasons:</h3>
                  <ul className="list-disc list-inside space-y-1 text-red-200/80">
                    <li>The verification code is incorrect or expired</li>
                    <li>The certificate has not been officially issued</li>
                    <li>The certificate may be fraudulent</li>
                  </ul>
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* How to Find Verification Code */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12 bg-[#272936]/50 rounded-xl p-6"
        >
          <h3 className="text-xl font-semibold text-white mb-4">How to find your verification code?</h3>
          <div className="space-y-3 text-[#c5c3c4]">
            <p>• The verification code is usually printed on your certificate</p>
            <p>• Look for a code starting with "VF-" followed by alphanumeric characters</p>
            <p>• Check your email for the certificate with the verification code</p>
            <p>• Contact the certificate issuer if you cannot locate the code</p>
          </div>
        </motion.div>

        {/* Back to Home */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 text-center"
        >
          <button
            onClick={() => router.push('/')}
            className="text-[#b7a2c9] hover:text-white transition-colors underline"
          >
            ← Back to NameFrame
          </button>
        </motion.div>
      </div>
    </div>
  );
}
