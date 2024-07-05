import type { CredentialsDTO } from "~/types/credentials";

export default defineEventHandler(async (event) => {
  const body = await readBody<CredentialsDTO>(event);
  const credentials = {
    grantType: body.grantType,
    clientId: body.clientId,
    clientSecret: body.clientSecret,
    tokenUri: body.tokenUri,
    callbackUri: body.callbackUri,
  };
  await useStorage("data").setItem("credentials", credentials);
});
