import { Transaction } from '@/transaction/infra/entities';

export abstract class ITransactionRepository {
  abstract findAllByUserId(user_id: string): Promise<Transaction[]>;
}
