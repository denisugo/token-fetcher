import crypto from "crypto";

export default function (): [verifier: string, challenge: string] {
  const verifier = base64URLEncode(crypto.randomBytes(32));
  const challenge = base64URLEncode(sha256(verifier));
  return [verifier, challenge];
}

// Stolen from https://auth0.com/docs/get-started/authentication-and-authorization-flow/authorization-code-flow-with-pkce/call-your-api-using-the-authorization-code-flow-with-pkce

function base64URLEncode(buffer: Buffer) {
  return buffer
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

function sha256(buffer: crypto.BinaryLike) {
  return crypto.createHash("sha256").update(buffer).digest();
}
