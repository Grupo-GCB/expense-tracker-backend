import { Transaction } from 'typeorm';

export interface ITransactionsResponse {
  transactions: Transaction[];
}
