import { HttpException, HttpStatus } from '@nestjs/common';

import { User } from '@/user/infra/entities';
import { ListUserUseCase } from './list-user';
import { IUserRepository } from '@/user/infra/interfaces';
import { HttpExceptionConstants } from '@/shared/constants/http-exception.constants';

describe('Get User', () => {
  let listUserUseCase: ListUserUseCase;
  let userRepository: jest.Mocked<IUserRepository>;

  const user_id = '123456';

  beforeEach(() => {
    userRepository = {
      findById: jest.fn(),
    } as jest.Mocked<IUserRepository>;

    listUserUseCase = new ListUserUseCase(userRepository);
  });

  it('should be able to list a user by user id', async () => {
    const fakeUser: User = {
      id: user_id,
      name: 'John Doe',
      email: 'johndoe@example.com',
      created_at: new Date(),
    };

    userRepository.findById.mockResolvedValue(fakeUser);
  });

  it('should be able to throw HttpException when user is not found', async () => {
    userRepository.findById.mockResolvedValue(null);

    const promise = listUserUseCase.execute('non_existent_user_id');

    await expect(promise).rejects.toThrow(
      new HttpException(
        HttpExceptionConstants.USER_NOT_FOUND.message,
        HttpStatus.NOT_FOUND,
      ),
    );
  });

  it('should be able to return user when found', async () => {
    const fakeUser: User = {
      id: user_id,
      name: 'John Doe',
      email: 'johndoe@example.com',
      created_at: new Date(),
    };

    userRepository.findById.mockResolvedValue(fakeUser);

    const result = await listUserUseCase.execute(user_id);

    expect(result).toEqual(fakeUser);

    expect(userRepository.findById).toHaveBeenCalledWith(user_id);
  });
});
