import { NotFoundException } from '@nestjs/common';

import { User } from '@/user/infra/entities';
import { IUserRepository } from '@/user/interfaces';
import { FindUserByIdUseCase } from '@/user/use-cases';

describe('Find User By Id', () => {
  let sut: FindUserByIdUseCase;
  let findByIdMock: jest.SpyInstance;
  let userRepository: jest.Mocked<IUserRepository>;

  beforeAll(() => {
    userRepository = {
      findById: jest.fn(),
    } as unknown as jest.Mocked<IUserRepository>;

    sut = new FindUserByIdUseCase(userRepository);
    findByIdMock = jest.spyOn(userRepository, 'findById');
  });

  const validUserId = '123456';
  const invalidUserId = 'non-existent-user-id';

  const user: User = {
    id: validUserId,
    name: 'John Doe',
    email: 'johndoe@example.com',
    created_at: new Date(),
    wallet: [],
  };

  it('should be defined', () => {
    expect(userRepository).toBeDefined();
    expect(sut).toBeDefined();
    expect(findByIdMock).toBeDefined();
  });

  it('should be able to return an user', async () => {
    findByIdMock.mockResolvedValue(user);

    const result = await sut.execute(validUserId);

    expect(result.user).toEqual(user);
    expect(findByIdMock).toHaveBeenCalledWith(validUserId);
    expect(findByIdMock).toHaveBeenCalledTimes(1);
  });

  it('should not be able to return an user', async () => {
    findByIdMock.mockResolvedValueOnce(null);

    await expect(sut.execute(invalidUserId)).rejects.toThrowError(
      new NotFoundException('Usuário não encontrado.'),
    );
  });
});
