import { SaveUserDTO } from '@/user/dtos/save-user-dto';

export abstract class IUsersRepository {
  abstract save(data: SaveUserDTO): Promise<void>;
}
