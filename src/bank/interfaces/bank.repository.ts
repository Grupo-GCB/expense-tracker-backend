import { Bank } from '@/bank/infra/entities';

export interface IBankRepository {
  findById(id: string): Promise<Bank>;
}
