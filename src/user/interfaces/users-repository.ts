import { SaveUserDTO } from '@/user/dtos';
import { User } from '@/user/infra/entities';

export abstract class IUsersRepository {
  abstract create(data: SaveUserDTO): Promise<User>;
  abstract findByEmail(email: string): Promise<User>;
}
