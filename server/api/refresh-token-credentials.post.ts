import type { RefreshTokenCredentialsDto } from "~/types/credentials";

export default defineEventHandler(async (event) => {
  await useStorage("data").setItem(
    "credentials-refresh-token",
    await readBody<RefreshTokenCredentialsDto>(event),
  );
});
