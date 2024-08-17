import type { AuthorizationCodeCredentialsDto } from "~/types/credentials";

export default defineEventHandler(async (event) => {
  const key = getRouterParam(event, "key");
  return (
    (await useStorage("data").getItem<AuthorizationCodeCredentialsDto>(
      `credentials:authorization-code:${key}`,
    )) ?? {}
  );
});
