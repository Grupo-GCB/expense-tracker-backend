import { ITransactionResponse } from '@/transaction/interface';

export abstract class ITransactionRepository {
  abstract findAllByUserId(user_id: string): Promise<ITransactionResponse[]>;
}
