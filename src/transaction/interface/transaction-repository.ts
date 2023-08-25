import {
  ISummaryResponse,
  ITransactionsResponse,
} from '@/transaction/interface';
import { CreateTransactionDTO } from '@/transaction/dto';
import { Transaction } from '@/transaction/infra/entities';

export abstract class ITransactionRepository {
  abstract create(
    wallet_id: string,
    data: CreateTransactionDTO,
  ): Promise<Transaction>;
  abstract findById(id: string): Promise<Transaction>;
  abstract delete(id: string): Promise<void>;
  abstract update(transaction: Transaction): Promise<void>;
  abstract findAllByUserId(user_id: string): Promise<ITransactionsResponse[]>;
  abstract findAllByWalletId(wallet_id: string): Promise<ISummaryResponse>;
}
