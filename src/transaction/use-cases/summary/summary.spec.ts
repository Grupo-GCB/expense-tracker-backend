import { FindAllByWalletIdUseCase } from '@/transaction/use-cases/summary/summary';
import {
  ITransactionRepository,
  ISummaryResponse,
} from '@/transaction/interface';
import { Transaction } from '@/transaction/infra/entities';
import { Categories, TransactionType } from '@/shared/constants';

describe('Find All Transactions By Wallet ID', () => {
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

  const transaction: Transaction[] = [
    {
      id: '01',
      categories: Categories.CLOTHES,
      description: 'Transaction 1',
      value: 100.0,
      type: TransactionType.INCOME,
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

  it('should return transactions and balance if wallet is found', async () => {
    const transactions = [transaction, transaction];

    findAllByWalletIdMock.mockResolvedValue(transactions);

    const result: ISummaryResponse = await sut.execute(validWalletId);

    expect(result.transactions).toEqual(expect.arrayContaining(transactions));
    expect(result.balance).toBe(50.0);

    expect(findAllByWalletIdMock).toHaveBeenCalledWith(validWalletId);
  });

  it('should throw NotFoundException if wallet is not found', async () => {
    findAllByWalletIdMock.mockResolvedValue([]);

    await expect(sut.execute(validWalletId)).rejects.toThrowError(
      'Wallet with ID 12345 not found',
    );

    expect(findAllByWalletIdMock).toHaveBeenCalledWith(validWalletId);
  });
});
