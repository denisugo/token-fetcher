import type { AuthorizationCodeCredentialsDto } from "~/types/credentials";

export default defineEventHandler(async () => {
  return (
    (await useStorage("data").getItem<AuthorizationCodeCredentialsDto>(
      "credentials-authorization-code",
    )) ?? {}
  );
});
