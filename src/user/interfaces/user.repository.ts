import { User } from '@/user/infra/entities';
import { SaveUserDTO } from '@/user/dto';

export abstract class IUserRepository {
  abstract create(data: SaveUserDTO): Promise<User>;
  abstract findByEmail(email: string): Promise<User>;
  abstract findById(id: string): Promise<User>;
}
