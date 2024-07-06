export interface TokensResponseDto {
  access_token?: string;
  id_token?: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
}

export interface TokensQueryDto {
  accessToken?: string;
  idToken?: string;
  refreshToken?: string;
}
