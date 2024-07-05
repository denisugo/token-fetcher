export interface CredentialsDTO {
  identityPorvider?: IdentityPorvider;
  clientId?: string;
  clientSecret?: string;
  grantType?: GrantType;
  responseType?: ResponseType;
  scope?: string;
  authUri?: string;
  tokenUri?: string;
  callbackUri?: string;
}

export type IdentityPorvider = "AWS Cognito";

export type GrantType =
  | "Authorization Code"
  | "Implicit"
  | "Client Credentials";
export type ResponseType = "code" | "token";
