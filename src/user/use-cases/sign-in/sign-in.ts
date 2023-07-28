import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { IUsersRepository } from '@/user/interfaces';
import { SaveUserDTO } from '@/user/dtos';
import { User } from '@/user/infra/entities';
import { IDecodedTokenPayload } from '@/user/interfaces/sign-in';

@Injectable()
export class SignInUseCase {
  constructor(
    private usersRepository: IUsersRepository,
    private jwtService: JwtService,
  ) {}

  private async decodeToken(jwtToken: string): Promise<SaveUserDTO> {
    const secret = process.env.AUTH0_SECRET;

    try {
      const decodedPayload = (await this.jwtService.verifyAsync(jwtToken, {
        secret,
      })) as IDecodedTokenPayload;

      const user: SaveUserDTO = {
        id: decodedPayload.user.sub,
        name: decodedPayload.user.name,
        email: decodedPayload.user.email,
      };

      return user;
    } catch {
      throw new UnauthorizedException();
    }
  }

  async execute(token: string): Promise<User> {
    const user = await this.decodeToken(token);

    const checkFirstLogin = await this.usersRepository.findByEmail(user.email);

    if (!checkFirstLogin) return this.usersRepository.create(user);
  }
}
