import { Injectable, UnauthorizedException } from '@nestjs/common';

import { IUserRepository } from '@/user/interfaces';
import { JwtAuthProvider } from '@/auth/providers';
import { SaveUserDTO } from '@/user/dto';

@Injectable()
export class SignInUseCase {
  constructor(
    private usersRepository: IUserRepository,
    private jwtAuthProvider: JwtAuthProvider,
  ) {}

  async execute(token: string): Promise<{ status: number; message: string }> {
    let userPayload: SaveUserDTO;
    try {
      userPayload = await this.jwtAuthProvider.decodeToken(token);
    } catch (err: any) {
      throw new UnauthorizedException({
        message: 'Token inválido.',
        reason: err.message,
      });
    }
    const user = await this.usersRepository.findByEmail(userPayload.email);

    if (!user) {
      await this.usersRepository.create(userPayload);
      return { status: 201, message: 'Usuário criado com sucesso.' };
    }

    return { status: 200, message: 'Usuário logado com sucesso.' };
  }
}
