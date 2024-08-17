import type { RefreshTokenCredentialsDto } from "~/types/credentials";

export default defineEventHandler(async (event) => {
  const key = getRouterParam(event, "key");
  await useStorage("data").setItem(
    `credentials:refresh-token:${key}`,
    await readBody<RefreshTokenCredentialsDto>(event),
  );
});
