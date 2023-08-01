import { Injectable } from '@nestjs/common';

import { IUserRepository } from '@/user/interfaces';
import { JwtAuthProvider } from '@/auth/providers';

@Injectable()
export class SignInUseCase {
  constructor(
    private usersRepository: IUserRepository,
    private jwtAuthProvider: JwtAuthProvider,
  ) {}

  async execute(token: string): Promise<void> {
    const userPayload = await this.jwtAuthProvider.decodeToken(token);

    const user = await this.usersRepository.findByEmail(userPayload.email);

    if (!user) await this.usersRepository.create(userPayload);
  }
}
