import crypto from "crypto";

const SECRET = process.env.APP_CREDENTIAL_ENCRYPTION_KEY || process.env.NEXTAUTH_SECRET || "dev-insecure-secret-change-me";

function getKey() {
  return crypto.createHash("sha256").update(SECRET).digest();
}

export function encryptText(plainText: string) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  return `${iv.toString("hex")}:${encrypted.toString("hex")}`;
}

export function decryptText(payload: string) {
  const [ivHex, encryptedHex] = payload.split(":");
  if (!ivHex || !encryptedHex) {
    throw new Error("Invalid encrypted payload");
  }
  const iv = Buffer.from(ivHex, "hex");
  const encrypted = Buffer.from(encryptedHex, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", getKey(), iv);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  return decrypted.toString("utf8");
}
