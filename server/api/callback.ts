import type { TokensDto } from "~/types/tokens";

export default defineEventHandler(async (event) => {
  const { grantType, clientId, clientSecret, tokenAddress } = (global as any)
    .credentials;
  const authoriazation = toBase64(`${clientId}:${clientSecret}`);
  const headers = new Headers();
  headers.append("Authorization", authoriazation);
  const tokens: TokensDto = await $fetch(tokenAddress, {
    method: "POST",
    headers,
    body: {
      grant_type: grantType,
    },
  });

  (global as any).tokens = tokens;

  await sendRedirect(event, "/tokens");
});
