import { SaveUserDTO } from '@/user/dto';
import { User } from '@/user/infra/entities';

export abstract class IUserRepository {
  abstract create(data: SaveUserDTO): Promise<User>;
  abstract findByEmail(email: string): Promise<User>;
  abstract findById(id: string): Promise<User>;
}
