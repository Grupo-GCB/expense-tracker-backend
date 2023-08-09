import { Injectable, NotFoundException } from '@nestjs/common';

import { User } from '@/user/infra/entities';
import { IUserRepository, IUserResponse } from '@/user/interfaces';

@Injectable()
export class ListUserByIdUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(user_id: string): Promise<IUserResponse> {
    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return { user };
  }
}