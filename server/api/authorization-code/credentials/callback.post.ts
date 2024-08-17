import type { AuthorizationCodeCredentialsDto } from "~/types/credentials";

export default defineEventHandler(async (event) => {
  await useStorage("data").setItem(
    "callback-credentials:authorization-code",
    await readBody<AuthorizationCodeCredentialsDto>(event),
  );
});
