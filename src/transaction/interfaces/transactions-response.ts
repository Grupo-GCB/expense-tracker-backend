import { Wallet } from '@/wallet/infra/entities';

export interface ITransactionsResponse {
  transactions: Wallet[];
}
