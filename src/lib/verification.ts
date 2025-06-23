// lib/verification.ts
import crypto from 'crypto';

/**
 * Generate a unique verification code for certificates
 * Format: VF-XXXXXX (VF = VeriFy, followed by 6 random characters)
 */
export function generateVerificationCode(): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = 'VF-';
  
  for (let i = 0; i < 6; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return code;
}

/**
 * Generate a hash for certificate content to ensure integrity
 */
export function generateCertificateHash(data: {
  recipientName: string;
  eventTitle: string;
  issueDate: string;
  verificationCode: string;
}): string {
  const content = `${data.recipientName}-${data.eventTitle}-${data.issueDate}-${data.verificationCode}`;
  return crypto.createHash('sha256').update(content).digest('hex');
}

/**
 * Verify certificate hash integrity
 */
export function verifyCertificateHash(
  hash: string,
  data: {
    recipientName: string;
    eventTitle: string;
    issueDate: string;
    verificationCode: string;
  }
): boolean {
  const expectedHash = generateCertificateHash(data);
  return hash === expectedHash;
}
