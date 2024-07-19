export default async function () {
  const { query } = useRoute();
  if (query.key) {
    return {
      initialValues: (
        await useFetch(`/api/credentials/authorization-code/${query.key}`)
      ).data,
      key: query.key as string,
    };
  }
  return {
    initialValues: null,
    key: null,
  };
}
