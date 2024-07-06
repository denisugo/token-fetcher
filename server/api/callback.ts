import type { CredentialsDTO } from "~/types/credentials";
import type { ErrorData } from "~/types/error";
import type { TokensResponseDto } from "~/types/tokens";

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

  try {
    const { access_token, id_token, refresh_token }: TokensResponseDto =
      await $fetch(tokenUri!, {
        method: "POST",
        headers,
        body: urlencoded,
      });
    await sendRedirect(
      event,
      `/tokens?accessToken=${access_token}&idToken=${id_token}&refreshToken=${refresh_token}`,
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
