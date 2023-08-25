import { ITransactionResponse } from '@/transaction/interface';
import { CreateTransactionDTO } from '@/transaction/dto';
import { Transaction } from '@/transaction/infra/entities';

export abstract class ITransactionRepository {
  abstract create(
    wallet_id: string,
    data: CreateTransactionDTO,
  ): Promise<Transaction>;
  abstract findById(id: string): Promise<Transaction>;
  abstract findAllByUserId(user_id: string): Promise<ITransactionResponse[]>;
  abstract delete(id: string): Promise<void>;
}
