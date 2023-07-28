interface IUserToken {
  nickname: string;
  name: string;
  picture: string;
  updated_at: Date;
  email: string;
  email_virified: boolean;
  iss: string;
  aud: string;
  iat: string;
  exp: string;
  sub: string;
  sid: string;
  nonce: string;
}

export interface IDecodedTokenPayload {
  userPayload: IUserToken;
}
