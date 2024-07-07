import type { AuthorizationCodeCredentialsDTO } from "~/types/credentials";
import type { ErrorData } from "~/types/error";
import type { TokensResponseDto } from "~/types/tokens";

export default defineEventHandler(async (event) => {
  const { clientId, clientSecret, tokenUri, callbackUri } = (await useStorage(
    "data",
  ).getItem<AuthorizationCodeCredentialsDTO>(
    "credentials-authorization-code",
  ))!;

  const { code } = getQuery<{ code: string }>(event);

  const authoriazation = toBase64(`${clientId}:${clientSecret}`);
  const headers = new Headers();
  headers.append("Authorization", `Basic ${authoriazation}`);
  headers.append("Content-Type", "application/x-www-form-urlencoded");

  const urlencoded = new URLSearchParams();
  urlencoded.append("grant_type", "authorization_code");
  urlencoded.append("redirect_uri", callbackUri!);
  urlencoded.append("code", code);

  try {
    const { access_token, id_token, refresh_token }: TokensResponseDto =
      await $fetch(tokenUri!, {
        method: "POST",
        headers,
        body: urlencoded,
      });
    const queryBuilder = [];
    access_token && queryBuilder.push(`accessToken=${access_token}`);
    id_token && queryBuilder.push(`idToken=${id_token}`);
    refresh_token && queryBuilder.push(`refreshToken=${refresh_token}`);

    await sendRedirect(event, `/tokens?${queryBuilder.join("&")}`);
  } catch (e) {
    const data: ErrorData = { originalErrorMessage: (e as Error).message };
    throw createError({
      statusCode: 500,
      statusMessage: "Unable to fetch tokens",
      data,
    });
  }
});
