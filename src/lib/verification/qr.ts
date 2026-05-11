export function getAppBaseUrl() {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_URL ||
    "http://localhost:3000"
  ).replace(/\/+$/, "");
}

export function buildVerifyUrl(code: string) {
  return `${getAppBaseUrl()}/verify/${encodeURIComponent(code)}`;
}

export function buildQrImageUrl(code: string) {
  const verifyUrl = buildVerifyUrl(code);
  return `https://quickchart.io/qr?text=${encodeURIComponent(verifyUrl)}&size=180`;
}

export function encodeForCloudinaryFetch(url: string) {
  return Buffer.from(url)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}
