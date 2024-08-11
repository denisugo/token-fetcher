export default defineEventHandler(async (event) => {
  const key = getRouterParam(event, "key");
  await useStorage("data").removeItem(`credentials:pkce:${key}`);
});
