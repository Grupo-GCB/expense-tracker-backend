import { User } from '@/user/infra/entities';

export interface ListUserByIdInput {
  user_id: string;
}

export interface ListUserByIdOutput {
  user: User;
}
