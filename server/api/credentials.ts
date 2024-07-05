import type { CredentialsDTO } from "~/types/credentials";

export default defineEventHandler(async () => {
  return (
    (await useStorage("data").getItem<CredentialsDTO>("credentials")) ?? {}
  );
});
