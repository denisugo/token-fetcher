import type { PkceCredentialsDto } from "~/types/credentials";

export default defineEventHandler(async (event) => {
  await useStorage("data").setItem(
    "callback-credentials:pkce",
    await readBody<PkceCredentialsDto>(event),
  );
});
