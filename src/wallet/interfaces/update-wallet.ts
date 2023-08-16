import { AccountType } from '@/shared/constants';

export interface IUpdateWallet {
  id: string;
  account_type: AccountType;
  description: string;
}
