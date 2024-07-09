import type { RefreshTokenCredentialsDto } from "~/types/credentials";

export default defineEventHandler(async () => {
  return (
    (await useStorage("data").getItem<RefreshTokenCredentialsDto>(
      "credentials-refresh-token",
    )) ?? {}
  );
});
