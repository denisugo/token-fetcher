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
