export interface AuthorizationCodeCredentialsDTO {
  clientId?: string;
  clientSecret?: string;
  responseType?: ResponseType;
  scope?: string;
  authUri?: string;
  tokenUri?: string;
  callbackUri?: string;
}

export type ResponseType = "code" | "token";

export interface RefreshTokenCredentialsDto {
  refreshToken?: string;
  tokenUri?: string;
  clientId?: string;
  clientSecret?: string;
}
