import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { SaveUserDTO } from '@/user/dtos';
import { IDecodedTokenPayload, IUsersRepository } from '@/user/interfaces';

@Injectable()
export class SignInUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private jwtService: JwtService,
  ) {}

  private async decodeToken(jwtToken: string): Promise<SaveUserDTO> {
    const secret = process.env.AUTH0_CLIENT_SECRET;

    try {
      const { sub, name, email } =
        await this.jwtService.verifyAsync<IDecodedTokenPayload>(jwtToken, {
          secret,
        });

      const userPayload: SaveUserDTO = {
        id: sub,
        name,
        email,
      };

      return userPayload;
    } catch (err) {
      throw new UnauthorizedException();
    }
  }

  async execute(token: string): Promise<void> {
    const userPayload = await this.decodeToken(token);

    const user = await this.usersRepository.findByEmail(userPayload.email);

    if (!user) await this.usersRepository.create(userPayload);
  }
}
