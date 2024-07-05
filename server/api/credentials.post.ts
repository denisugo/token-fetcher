import type { CredentialsDTO } from "~/types/credentials";

export default defineEventHandler(async (event) => {
  const body = await readBody<CredentialsDTO>(event);
  const credentials: CredentialsDTO = {
    grantType: body.grantType,
    clientId: body.clientId,
    clientSecret: body.clientSecret,
    tokenUri: body.tokenUri,
    callbackUri: body.callbackUri,
    authUri: body.authUri,
    identityPorvider: body.identityPorvider,
    responseType: body.responseType,
    scope: body.scope,
  };
  await useStorage("data").setItem("credentials", credentials);
});
