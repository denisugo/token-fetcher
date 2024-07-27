export default function (): [
  globalThis.Ref<boolean>,
  (val: boolean) => boolean,
] {
  const loading = useState("loading", () => false);

  const setLoading = (val: boolean) => (loading.value = val);

  return [loading, setLoading];
}
