import { Transaction } from '@/transaction/infra/entities';

export interface ISummaryResponse {
  transactions: Transaction[];
  balance: number;
}
