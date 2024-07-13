export default function (
  accessToken: string | null | undefined,
  idToken: string | null | undefined,
  refreshToken: string | null | undefined,
) {
  const queryBuilder = [];
  accessToken && queryBuilder.push(`accessToken=${accessToken}`);
  idToken && queryBuilder.push(`idToken=${idToken}`);
  refreshToken && queryBuilder.push(`refreshToken=${refreshToken}`);
  return queryBuilder.join("&");
}
