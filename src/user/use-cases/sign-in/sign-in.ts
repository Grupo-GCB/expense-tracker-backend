import { Injectable, UnauthorizedException } from '@nestjs/common';

import { IUserRepository } from '@/user/interfaces';
import { IJwtAuthProvider } from '@/auth/interfaces';
import { ISignInResponse } from '@/user/interfaces/sign-in-response';

@Injectable()
export class SignInUseCase {
  constructor(
    private usersRepository: IUserRepository,
    private jwtAuthProvider: IJwtAuthProvider,
  ) {}

  async execute(token: string): Promise<ISignInResponse> {
    try {
      const userPayload = await this.jwtAuthProvider.decodeToken(token);

      const user = await this.usersRepository.findByEmail(userPayload.email);

      if (!user) {
        await this.usersRepository.create(userPayload);
        return { status: 201, message: 'Usuário criado com sucesso.' };
      }

      return { status: 200, message: 'Usuário logado com sucesso.' };
    } catch (err: any) {
      throw new UnauthorizedException({
        message: 'Token inválido.',
        reason: err.message,
      });
    }
  }
}
