import type { AuthorizationCodeCredentialsDTO } from "~/types/credentials";

export default defineEventHandler(async (event) => {
  await useStorage("data").setItem(
    "credentials-authorization-code",
    await readBody<AuthorizationCodeCredentialsDTO>(event),
  );
});
