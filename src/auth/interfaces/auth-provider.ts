import { SaveUserDTO } from '@/user/dto';

export interface IAuthProvider {
  decodeToken(token: string): Promise<SaveUserDTO>;
}
