export default function (base64Str: string) {
  if (import.meta.server)
    return Buffer.from(base64Str, "base64").toString("utf-8");
  return window.atob(base64Str);
}
