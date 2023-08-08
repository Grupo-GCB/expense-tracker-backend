import { Bank } from '@/bank/infra/entities';
import { FindBankByNameDTO } from '@/bank/dto/find-bank-by-name-dto';

export interface IBankRepository {
  findByName(data: FindBankByNameDTO): Promise<Bank[]>;
}
