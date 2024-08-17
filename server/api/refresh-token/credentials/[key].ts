import type { RefreshTokenCredentialsDto } from "~/types/credentials";

export default defineEventHandler(async (event) => {
  const key = getRouterParam(event, "key");
  return (
    (await useStorage("data").getItem<RefreshTokenCredentialsDto>(
      `credentials:refresh-token:${key}`,
    )) ?? {}
  );
});
