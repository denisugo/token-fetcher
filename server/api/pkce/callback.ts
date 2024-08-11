import type { PkceCredentialsDto } from "~/types/credentials";
import type { ErrorData } from "~/types/error";
import type { TokensResponseDto } from "~/types/tokens";
import buildQueryForTokens from "~/utils/build-query-for-tokens";

export default defineEventHandler(async (event) => {
  const { clientId, codeVerifier, callbackEndpoint, tokenEndpoint } =
    (await useStorage("data").getItem<PkceCredentialsDto>(
      "callback-credentials:pkce",
    ))!;

  const { code } = getQuery<{ code: string }>(event);

  const headers = new Headers();
  headers.append("Content-Type", "application/x-www-form-urlencoded");

  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "authorization_code");
  urlencoded.append("redirect_uri", callbackEndpoint!);
  urlencoded.append("client_id", clientId!);
  urlencoded.append("code", code);
  urlencoded.append("code_verifier", codeVerifier!);

  try {
    const { access_token, id_token, refresh_token }: TokensResponseDto =
      await $fetch(tokenEndpoint!, {
        method: "POST",
        headers,
        body: urlencoded,
      });
    await sendRedirect(
      event,
      `/tokens?${buildQueryForTokens(access_token, id_token, refresh_token)}`,
    );
  } catch (e) {
    const data: ErrorData = { originalErrorMessage: (e as Error).message };
    throw createError({
      statusCode: 500,
      statusMessage: "Unable to fetch tokens",
      data,
    });
  }
});
