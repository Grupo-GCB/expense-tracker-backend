import { SaveUserDTO } from '@/user/dto';
import { JwtService } from '@nestjs/jwt';
import * as jwksRsa from 'jwks-rsa';

import { IDecodedTokenPayload } from '@/user/interfaces';
import { IAuthProvider, IJwtHeader } from '@/auth/interfaces';

export class JwtAuthProvider extends JwtService implements IAuthProvider {
  private async getPublicKey(kid: string): Promise<string> {
    const jwksClient = jwksRsa({
      jwksUri: process.env.JWKS_URI,
    });

    const signingKey = await jwksClient.getSigningKey(kid);

    return signingKey.getPublicKey();
  }

  private decodeJwtHeader(jwtToken: string): IJwtHeader {
    const decodedHeader = this.decode(jwtToken, {
      complete: true,
    }) as IJwtHeader;

    const isDecodedHeaderValid =
      !decodedHeader || !decodedHeader.header || !decodedHeader.header.kid;

    if (isDecodedHeaderValid) {
      throw new Error('Cabeçalho de token inválido.');
    }

    return decodedHeader;
  }

  async decodeToken(jwtToken: string): Promise<SaveUserDTO> {
    const decodedHeader = this.decodeJwtHeader(jwtToken);
    const publicKey = await this.getPublicKey(decodedHeader.header.kid);

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
