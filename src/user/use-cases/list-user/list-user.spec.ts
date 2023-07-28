import { User } from '@/user/infra/entities';
import { ListUserUseCase } from './list-user';
import { IUserRepository } from '@/user/infra/interfaces';

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
});
