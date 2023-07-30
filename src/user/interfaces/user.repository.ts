import { User } from '@/user/infra/entities';

export abstract class IUserRepository {
  abstract findById(id: string): Promise<User>;
}
