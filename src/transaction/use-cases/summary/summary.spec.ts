import { FindAllByWalletIdUseCase } from '@/transaction/use-cases';
import {
  ITransactionRepository,
  ISummaryResponse,
} from '@/transaction/interface';
import { Transaction } from '@/transaction/infra/entities';
import { Categories, TransactionType } from '@/shared/constants';

describe('Find All Transactions By Wallet Id Use Case', () => {
  let sut: FindAllByWalletIdUseCase;
  let findAllByWalletIdMock: jest.SpyInstance;
  let transactionRepository: jest.Mocked<ITransactionRepository>;

  beforeEach(async () => {
    transactionRepository = {
      findAllByWalletId: jest.fn(),
    } as unknown as jest.Mocked<ITransactionRepository>;

    sut = new FindAllByWalletIdUseCase(transactionRepository);
    findAllByWalletIdMock = jest.spyOn(
      transactionRepository,
      'findAllByWalletId',
    );
  });

  const validWalletId = '12345';

  const transactions: Transaction[] = [
    {
      id: '01',
      categories: Categories.CLOTHES,
      description: 'Compra na Riachuelo',
      value: 100.0,
      type: TransactionType.INCOME,
      date: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
      wallet: null,
    },
    {
      id: '02',
      categories: Categories.FOOD,
      description: 'Balde do KFC',
      value: 50.0,
      type: TransactionType.EXPENSE,
      date: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
      wallet: null,
    },
  ];

  it('should be defined', () => {
    expect(transactionRepository).toBeDefined();
    expect(sut).toBeDefined();
  });

  it('should be able to return transactions and balance', async () => {
    findAllByWalletIdMock.mockResolvedValue({
      transactions,
    });

    const result: ISummaryResponse = await sut.execute(validWalletId);

    expect(result.transactions).toEqual(expect.arrayContaining(transactions));
    expect(result.balance).toBe(150.0);

    expect(findAllByWalletIdMock).toHaveBeenCalledWith(validWalletId);
  });
});
