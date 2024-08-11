export interface AuthorizationCodeCredentialsDto {
  clientId?: string;
  clientSecret?: string;
  responseType?: ResponseType;
  scope?: string;
  authEndpoint?: string;
  tokenEndpoint?: string;
  callbackUri?: string;
}

export type ResponseType = "code" | "token";

export interface RefreshTokenCredentialsDto {
  refreshToken?: string;
  tokenEndpoint?: string;
  clientId?: string;
  clientSecret?: string;
}

export interface PkceCredentialsDto {
  clientId?: string;
  codeVerifier?: string;
  authEndpoint?: string;
  tokenEndpoint?: string;
  callbackEndpoint?: string;
}
