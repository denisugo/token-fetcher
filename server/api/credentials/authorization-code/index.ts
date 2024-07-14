import type { AuthorizationCodeCredentialsDto } from "~/types/credentials";

export default defineEventHandler(async (event) => {
  const { key } = getQuery<{ key: string }>(event);
  return (
    (await useStorage("data").getItem<AuthorizationCodeCredentialsDto>(
      `credentials:authorization-code:${key}`,
    )) ?? {}
  );
});
