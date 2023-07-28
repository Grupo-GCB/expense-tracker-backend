import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { User } from '@/user/infra/entities';
import { IUserRepository } from '@/user/infra/interfaces';
import { HttpExceptionConstants } from '@/shared/constants/http-exception.constants';

@Injectable()
export class ListUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(user_id: string): Promise<User> {
    const user = await this.userRepository.findById(user_id);

    if (!user) {
      throw new HttpException(
        HttpExceptionConstants.USER_NOT_FOUND.message,
        HttpStatus.NOT_FOUND,
      );
    }

    return user;
  }
}
