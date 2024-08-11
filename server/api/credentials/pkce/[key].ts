import type { PkceCredentialsDto } from "~/types/credentials";

export default defineEventHandler(async (event) => {
  const key = getRouterParam(event, "key");
  return (
    (await useStorage("data").getItem<PkceCredentialsDto>(
      `credentials:pkce:${key}`,
    )) ?? {}
  );
});
