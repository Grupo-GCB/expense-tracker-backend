import { SaveUserDTO } from '@/user/dto';
import { JwtService } from '@nestjs/jwt';
import * as jwksRsa from 'jwks-rsa';

import { IDecodedTokenPayload } from '@/user/interfaces';
import { IAuthProvider } from '@/auth/interfaces';

export class JwtAuthProvider extends JwtService implements IAuthProvider {
  async decodeToken(jwtToken: string): Promise<SaveUserDTO> {
    const decodedHeader = this.decode(jwtToken, {
      complete: true,
    });

    if (typeof decodedHeader === 'string')
      throw new Error('Cabeçalho de token inválido.');

    const jwksClient = jwksRsa({
      jwksUri: 'https://gcb-academy.us.auth0.com/.well-known/jwks.json',
    });

    const signingKey = await jwksClient.getSigningKey(decodedHeader.header.kid);
    const publicKey = signingKey.getPublicKey();

    const { sub, name, email } = await this.verifyAsync<IDecodedTokenPayload>(
      jwtToken,
      {
        publicKey,
        algorithms: ['RS256'],
      },
    );

    return {
      id: sub,
      name,
      email,
    };
  }
}
