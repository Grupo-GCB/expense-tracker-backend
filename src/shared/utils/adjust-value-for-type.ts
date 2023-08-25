import { CreateTransactionDTO } from '@/transaction/dto';
import { TransactionType } from '../constants';

export function adjustValueForType(data: CreateTransactionDTO): void {
  data.value = data.type === TransactionType.EXPENSE ? -data.value : data.value;
}
