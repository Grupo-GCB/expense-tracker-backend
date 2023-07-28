import { HttpException, HttpStatus } from '@nestjs/common';

import { User } from '@/user/infra/entities';
import { ListUserUseCase } from './list-user';
import { IUserRepository } from '@/user/infra/interfaces';
import { HttpExceptionConstants } from '@/shared/constants/http-exception.constants';

describe('Get User', () => {
  let listUserUseCase: ListUserUseCase;
  let userRepository: jest.Mocked<IUserRepository>;

  const user_id = '123456';

  beforeAll(() => {
    userRepository = {
      findById: jest.fn(),
    } as jest.Mocked<IUserRepository>;

    listUserUseCase = new ListUserUseCase(userRepository);
  });

  it('should be able to return an user when found', async () => {
    const user: User = {
      id: user_id,
      name: 'John Doe',
      email: 'johndoe@example.com',
      created_at: new Date(),
    };

    userRepository.findById.mockResolvedValue(user);

    const result = await listUserUseCase.execute(user_id);

    expect(result).toEqual(user);
    expect(userRepository.findById).toHaveBeenCalledWith(user_id);
    expect(userRepository.findById).toHaveBeenCalledTimes(1);
  });

  it('should not be able to return user', async () => {
    userRepository.findById.mockResolvedValue(null);

    await expect(async () => {
      await listUserUseCase.execute('non_existent_user_id');
    }).rejects.toThrow(
      new HttpException(
        HttpExceptionConstants.USER_NOT_FOUND.message,
        HttpStatus.NOT_FOUND,
      ),
    );
  });
});
