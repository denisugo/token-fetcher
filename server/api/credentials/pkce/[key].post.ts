import type { PkceCredentialsDto } from "~/types/credentials";

export default defineEventHandler(async (event) => {
  const key = getRouterParam(event, "key");
  await useStorage("data").setItem(
    `credentials:pkce:${key}`,
    await readBody<PkceCredentialsDto>(event),
  );
});
