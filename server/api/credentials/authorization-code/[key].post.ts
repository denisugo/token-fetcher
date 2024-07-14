import type { AuthorizationCodeCredentialsDto } from "~/types/credentials";

export default defineEventHandler(async (event) => {
  const key = getRouterParam(event, "key");
  await useStorage("data").setItem(
    `credentials:authorization-code:${key}`,
    await readBody<AuthorizationCodeCredentialsDto>(event),
  );
});
