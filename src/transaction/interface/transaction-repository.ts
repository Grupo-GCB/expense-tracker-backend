import { ITransactionResponse } from '@/transaction/interfaces';

export abstract class ITransactionRepository {
  abstract findAllByUserId(user_id: string): Promise<ITransactionResponse[]>;
}
