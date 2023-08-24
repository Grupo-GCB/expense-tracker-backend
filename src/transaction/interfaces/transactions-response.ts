import { Transaction } from 'typeorm';

export interface ITransactionResponse {
  transactions: Transaction[];
}
