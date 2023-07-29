import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { IUsersRepository } from '@/user/interfaces';
import { SaveUserDTO } from '@/user/dtos';
import { User } from '@/user/infra/entities';
import { IDecodedTokenPayload } from '@/user/interfaces';

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

  async execute(token: string): Promise<User> {
    const userPayload = await this.decodeToken(token);

    const user = await this.usersRepository.findByEmail(userPayload.email);

    if (!user) return this.usersRepository.create(userPayload);
  }
}
