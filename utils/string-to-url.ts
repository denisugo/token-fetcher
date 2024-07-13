export default function (uri: string) {
  try {
    const url = new URL(uri);
    return url;
  } catch {
    return null;
  }
}
