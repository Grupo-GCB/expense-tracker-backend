import { NotFoundException, Injectable } from '@nestjs/common';

import { IUserRepository } from '@/user/interfaces';
import { ListUserByIdInput, ListUserByIdOutput } from '@/user/interfaces';

@Injectable()
export class ListUserByIdUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute({ user_id }: ListUserByIdInput): Promise<ListUserByIdOutput> {
    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return { user };
  }
}
