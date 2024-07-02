import type { CredentialsDTO } from "~/types/credentials";
import type { TokensDto } from "~/types/tokens";

export default defineEventHandler(async (event) => {
  const { grantType, clientId, clientSecret, tokenUri, callbackUri } = (
    global as any
  ).credentials as CredentialsDTO;

  const { code } = getQuery<{ code: string }>(event);

  const authoriazation = toBase64(`${clientId}:${clientSecret}`);
  const headers = new Headers();
  headers.append("Authorization", `Basic ${authoriazation}`);
  headers.append("Content-Type", "application/x-www-form-urlencoded");

  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", grantType);
  urlencoded.append("redirect_uri", callbackUri);
  urlencoded.append("code", code);

  const tokens: TokensDto = await $fetch(tokenUri, {
    method: "POST",
    headers,
    body: urlencoded,
  });

  (global as any).tokens = tokens;

  await sendRedirect(event, "/tokens");
});
