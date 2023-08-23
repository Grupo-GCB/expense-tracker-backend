import { Transaction } from '@/transaction/infra/entities';

export interface ITransactionsResponse {
  transactions: Transaction[];
}
