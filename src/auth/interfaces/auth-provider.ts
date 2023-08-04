import { SaveUserDTO } from '@/user/dto';

export abstract class IJwtAuthProvider {
  abstract decodeToken(token: string): Promise<SaveUserDTO>;
}
