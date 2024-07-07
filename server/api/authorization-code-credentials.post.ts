import type { AuthorizationCodeCredentialsDTO } from "~/types/credentials";

export default defineEventHandler(async (event) => {
  const body = await readBody<AuthorizationCodeCredentialsDTO>(event);
  const credentials: AuthorizationCodeCredentialsDTO = {
    clientId: body.clientId,
    clientSecret: body.clientSecret,
    tokenUri: body.tokenUri,
    callbackUri: body.callbackUri,
    authUri: body.authUri,
    responseType: body.responseType,
    scope: body.scope,
  };
  await useStorage("data").setItem(
    "credentials-authorization-code",
    credentials,
  );
});
