import { NotFoundException, Injectable } from '@nestjs/common';

import { User } from '@/user/infra/entities';
import { IUserRepository } from '@/user/infra/interfaces';

@Injectable()
export class ListUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(user_id: string): Promise<User> {
    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user;
  }
}
