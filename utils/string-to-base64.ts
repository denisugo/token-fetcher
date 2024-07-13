export default function (str: string) {
  if (import.meta.server) return Buffer.from(str, "utf-8").toString("base64");
  return window.btoa(str);
}
