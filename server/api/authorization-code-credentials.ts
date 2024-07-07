import type { AuthorizationCodeCredentialsDTO } from "~/types/credentials";

export default defineEventHandler(async () => {
  return (
    (await useStorage("data").getItem<AuthorizationCodeCredentialsDTO>(
      "credentials-authorization-code",
    )) ?? {}
  );
});
