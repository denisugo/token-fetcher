type GrantType = "authorization-code" | "refresh-token" | "pkce";

export default async function <T>(grantType: GrantType) {
  const { query } = useRoute();
  if (query.key) {
    return {
      initialValues: (
        await useFetch(`/api/${grantType}/credentials/${query.key}`)
      ).data as globalThis.Ref<T | null>,
      key: base64ToString(query.key as string),
    };
  }
  return {
    initialValues: null,
    key: import.meta.client ? Date.now().toString() : "",
  };
}
