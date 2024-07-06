export interface TokensResponseDto {
  access_token?: string;
  id_token?: string;
  refresh_token?: string;
}

export interface TokensQueryDto {
  accessToken?: string;
  idToken?: string;
  refreshToken?: string;
}
