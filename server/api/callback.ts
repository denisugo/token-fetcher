import type { CredentialsDTO } from "~/types/credentials";
import type { TokensDto } from "~/types/tokens";

export default defineEventHandler(async (event) => {
  const { grantType, clientId, clientSecret, tokenUri, callbackUri } =
    (await useStorage("data").getItem<CredentialsDTO>("credentials"))!;

  const { code } = getQuery<{ code: string }>(event);

  const authoriazation = toBase64(`${clientId}:${clientSecret}`);
  const headers = new Headers();
  headers.append("Authorization", `Basic ${authoriazation}`);
  headers.append("Content-Type", "application/x-www-form-urlencoded");

  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", grantType!.toLowerCase().replace(" ", "_"));
  urlencoded.append("redirect_uri", callbackUri!);
  urlencoded.append("code", code);

  console.log(urlencoded);

  let tokens: TokensDto | null = null;
  try {
    tokens = await $fetch(tokenUri!, {
      method: "POST",
      headers,
      body: urlencoded,
    });
  } catch (e) {
    console.log(e);
    // TODO catch the error
  }
  if (tokens) await useStorage("data").setItem("tokens", tokens);

  await sendRedirect(event, "/tokens");
});
