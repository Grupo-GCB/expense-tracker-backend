import { Bank } from '@/bank/infra/entities';

export abstract class IBankRepository {
  abstract findById(id: string): Promise<Bank>;
  abstract findAll(): Promise<Bank[]>;
}
