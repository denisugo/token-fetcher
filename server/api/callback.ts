import type { AuthorizationCodeCredentialsDto } from "~/types/credentials";
import type { ErrorData } from "~/types/error";
import type { TokensResponseDto } from "~/types/tokens";
import buildQueryForTokens from "~/utils/build-query-for-tokens";
import stringToBase64 from "~/utils/string-to-base64";

export default defineEventHandler(async (event) => {
  const { clientId, clientSecret, tokenEndpoint, callbackUri } =
    (await useStorage("data").getItem<AuthorizationCodeCredentialsDto>(
      "credentials-authorization-code",
    ))!;

  const { code } = getQuery<{ code: string }>(event);

  const authoriazation = stringToBase64(`${clientId}:${clientSecret}`);
  const headers = new Headers();
  headers.append("Authorization", `Basic ${authoriazation}`);
  headers.append("Content-Type", "application/x-www-form-urlencoded");

  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "authorization_code");
  urlencoded.append("redirect_uri", callbackUri!);
  urlencoded.append("code", code);

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
