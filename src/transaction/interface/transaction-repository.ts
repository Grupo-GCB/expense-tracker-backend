import { Transaction } from '@/transaction/infra/entities';
import { CreateTransactionDTO } from '@/transaction/dto';

export abstract class ITransactionRepository {
  abstract create(
    wallet_id: string,
    data: CreateTransactionDTO,
  ): Promise<Transaction>;
}
