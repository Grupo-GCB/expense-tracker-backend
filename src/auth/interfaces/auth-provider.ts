import { SaveUserDTO } from '@/user/dto';

export abstract class IAuthProvider {
  abstract decodeToken(token: string): Promise<SaveUserDTO>;
}
