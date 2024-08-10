type GrantType = "authorization-code" | "refresh-token" | "pkce";

export default async function <T>(grantType: GrantType) {
  const { query } = useRoute();
  if (query.key) {
    return {
      initialValues: (
        await useFetch(`/api/credentials/${grantType}/${query.key}`)
      ).data as globalThis.Ref<T | null>,
      key: query.key as string,
    };
  }
  return {
    initialValues: null,
    key: null,
  };
}
